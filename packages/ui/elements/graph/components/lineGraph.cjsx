moment = require 'moment-timezone'
d3 = require 'd3'
React = require 'react'
Format = require('../../formatters/Format').default

@LineGraph = React.createClass
  displayName: 'LineGraph'

  getInitialState: ->
    width: 0
    selectedMetric: @props.savedMetric or []
    tooltipData: null

  initSelectedMetric: ->
    @setState selectedMetric: @props.savedMetric or []

  componentDidMount: ->
    @resize()
    window.addEventListener("resize", @resize)

  componentWillUnmount: ->
    window.removeEventListener("resize", @resize)

  resize: ->
    @setState width: @refs.container.offsetWidth

  selectMetric: (metric) ->
    array = @state.selectedMetric.slice()
    if _.contains(array, metric)
      @setState selectedMetric: _.without(array, metric), ->
        @saveMetric()
    else
      array.push(metric)
      @setState selectedMetric: array, ->
        @saveMetric()

  saveMetric: ->
    @props.onChange(@state.selectedMetric, @props.label)

  showTooltip: (data) ->
    data.data.value = Format.number data.data.value
    @setState tooltipData: data

  resetTooltip: ->
    @setState tooltipData: null

  lockTooltip: ->
    newData = @state.tooltipData
    newData.data.locked = true
    @setState tooltipData: newData

  render: ->
    data = @props.data

    dates = _.uniq(data.map (d) -> d.date.toString()).map (d) -> new Date(d)

    if dates.length is 1 and typeof @displayDotsOnStart is 'undefined'
      @displayDotsOnStart = true

    #options
    height = 300
    horizontalPadding = 120
    margins = [30, 0, 30, 0]

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
    dotsData = []
    noMetricSelected = _.isEmpty(@state.selectedMetric)

    dataNest.forEach (d, i) ->
      color = d.values[0].color
      metrics.push
        name: d.key
        color: color
      if dates.length is 1 and @displayDotsOnStart
        @state.selectedMetric.push d.key
      selected = _.contains(@state.selectedMetric, d.key) or selected
      if selected then dotsData = dotsData.concat d.values
      enabled = noMetricSelected or selected
      lines.push <Line key={i} values={d.values} color={d.values[0].color} x={x} y={y} enabled={enabled}/>
    , @

    if !noMetricSelected or dates.length is 1
      dots = <Dots data={dotsData} x={x} y={y} type={@state.selectedMetric} showTooltip={@showTooltip}
        resetTooltip={@resetTooltip} lockTooltip={@lockTooltip} dates={dates}/>
    @displayDotsOnStart = dates.length isnt 1
    (<div className="graphOuterContainer" ref="container">
      <LineGraphLegend metrics={metrics} selectMetric={@selectMetric}
        selectedMetric={@state.selectedMetric} label={@props.label} />
      <div className="graphInnerContainer">
        <svg className="graph" width={@state.width} height={height}>
          <g transform={"translate(" + margins[3] + "," + margins[0] + ")"}>
            <XAxis x={x} h={h} translate={x: (if dates.length is 1 then 600 else 0), y: h + 25}} data={dates}/>
            <YAxis y={y} translate="40" align="left"/>
            <YAxis y={y} translate={w - 5} align="right"/>
            <Grid w={w} y={y}/>
            {lines}
            {dots}
          </g>
        </svg>
        <GraphTooltip {...@state.tooltipData}/>
      </div>
    </div>)

LineGraphLegend = React.createClass

  getInitialState: ->
    padding: '0px'

  render: ->
    buttons = []
    @props.metrics.forEach (metric, i) ->
      buttons.push <LineGraphLegendButton key={i} name={metric.name} color={metric.color}
                                          selectMetric={@props.selectMetric}
                                          active={_.contains(@props.selectedMetric, metric.name)}/>
    , @

    (<div className="legend">
      <span>{@props.label}</span>
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

`export default LineGraph`
