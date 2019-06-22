@ListingPrepopulatePopupMixin =

  getInitialState: ->
    data: {}

  componentDidMount: ->
    @store().addElementListener @_onSelectingRows

  componentWillUnmount: ->
    @store().removeElementListener @_onSelectingRows

  _onSelectingRows: ->
    title = @props.title + ' (' + @store().selectedRows.length + ' left)' if @store().selectedRows.length > 1
    data = @_prepopulate()
    @setState
      title: title
      data: data

  _prepopulate: ->
    return {} unless @store().selectedRows.length
    element = @store().data[@store().selectedRows[0]]
    element = @store().newData[@store().selectedRows[0]] unless element
    data = {}
    data[key] = value for own key, value of element
    data

module.exports = @ListingPrepopulatePopupMixin
