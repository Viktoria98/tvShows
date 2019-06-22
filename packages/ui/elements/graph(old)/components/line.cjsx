@Line = React.createClass
  displayName: 'Line'

  componentDidUpdate: ->
    @renderLine()
  componentDidMount: ->
    @renderLine()

  renderLine: ->
    props = @props

    initialLine = d3.svg.line().x((d) -> props.x d.date ).y(props.h)
    finalLine  = d3.svg.line().x((d) -> props.x d.date ).y((d) -> props.y d.value )

    if @props.nonAnimated
      d3.select(ReactDOM.findDOMNode(@))
        .attr 'd', finalLine(@props.data)
    else
      d3.select(ReactDOM.findDOMNode(@))
        .attr 'd', initialLine(@props.data)
        .transition().duration(500)
        .attr 'd', finalLine(@props.data)

  render: ->
    (
      <path className="line"></path>
    )
