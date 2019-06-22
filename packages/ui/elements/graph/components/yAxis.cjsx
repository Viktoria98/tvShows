d3 = require 'd3'

@YAxis = React.createClass
  displayName: 'YAxis'

  componentDidUpdate: ->
    @renderAxis()
  componentDidMount: ->
    @renderAxis()

  renderAxis: ->

    formatValues = (d) ->
      if d > 999 and d < 1000000
        (d / 1000).toFixed(0) + 'K'
      else if d > 999999 and d < 1000000000
        (d / 1000000).toFixed(0) + 'M'
      else if d > 999999999 and d < 1000000000000
        (d / 1000000000).toFixed(0) + 'B'
      else
        d

    node = ReactDOM.findDOMNode(@)
    axis = d3.svg.axis().scale(@props.y).ticks(5).tickFormat((d) -> formatValues(d)).orient('left')
    d3.select(node).call axis

  render: ->
    (
      <g className="y axis #{@props.align}" transform={"translate(" + @props.translate + ", -10)"}></g>
    )
