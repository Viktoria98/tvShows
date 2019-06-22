@Circles = React.createClass
  displayName: 'Circles'

  renderCircles: (coords) ->
    props =
      data:
        date: coords.date
        value: coords.value
      type: @props.type
      cx: @props.x coords.date
      cy: @props.y coords.value
      r: 5
    (
      <Circle {...props}/>
    )

  render: ->
    (
      <g className="circles">
        {@props.data.map @renderCircles}
      </g>
    )

Circle = React.createClass

  componentDidUpdate: ->
    @animate()
  componentDidMount: ->
    @animate()

  animate: ->
    d3.select(ReactDOM.findDOMNode(@))
      .style 'opacity', 0
      .transition().delay(500).duration(500)
      .style 'opacity', 1

  formatTime: (date) ->
    moment(date).format('MMM DD')

  handleMouseOver: ->
    Dispatch "SHOW_TOOLTIP", array: @props
  handleMouseOut: ->
    Dispatch "HIDE_TOOLTIP"

  render: ->
    tooltip = @formatTime(@props.data.date) + '<br/>' + @props.type + ': ' + @props.data.value
    (
      <circle data-tooltip={tooltip} className="dot" cx={@props.cx} cy={@props.cy} r={@props.r} onMouseOver={@handleMouseOver} onMouseOut={@handleMouseOut}></circle>
    )
