UI = require 'meteor/ff:ui'
MultiSelectDropdown = UI.MultiSelectDropdown

@FilterByMultipleDropdown = React.createClass

  displayName: 'FilterByMultipleDropdown'

  getOptionsMap: ->
    optionsMap = {}
    for option in @props.options
      optionsMap[option.name] = {}
      for item in option.items
        optionsMap[option.name][item.value] = item
    optionsMap

  addFilter: (name, value) ->
    if @props.options.length > 1
      selected = @_getSelected name
      selected.push value
      index = selected.indexOf(@getOptionsMap()[name][value].oppositeValue)
      if index isnt -1
        selected.splice(index, 1)
      Dispatch 'ADD_FILTER',
        filter_by: name
        value: selected
        delay: @props.delay

  removeFilter: (name, value) ->
    if @props.options.length > 1
      selected = @_getSelected name
      selected = selected.filter (filter) -> filter isnt value
      Dispatch 'ADD_FILTER',
        filter_by: name
        value: selected
        delay: @props.delay

  clickAll: (unselected) ->
    if @props.overall
      @props.overall()
    else
      filters = []
      for filter in unselected
        filters.push filter_by: filter.name, value: null
      Dispatch 'ADD_FILTER', multiple: filters

  _getSelected: (name) ->
    selected = []
    for option in @props.options
      if option.name is name
        for item in option.items
          selected.push item.value if item.selected
        break
    selected

  render: ->
    label = @props.label
    options = @props.options
    (<MultiSelectDropdown label={label} options={options}
      add={@addFilter} remove={@removeFilter} clickAll={@clickAll}/>)
