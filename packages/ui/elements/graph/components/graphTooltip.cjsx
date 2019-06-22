SimpleDate = require('../../formatters/SimpleDate').default

@GraphTooltip = React.createClass
  displayName: 'GraphTooltip'

  getInitialState: ->
    x: 0
    y: 0
    date: ''
    metric: ''
    value: 0
    visible: false
    wrapped: false
    locked: false

  componentWillReceiveProps: (nextProps) ->
    if nextProps and nextProps.data
      if nextProps.data.locked
        @setState locked: true
      else
        @setState
          x: nextProps.cx
          y: nextProps.cy + 50
          date: SimpleDate.format(nextProps.data.date, 'MMM Do, gggg, hh:mm A')
          metric: nextProps.data.metric
          value: nextProps.data.value
          visible: true
        , =>
          pos = @refs.cloud.getBoundingClientRect()
          if pos.left < 0 or pos.right > document.body.clientWidth
            @setState wrapped: true
    else
      @hideTooltip()

  unlockTooltip: ->
    @setState locked: false, ->
      @hideTooltip()

  hideTooltip: ->
    if !@state.locked
      @setState
        x: 0
        y: 0
        visible: false
        wrapped: false
        locked: false

  render: ->
    offset = if !@state.wrapped then 105 else 127
    (
      <div className={classNames 'graphTooltip', '-visible': @state.visible}>
        <div className="graphTooltip__cloud" ref="cloud"
             style={{left: @state.x + 'px', top: @state.y + 'px', transform: 'translate(-50%, -' + offset + 'px)'}}>
          <div className="graphTooltip__date">{@state.date}</div>
          <div className="graphTooltip__value">
            {@state.metric}: <span className={classNames '-shifted': @state.wrapped}>{@state.value}</span>
          </div>
        </div>
        <div className={classNames "graphTooltip__closer", '-visible': @state.locked} onClick={@unlockTooltip}></div>
      </div>
    )
