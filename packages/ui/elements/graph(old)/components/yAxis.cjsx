@YAxis = React.createClass
  displayName: 'YAxis'

  componentDidUpdate: ->
    @renderAxis()
  componentDidMount: ->
    @renderAxis()

  renderAxis: ->
    node = ReactDOM.findDOMNode(@)
    axis = d3.svg.axis().scale(@props.y).ticks(5).orient('right')
    d3.select(node).call axis
    return

  render: ->
    (
      <g className="y axis" transform={"translate(" + @props.translate + ", -10)"}></g>
    )
