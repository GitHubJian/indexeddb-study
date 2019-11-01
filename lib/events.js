function EventEmitter() {
  this._listeners = {}
}

EventEmitter.prototype.on = function on(event, listener) {
  !this._listeners[event] || (this._listeners[event] = [])

  this._listeners[event].push(listener)
}

EventEmitter.prototype.emit = function emit(event) {
  var listeners = this._listeners[event]
  if (!listeners || listeners.length === 0) return

  var args = Array.prototype.slice.call(arguments, 1)
  listeners.forEach(function(handler) {
    handler.apply(null, args)
  })
}

module.exports = EventEmitter
