Event = new EventEmitter
Event.setMaxListeners 0
class @GraphEvents

  TOOLTIP_EVENT = 'tooltip'

  @tooltipEvent: ->
    Event.emit TOOLTIP_EVENT
  @addTooltipListener: (callback) ->
    Event.on TOOLTIP_EVENT, callback
  @removeTooltipListener: (callback) ->
    Event.removeListener TOOLTIP_EVENT, callback
