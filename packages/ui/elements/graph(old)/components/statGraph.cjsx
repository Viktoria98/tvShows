@StatGraph = React.createClass
  displayName: 'StatGraph'

  getInitialState: ->
    width: 0

  componentDidMount: ->
    @setState width: @refs.stat.clientWidth

  shouldComponentUpdate: (nextProps, nextState) ->
    @props.statData.toString() != nextProps.statData.toString() ||
    @state.width != nextState.width

  render: ->
    #options
    height = 50
    horizontalPadding = 40

    w = @state.width - horizontalPadding
    h = height

    x = d3.time.scale()
          .domain([@props.statData[0].date, @props.statData[@props.statData.length - 1].date])
          .range([0, w])

    y = d3.scale.linear().range([h, 0]).domain([0, d3.max(@props.statData, (d) ->
      d.value
    )]).nice()

    (
      <div className="stat" ref="stat" onClick={@props.handleClick.bind null, {data: @props.statData, type: @props.statType}}>
        <div className="stat__name">{@props.statName}</div>
        <div className="stat__value">{@props.statValue}</div>
        <div className={"stat__dynamics " + @props.statDynamics.direction}>{@props.statDynamics.value}</div>
        <svg className="graph -small" width={@state.width} height={height}>
          <g>
            <Area data={@props.statData} x={x} y={y} h={h} />
            <Line data={@props.statData} x={x} y={y} h={h} />
          </g>
        </svg>
      </div>
    )
