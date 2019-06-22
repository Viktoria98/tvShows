@Dots = React.createClass
  displayName: 'Dots'

  renderDots: (coords) ->
    props =
      data:
        metric: coords.metric
        date: coords.date
        value: coords.value
        color: coords.color
      type: @props.type
      cx: if @props.dates.length is 1 then 720 else @props.x coords.date
      cy: @props.y coords.value
      r: 4
      showTooltip: @props.showTooltip
      resetTooltip: @props.resetTooltip
      lockTooltip: @props.lockTooltip
    (
      <Dot {...props}/>
    )

  render: ->
    (
      <g className="dots">
        {@props.data.map @renderDots}
      </g>
    )

Dot = React.createClass

  mouseEnter: ->
    @props.showTooltip @props

  mouseLeave: ->
    @props.resetTooltip()

  click: (event) ->
    @props.lockTooltip()

  render: ->
    (
      <circle className={classNames 'dot', @props.data.color} cx={@props.cx} cy={@props.cy} r={@props.r}
              onMouseEnter={@mouseEnter} onMouseLeave={@mouseLeave} onClick={@click} ref="dot"></circle>
    )
