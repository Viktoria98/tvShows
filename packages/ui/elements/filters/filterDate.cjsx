@FilterByDate = React.createClass
  displayName: 'FilterByDate'

  setValue: (firstDate, secondDate, selectedTab) ->
    @props.onChange? firstDate, secondDate, selectedTab
    unless @props.onChange
      Dispatch 'ADD_FILTER',
        filter_by: @props.name
        value: [firstDate, secondDate]

  render: ->
    (<RangeDatepickerDropdown onChange={@setValue} selectedRange={@props.selectedRange} alignment={@props.alignment} />)
