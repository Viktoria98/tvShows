@XAxis = React.createClass
  displayName: 'XAxis'

  componentDidUpdate: ->
    @renderAxis()
  componentDidMount: ->
    @renderAxis()

  renderAxis: ->
    node = ReactDOM.findDOMNode(@)
    axis = d3.svg.axis().scale(@props.x).tickSize(-@props.h).tickFormat(d3.time.format('%b %d'))
    if @props.dataLength < 10
      axis = axis.ticks(d3.time.day)
    d3.select(node).call axis
    return

  render: ->
    (
      <g className="x axis" transform={"translate(0, " + @props.translate + ")"}></g>
    )
