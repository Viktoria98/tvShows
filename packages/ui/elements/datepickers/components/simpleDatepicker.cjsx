Dropdown = require('../../dropdowns/components/Dropdown').default

@SimpleDatepicker = React.createClass
  displayName: 'SimpleDatepicker'

  getInitialState: ->
    days: []
    day: ''
    daysDisabled: true
    month: ''
    year: ''

  changeDate: ->
    @props.onChange? month: @state.month, day: @state.day, year: @state.year

  _populateDays: (month, cb) ->
    days = [1..new Date(@state.year, month, 0).getDate()]

    daysOptions = days.map (day) ->
      text: day, value: day
    @setState days: daysOptions, cb

  setMonth: (value) ->
    @setState
      month: value
      daysDisabled: false
      day: ''
    , =>
      @_populateDays parseInt value
      @changeDate()

  setDay: (value) ->
    @setState
      day: value
    , =>
      @changeDate()

  setYear: (value) ->
    @setState
      year: value
    , =>
      @_populateDays parseInt @state.month
      @changeDate()

  componentWillReceiveProps: (props) ->
    if props.value
      @_populateDays parseInt(props.value.month), =>
        @setState
          month: props.value.month
          day: props.value.day
          year: props.value.year

  render: ->
    months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July'
      'August', 'September', 'October', 'November', 'December'
    ].map (month, n) ->
      text: month, value: n + 1
    years = [new Date().getFullYear()..1980].map (year) ->
      text: year, value: year
    (<div className="datepicker">
      <Dropdown className={classNames 'dropdown__month', '-error': @props.error} ref="month" options={months}
        placeholder="Month" onChange={@setMonth} value={@state.month} />
      <Dropdown className={classNames 'dropdown__day', '-error': @props.error} ref="day" options={@state.days}
        disabled={@state.daysDisabled} placeholder="Day" onChange={@setDay} value={@state.day} />
      <Dropdown className={classNames 'dropdown__year', '-error': @props.error} ref="year" options={years}
        placeholder="Year" onChange={@setYear} value={@state.year} />
    </div>)
