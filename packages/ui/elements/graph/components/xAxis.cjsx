d3 = require 'd3'

@XAxis = React.createClass
  displayName: 'XAxis'

  componentDidUpdate: ->
    @renderAxis()
  componentDidMount: ->
    @renderAxis()

  renderAxis: ->
    node = ReactDOM.findDOMNode(@)
    data = @props.data
    if data.length > 14
      ticks = []
      totalTicks = 7
      firstDate = data[0]
      lastDate = data[data.length - 1]
      tickRange = data.length / totalTicks
      n = 0
      for i in [0...totalTicks]
        date = data[Math.floor(n)]
        if date
          ticks.push date
          n = n + tickRange
      ticks.push lastDate
    else
      ticks = data

    axis = d3.svg.axis().scale(@props.x).tickValues(ticks).tickFormat(d3.time.format('%b %d'))
    d3.select(node).call axis

  render: ->
    (
      <g className="x axis" transform={"translate(" + @props.translate.x + ", " + @props.translate.y + ")"}></g>
    )
