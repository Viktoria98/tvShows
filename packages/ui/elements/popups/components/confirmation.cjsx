UI = require 'meteor/ff:ui'
BaseMixin = UI.BaseMixin
BasePopupMixin = UI.BasePopupMixin

@Confirmation = React.createClass
  displayName: 'Confirmation'

  mixins: [BaseMixin(), BasePopupMixin('confirmation')]

  confirm: ->
    callBackAction = @props.store.popup.args.dispatchConfirm
    Dispatch('CLOSE_POPUP', target: @props.store.popup.args.target).then(callBackAction)

  render: ->
    if typeof(@props.store.popup.args) == 'undefined'
      @props.store.popup.args = {}
      @props.store.popup.args.message = ''

    (<Popup title="" open={@state.open} close={@close}>
      <p>{@props.store.popup.args.message}</p>
      <p>
        <button className="button -primary" onClick={@confirm} >Confirm</button>
        <span className="pull-right">&nbsp&nbsp</span>
        <button className="button" onClick={@close} >Cancel</button>
      </p>
    </Popup>)
