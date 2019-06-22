class @GraphStore extends GraphEvents
  
  @visible: false
  @tooltipCoords: {
    x: 0
    y: 0
  }
  @date: null
  @value: null
  @type: null

  @updateTooltip: (array) ->
    @visible = true
    @tooltipCoords = {
      x: array.cx
      y: array.cy
    }
    @date = array.data.date
    @value = array.data.value
    @type = array.type
    @tooltipEvent()

  @hideTooltip: ->
    @visible = false
    @tooltipCoords = {
      x: 0
      y: 0
    }
    @tooltipEvent()
