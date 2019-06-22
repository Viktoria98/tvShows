@Area = React.createClass
  displayName: 'Area'

  componentDidUpdate: ->
    @renderArea()
  componentDidMount: ->
    @renderArea()

  renderArea: ->
    props = @props

    initialArea = d3.svg.area().x((d) -> props.x d.date ).y0(props.h).y1(props.h)
    finalArea = d3.svg.area().x((d) -> props.x d.date ).y0(props.h).y1((d) -> props.y d.value )

    if @props.nonAnimated
      d3.select(ReactDOM.findDOMNode(@))
        .attr 'd', finalArea(@props.data)
    else
      d3.select(ReactDOM.findDOMNode(@))
        .attr 'd', initialArea(@props.data)
        .transition().duration(500)
        .attr 'd', finalArea(@props.data)



  render: ->
    (
      <path className="area"></path>
    )
