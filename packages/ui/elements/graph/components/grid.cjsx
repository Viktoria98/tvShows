@Grid = React.createClass
  displayName: 'Grid'

  renderLines: (coords, i) ->
    props =
      x1: 0
      x2: @props.w
      y1: @props.y coords
      y2: @props.y coords
    (
      <line key={i} className="stroke horizontal" {...props}></line>
    )

  render: ->
    (
      <g className="grid">
        {@props.y.ticks(5).map @renderLines}
      </g>
    )
