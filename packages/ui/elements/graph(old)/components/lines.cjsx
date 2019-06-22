@Lines = React.createClass
  displayName: 'Lines'

  renderLines: (coords) ->
    props =
      x1: 0
      x2: @props.w
      y1: @props.y coords
      y2: @props.y coords
    (
      <line className="line horizontal" {...props}></line>
    )

  render: ->
    (
      <g className="lines">
        {@props.y.ticks(5).map @renderLines}
      </g>
    )
