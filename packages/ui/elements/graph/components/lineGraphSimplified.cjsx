moment = require 'moment-timezone'
d3 = require 'd3'
React = require 'react'

@LineGraphSimplified = React.createClass
  displayName: 'LineGraphSimplified'

  getInitialState: ->
    width: 0

  componentDidMount: ->
    @resize()
    window.addEventListener("resize", @resize)

  componentWillUnmount: ->
    window.removeEventListener("resize", @resize)

  resize: ->
    @setState width: @refs.container.offsetWidth

  render: ->
    data = @props.data

    #options
    height = 80
    horizontalPadding = 0
    margins = [15, 0, 15, 0]

    w = @state.width - (margins[1]) - (margins[3])
    h = height - (margins[0]) - (margins[2])

    startDate = if data[0] then data[0].date else moment().subtract(30, 'days').toDate()
    endDate = if data[data.length - 1] then data[data.length - 1].date else new Date()

    x = d3.time.scale()
          .domain([startDate, endDate])
          .range([horizontalPadding, w - horizontalPadding])
          .nice()

    y = d3.scale.linear().range([h, 0]).domain([0, d3.max(data, (d) ->
      d.value
    )]).nice()

    x.domain d3.extent(data, (d) -> d.date)
    y.domain [0, d3.max(data, (d) -> d.value)]

    dataNest = d3.nest().key((d) -> d.metric).entries(data)

    metrics = []
    lines = []

    dataNest.forEach (d, i) ->
      color = d.values[0].color
      metrics.push
        name: d.key
        color: color
      lines.push <Line key={i} values={d.values} color={color} x={x} y={y} enabled={true}/>
    , @

    (<div className="graphContainer" ref="container">
      <svg className="graph -simplified" width={@state.width} height={height}>
        <g transform={"translate(" + margins[3] + "," + margins[0] + ")"}>
          {lines}
        </g>
      </svg>
    </div>)

LineGraphLegend = React.createClass

  getInitialState: ->
    padding: '0px'

  componentDidMount: ->
    @setState padding: @refs.label.offsetWidth + 30 + "px"

  render: ->
    buttons = []
    @props.metrics.forEach (metric) ->
      buttons.push <LineGraphLegendButton name={metric.name} color={metric.color}
                                          selectMetric={@props.selectMetric}
                                          active={_.contains(@props.selectedMetric, metric.name)}/>
    , @

    (<div className="legend">
      <h3 ref="label">{@props.label}</h3>
      <div className="legend__buttons" style={{paddingLeft: @state.padding}}>
        {buttons}
      </div>
    </div>)

LineGraphLegendButton = React.createClass

  render: ->
    active =
    (<button className={classNames 'legend__button', @props.color, 'active': @props.active}
             onClick={@props.selectMetric.bind(null, @props.name)}>{@props.name}
    </button>)

`export default LineGraphSimplified`
