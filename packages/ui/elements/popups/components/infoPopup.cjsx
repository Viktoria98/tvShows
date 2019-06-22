UI = require 'meteor/ff:ui'
React = require 'react'
BaseMixin = UI.BaseMixin
ReactDOM = require 'react-dom'

@InfoPopup = React.createClass
  displayName: 'InfoPopup'

  mixins: [BaseMixin(PopupsStore)]

  getInitialState: ->
    open: false
    data: null
    popup: null

  popstateHandler: (event) ->
    @close()
    window.removeEventListener "popstate", @popstateHandler

  keydownHandler: (event) ->
    keyCodes =
      TAB: 9
    if event.keyCode == keyCodes.TAB
      event.preventDefault()

  componentDidMount: ->
    @store().addPopupsListener @_onPopupData

  _onPopupData: (open, data, popup) ->
    if !@state.open
      document.addEventListener "keydown", @keydownHandler
    window.addEventListener "popstate", @popstateHandler
    @setState
      open: open
      data: data if data and open or null
      popup: popup

  close: ->
    document.removeEventListener "keydown", @keydownHandler
    Dispatch "HIDE_INFO_POPUP"

  render: ->
    body = <@state.popup open={@state.open} close={@close} data={@state.data}/> if @state.popup and @state.data
    return body or false

module.exports = @InfoPopup
