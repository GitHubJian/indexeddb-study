var global = {
  name: 'FileSystem',
  version: 1,
  db: null,
  isAvailable: !1,
  isOpen: !1,
  ajaxApi: '/api/filediff',
  throttleTime: 100,
  syncTime: 3e5,
  fileLimit: 4e4
}

var OBJECT_STORE_NAME = 'fileList'

var indexMap = {
  path: [
    'path',
    ['parent_path', 'isdir', 'server_time'],
    {
      unique: !1
    }
  ]
}

function pify(obj, success, error) {
  return new Promise(function(resolve, reject) {
    success
      ? (obj[success] = function(res) {
          resolve(res)
        })
      : (obj.onsuccess = function(res) {
          resolve(res)
        })

    error
      ? (obj[error] = function(err) {
          reject(err)
        })
      : (obj.onerror = function(err) {
          reject(err)
        })
  })
}

function open(name, version) {
  var request = indexedDB.open(name, version)

  request.onupgradeneeded = function(req) {
    var objectStore,
      db = req.target.result,
      transaction = req.target.transaction

    objectStore = db.objectStoreNames.contains(OBJECT_STORE_NAME)
      ? transaction.objectStore(OBJECT_STORE_NAME)
      : db.createObjectStore(OBJECT_STORE_NAME, {
          keyPath: 'path'
        })

    for (var key in indexMap) {
      if (indexMap.hasOwnProperty(key)) {
        if (!objectStore.indexNames.contains(key)) {
          debugger
          objectStore.createIndex.apply(objectStore, indexMap[key])
        }
      }
    }
  }

  return pify(request)
}

function write(storeName, obj) {
  var transaction = global.db.transaction(storeName, 'readwrite')
  var objectStore = transaction.objectStore(storeName)

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var o = obj[key]
      o.isdelete ? objectStore['delete'](o.path) : objectStore.put(o)
    }
  }

  return pify(transaction, 'oncomplete')
}

function clear(storeName) {
  var transaction = global.db.transaction(storeName, 'readwrite')
  var objectStore = transaction.objectStore(storeName)
  var req = objectStore.clear()

  return pify(req)
}

function openCursor(storeName) {
  var transaction = global.db.transaction(storeName, 'readonly')
  var objectStore = transaction.objectStore(storeName)
  var req = objectStore.openCursor()

  return pify(req)
}

function count(storeName) {
  var transaction = global.db.transaction(storeName, 'readonly')
  var objectStore = transaction.objectStore(storeName)
  var req = objectStore.count()

  return pify(req)
}

function support() {
  return 'object' !== typeof indexedDB ? !1 : !0
}

function start() {
  support() &&
    open(global.name, global.version).then(
      function(e) {
        global.db = e.target.result
        global.isOpen = !0
      },
      function() {
        global.isOpen = !1
        global.isAvailable = !1
      }
    )
}

start()

function isAvailable() {
  return global.isOpen
}

window.$idb = {
  isAvailable: isAvailable,
  write: write
}
