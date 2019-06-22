@GraphTooltip = React.createClass
  displayName: 'GraphTooltip'

  store: ->
    GraphStore

  getInitialState: ->
    visible: false
    x: @store().tooltipCoords.x
    y: @store().tooltipCoords.y
    date: @store().date
    value: @store().value
    type: @store().type

  componentDidMount: ->
    @store().addTooltipListener @_updateTooltip
    @setState x: @state.x - @refs.tooltip.clientWidth / 2

  formatTime: (date) ->
    moment(date).format('MMM DD')

  _updateTooltip: ->
    width = @refs.tooltip.clientWidth
    @setState
      visible: @store().visible
      x: @store().tooltipCoords.x
      y: @store().tooltipCoords.y - 15
      date: @formatTime @store().date
      value: @store().value
      type: @store().type

  render: ->
    (<div ref="tooltip" className={classNames 'tooltip', '-visible': @state.visible} style={{left: @state.x + 'px', top: @state.y + 'px'}}>
        <div className="tooltip__holder">
          <div className="tooltip__date">{@state.date}</div>
          <div className="tooltip__value">{@state.type} : {@state.value}</div>
        </div>
     </div>)
