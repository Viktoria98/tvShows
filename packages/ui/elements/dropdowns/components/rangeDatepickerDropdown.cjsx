moment = require 'moment-timezone'

@RangeDatepickerDropdown = React.createClass
  displayName: 'RangeDatepickerDropdown'

  getInitialState: ->
    open: false
    text: ''

  handleOpen: (event) ->
    if event
      event.preventDefault()
    if !@props.disabled
      @setState
        open: !@state.open
    @props.callbackOnOpen?()

  updateText: (newText) ->
    @setState
      text: newText

  render: ->
    (<div className={classNames 'dropdown -range', @props.className}>
      <button className={classNames 'dropdown__button', '-disabled': @props.disabled}
        onClick={@handleOpen}>{@state.text}</button>
      <div className={classNames 'dropdown__close', '-visible': @state.open} onClick={@handleOpen}></div>
      <div className={classNames 'dropdown__container', @props.alignment, '-visible': @state.open}>
        <RangeDatepicker selectedRange={@props.selectedRange} onChange={@props.onChange} updateText={@updateText}/>
      </div>
    </div>)
