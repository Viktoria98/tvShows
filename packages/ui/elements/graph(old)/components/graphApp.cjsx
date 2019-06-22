@GraphApp = React.createClass
  displayName: 'GraphApp'

  getInitialState: ->
    mainGraphData: null
    mainGraphType: null

  componentWillMount: ->
    @setState
      mainGraphData: @parseDate @props.data[0].graphData
      mainGraphType: @props.data[0].type

  componentDidMount: ->
    Ps.initialize @refs.statsContainer

  componentWillUpdate: ->
    true

  shouldComponentUpdate: (nextProps, nextState) ->
    @state.mainGraphData.toString() != nextState.mainGraphData.toString() ||
    @state.mainGraphType != nextState.mainGraphType

  parseDate: (array) ->
    parse = d3.time.format('%Y-%m-%d').parse
    parsed = _.map(array, _.clone)
    parsed.map (d) ->
      d.date = new Date parse(d.date)
    parsed

  handleGraphChange: (object) ->
    @setState
      mainGraphData: object.data
      mainGraphType: object.type

  render: ->
    statGraphs = _.map @props.data, (item) ->
      <StatGraph statData={@parseDate item.graphData} statType={item.type} statName={item.name} statValue={item.value} statDynamics={item.dynamics} handleClick={@handleGraphChange}/>
    , @
    (
      <div>
        <MainGraph data={@state.mainGraphData} type={@state.mainGraphType} />
        <div className="statsContainer" ref="statsContainer">
          {statGraphs}
        </div>
      </div>
    )
