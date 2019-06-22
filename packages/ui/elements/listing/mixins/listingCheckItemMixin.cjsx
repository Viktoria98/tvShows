@ListingCheckItemMixin =

  counter: 0

  getInitialState: ->
    checked: !!@props.checked

  componentDidMount: ->
    @store().addElementListener @_onElementChange

  componentWillUnmount: ->
    @store().removeElementListener @_onElementChange

  _onElementChange: (args) ->
    return if !@refs.checkboxItem
    return if args and ((args.target and args.target isnt @props.target) or (!args.target and @props.target))
    return if args and args.selected is @props.id and @state.checked is true
    return if args and args.unselected is @props.id and @state.checked is false
    return unless args and (args.selected or args.unselected)
    if args.selected is 'all' or args.unselected is 'all'
      checked = args.selected is 'all'
    else if args.selected isnt @props.id and args.unselected isnt @props.id
      return
    else if args.selected is @props.id
      return if @refs.checkboxItem.state.checked is true
      checked = true
    else if args.unselected is @props.id
      return if @refs.checkboxItem.state.checked is false
      checked = false
    if @refs.checkboxItem
      @refs.checkboxItem.setState checked: checked, =>
        @setState checked: checked

  _afterChange: ->
    event = if @state.checked then 'SELECT_ONE' else 'UNSELECT_ONE'
    Dispatch event, item: @props.id
    if @store().action is 'StatsAction'
      Dispatch 'CREATE_CUSTOM_GRAPH'

  itemClick: ->
    @counter++
    # timeout is amount of time during which second click will be considered as doubleclick
    setTimeout ( => @counter = 0), 450
    # if doubleclick fired and item is already checked - don't uncheck it
    if @counter > 1 and @state.checked then return
    # if single click fired - toggle check state
    if @store().selectedRows.length >= 5 and @store().action is 'StatsAction' and !@state.checked
      Dispatch 'NOTIFICATION', kind: 'alert', message: 'Max 5 metrics for custom graph'
      return
    @setState checked: !@state.checked, =>
      @refs.checkboxItem.setState checked: @state.checked, @_afterChange
      @props.cb? @props.id, @state.checked, @props.store

module.exports = @ListingCheckItemMixin
