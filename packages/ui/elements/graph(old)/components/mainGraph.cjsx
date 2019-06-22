@MainGraph = React.createClass
  displayName: 'MainGraph'

  getInitialState: ->
    width: 0

  componentDidMount: ->
    @setState width: @refs.mainGraphContainer.offsetWidth

  render: ->
    #options
    height = 300
    horizontalPadding = 100
    margins = [50, 0, 50, 0]

    w = @state.width - (margins[1]) - (margins[3])
    h = height - (margins[0]) - (margins[2])

    x = d3.time.scale()
          .domain([@props.data[0].date, @props.data[@props.data.length - 1].date])
          .range([horizontalPadding, w - horizontalPadding])

    y = d3.scale.linear().range([h, 0]).domain([0, d3.max(@props.data, (d) ->
      d.value
    )]).nice()

    (
      <div className="mainGraphContainer" ref="mainGraphContainer">
        <svg className="graph" width={@state.width} height={height}>
          <g transform={"translate(" + margins[3] + "," + margins[0] + ")"}>
            <XAxis x={x} h={h} translate={h + 10} dataLength={@props.data.length}/>
            <YAxis y={y} translate='40'/>
            <YAxis y={y} translate={w - 80}/>
            <Area data={@props.data} x={x} y={y} h={h}/>
            <Line data={@props.data} x={x} y={y} h={h}/>
            <Circles data={@props.data} x={x} y={y} type={@props.type}/>
            <Lines w={w} y={y}/>
            <Gradient/>
          </g>
        </svg>
        <Tooltip/>
      </div>
    )
