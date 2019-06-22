d3 = require 'd3'

@Line = React.createClass
  displayName: 'Line'

  componentDidUpdate: ->
    @renderLine()
  componentDidMount: ->
    @renderLine()

  renderLine: ->
    props = @props
    line = d3.svg.line()
      .interpolate("cardinal")
      .x((d) -> props.x d.date)
      .y((d) -> props.y d.value)

    d3.select(ReactDOM.findDOMNode(@))
      .attr 'd', line(@props.values)

  render: ->
    (
      <path className={classNames 'line', @props.color, 'enabled': @props.enabled}></path>
    )
