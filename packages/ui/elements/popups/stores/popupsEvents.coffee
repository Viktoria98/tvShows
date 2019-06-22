Event = new EventEmitter
Event.setMaxListeners 0
class @PopupsEvents

  POPUP_EVENT = 'popup'

  @popupsEvent: (open, data, popup) ->
    Event.emit POPUP_EVENT, open, data, popup
  @addPopupsListener: (callback) ->
    Event.on POPUP_EVENT, callback
  @removePopupsListener: (callback) ->
    Event.removeListener POPUP_EVENT, callback

module.exports = @PopupsEvents
