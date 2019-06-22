moment = require('moment')
require('moment-range')
ReactDatepicker = require('ff-react-daterange-picker')
require('ff-react-daterange-picker/dist/css/react-calendar.css')

@RangeDatepicker = React.createClass
  displayName: 'RangeDatepicker'

  ranges:
    week: '7days'
    twoWeeks: '14days'
    month: '30days'
    threeMonths: '90days'
    custom: 'custom'

  getInitialState: ->
    if @props.selectedRange
      selectedRange:
        startDate: moment(@props.selectedRange.startDate).startOf('day')
        endDate: moment(@props.selectedRange.endDate).endOf('day')
        selectedTab: @props.selectedRange.selectedTab
    else
      selectedRange:
        startDate: moment().subtract(29, 'days').startOf('day')
        endDate: moment().endOf('day')
        selectedTab: @ranges.month

  componentDidMount: ->
    @updateDatepicker @state.selectedRange, false

  tabChanged: (selectedTab) ->
    selectedRange =
      startDate: @state.selectedRange.startDate
      endDate: @state.selectedRange.endDate
      selectedTab: selectedTab
    @updateDatepicker selectedRange

  handleSelect: (range, states) ->
    selectedRange =
      startDate: range.start
      endDate: range.end
      selectedTab: 'custom'
    @updateDatepicker selectedRange

  updateDatepicker: (selectedRange, triggerChange = true) ->
    switch selectedRange.selectedTab
      when @ranges.week
        selectedRange.startDate = moment().subtract(6, 'day').startOf('day')
        text = 'Last 7 days'
        selectedRange.endDate = moment().endOf('day')
      when @ranges.twoWeeks
        selectedRange.startDate = moment().subtract(13, 'day').startOf('day')
        text = 'Last 14 days'
        selectedRange.endDate = moment().endOf('day')
      when @ranges.month
        selectedRange.startDate = moment().subtract(29, 'day').startOf('day')
        text = 'Last 30 days'
        selectedRange.endDate = moment().endOf('day')
      when @ranges.threeMonths
        selectedRange.startDate = moment().subtract(89, 'day').startOf('day')
        text = 'Last 90 days'
        selectedRange.endDate = moment().endOf('day')
      else
        selectedRange.endDate = selectedRange.endDate.endOf('day')
        text =
          moment(selectedRange.startDate).format('MMMM D, YYYY') + ' - ' +
          moment(selectedRange.endDate).format('MMMM D, YYYY')
    @props.updateText?(text)
    @setState
      selectedRange: selectedRange
    , ->
      if triggerChange
        @props.onChange?(
          @state.selectedRange.startDate.toDate(),
          @state.selectedRange.endDate.toDate(),
          @state.selectedRange.selectedTab
        )

  render: ->
    (<div className="rangeDatepicker">
      <div className="rangeDatepicker__ranges">
        <li className={classNames 'dropdown__header__item', '-active': @state.selectedRange.selectedTab == @ranges.week}
          onClick={@tabChanged.bind(null, @ranges.week)}>Last 7 days</li>
        <li className={classNames 'dropdown__header__item', '-active': @state.selectedRange.selectedTab == @ranges.twoWeeks}
          onClick={@tabChanged.bind(null, @ranges.twoWeeks)}>Last 14 days</li>
        <li className={classNames 'dropdown__header__item', '-active': @state.selectedRange.selectedTab == @ranges.month}
          onClick={@tabChanged.bind(null, @ranges.month)}>Last 30 days</li>
        <li className={classNames 'dropdown__header__item', '-active': @state.selectedRange.selectedTab == @ranges.threeMonths}
          onClick={@tabChanged.bind(null, @ranges.threeMonths)}>Last 90 days</li>
        <li className={classNames 'dropdown__header__item', '-active': @state.selectedRange.selectedTab == @ranges.custom}
          onClick={@tabChanged.bind(null, @ranges.custom)}>Custom</li>
      </div>
      <div className="rangeDatepicker__calendars">
        <ReactDatepicker
          firstOfWeek={0}
          numberOfCalendars={2}
          selectionType='range'
          maximumDate={new Date()}
          stateDefinitions={@stateDefinitions}
          showLegend={false}
          value={moment.range(@state.selectedRange.startDate, @state.selectedRange.endDate)}
          onSelect={@handleSelect} />
      </div>
    </div>)
