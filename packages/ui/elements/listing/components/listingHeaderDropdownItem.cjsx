@React = require 'react'
@ReactDOM = require 'react-dom'

@ListingHeaderDropdownItem = React.createClass
  displayName: 'ListingHeaderDropdownItem'

  getInitialState: ->
    open: false
    selectedItem: @props.options[0].text or ''
    offsetTop: null

  handleOpen: (event) ->
    event.preventDefault() if event
    if !@props.disabled
      @setState
        open: !@state.open
    @props.callbackOnOpen?()

  handleClick: (event) ->
    if ReactDOM.findDOMNode(@).contains(event.target)
      if event.target.dataset.value
        @setState
          selectedItem: event.target.textContent
          open: false
        @props.onChange?()
        Dispatch 'HEADER_CHANGE',
          column: @props.column
          value: event.target.dataset.value
        event.stopPropagation()
    else
      @setState open: false

  componentWillMount: ->
    document.addEventListener('click', @handleClick, false)

  componentWillUnmount: ->
    document.removeEventListener('click', @handleClick, false)

  componentDidMount: ->
    @setState offsetTop: @refs.parent.clientHeight + 6

  render: ->
    dropdownItems = @props.options.map (item) ->
      <li className={classNames 'dropdown__list__item', '-active': item.text is @state.selectedItem}
          data-value={item.value}>{item.text}</li>
    , @
    (<div className={classNames 'cell', @props.className}>
      <div className={classNames 'dropdown -header', @props.dropdownClassName, '-open': @state.open} ref="parent">
        <a className={classNames 'dropdown__link'} onClick={@handleOpen}>{@state.selectedItem or @props.name}</a>
        <ul className={classNames 'dropdown__list', '-visible': @state.open} ref="list" style={top: @state.offsetTop}>
          {dropdownItems}
        </ul>
      </div>
     </div>)
