Event = new EventEmitter
Event.setMaxListeners 0
class @GlobalEvents

  ENV_EVENT = 'environment'

  @envEvent: ->
    Event.emit ENV_EVENT
  @addEnvListener: (callback) ->
    Event.on ENV_EVENT, callback
    -> Event.removeListener ENV_EVENT, callback
  @removeEnvListener: (callback) ->
    Event.removeListener ENV_EVENT, callback

module.exports = @GlobalEvents
