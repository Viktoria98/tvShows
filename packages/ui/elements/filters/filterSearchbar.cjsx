UI = require 'meteor/ff:ui'
BaseMixin = UI.BaseMixin

@FilterBySearch = React.createClass
  displayName: 'FilterBySearch'

  mixins: [BaseMixin()]

  _searchValue: ''
  _dispatchTimeout: 0

  componentWillUnmount: ->
    @store().removeDataListener @_afterDataEvent

  componentWillMount: ->
    @store().addDataListener @_afterDataEvent

  updateSearch: (value) ->
    clearTimeout @_dispatchTimeout
    @_searchValue = value
    @_dispatchTimeout = setTimeout =>
      Dispatch 'ADD_FILTER',
        filter_by: @props.name
        value: @_searchValue
    , 500
    return unless @_searchValue.length

  _afterDataEvent: ->
    $('.searchbar__input').blur()

  render: ->
    (<MinimalSearchbar updateSearch={@updateSearch} initialValue={@props.initialValue} doSubmit={@props.doFilter} />)
