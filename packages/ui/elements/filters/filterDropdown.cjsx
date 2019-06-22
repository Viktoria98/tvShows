@FilterByDropdown = React.createClass
  displayName: 'FilterByDropdown'

  setValue: (value) ->
    Dispatch 'ADD_FILTER',
      filter_by: @props.name
      value: value

  render: ->
    (<Dropdown onChange={@setValue} options={@props.options} placeholder={@props.label} />)
