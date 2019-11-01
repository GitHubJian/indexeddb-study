var Wrapped = {}

var Wrapper = {
  initialized: false
}

var queue = []
var activeState
var initializedState = Wrapped
var notInitializedState = {
  initialize: function(callback) {
    Wrapper.initialized = true
    activeState = initializedState

    queue.forEach(function(q) {
      var cmd = q.cmd,
        args = q.args

      Wrapped[cmd].apply(Wrapped, args)
    })

    queue = []

    callback && callback()
  }
}

Object.getOwnPropertyNames(Wrapper.prototype).forEach(function(prop) {
  if (prop !== 'constructor') {
    Wrapper[prop] = function() {
      activeState[prop].apply(activeState, arguments)
    }

    if (prop !== 'initialize') {
      notInitializedState[prop] = function() {
        return queue.push({
          cmd: prop,
          args: arguments
        })
      }
    }
  }
})

activeState = notInitializedState

module.exports = wrapper
