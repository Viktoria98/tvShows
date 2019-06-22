SimpleDate = require('../../formatters/SimpleDate').default

@ListingDateRangeMixin =

  getInitialState: ->
    custom: false

  changeInterval: (firstDate, secondDate, selectedTab) ->
    @store().common.selectedRange = startDate: firstDate, endDate: secondDate, selectedTab: selectedTab
    Dispatch 'ADD_FILTER',
      filter_by: 'date'
      value: [firstDate, secondDate]

  componentWillUnmount: ->
    @store().removeDataListener @_onDateChange

  componentWillMount: ->
    @store().addDataListener @_onDateChange

  _onDateChange: ->
    custom = false
    if @store().common.selectedRange?.selectedTab is 'custom'
      custom =
        SimpleDate.getStartDate(@store().common.selectedRange.startDate).format('MMMM D, YYYY') + ' - ' +
        SimpleDate.getEndDate(@store().common.selectedRange.endDate).format('MMMM D, YYYY')
    @setState custom: custom

module.exports = @ListingDateRangeMixin
