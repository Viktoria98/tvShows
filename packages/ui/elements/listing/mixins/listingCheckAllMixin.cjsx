@ListingCheckAllMixin =

  componentDidMount: ->
    @store().addElementListener @_onElementChange
  _onElementChange: (args) ->
    if args and @refs.checkboxAll
      @refs.checkboxAll.setState checked: @store().checkedAll
      @setState allChecked: @store().checkedAll
    if @refs.checkboxAllPopup
      @refs.checkboxAllPopup.setState checked: @store().checkedAllPopup
      @setState allCheckedPopup: @store().checkedAllPopup
  handleCheckbox: ->
    if (@refs.checkboxAll and @refs.checkboxAll.props.checked) or (@refs.checkboxAllPopup and @refs.checkboxAllPopup.props.checked)
      if @props.isPopup
        @setState allCheckedPopup: false
      else
        @setState allChecked: false
      Dispatch 'UNSELECT_ALL'
    else
      if @props.isPopup
        @setState allCheckedPopup: true
      else
        @setState allChecked: true
      Dispatch 'SELECT_ALL'

module.exports = @ListingCheckAllMixin
