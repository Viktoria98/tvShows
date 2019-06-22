React = require 'react'
classNames = require 'classnames'

@Popup = React.createClass
  displayName: 'OldPopup'

  componentDidMount: ->
    if @props.esc then @refs.popupCont.addEventListener "keydown", @props.esc, false else @refs.popupCont.addEventListener "keydown", @escClosing, false

  componentDidUpdate: ->
    @refs.popupCont.focus()
    scrollfade = @refs.scrollfade
    if (@refs.popupBody.clientHeight == 0)
      scrollfade.style.display = 'block'
      @refs.close.classList.add('-fixed')
    else if (@refs.popupBody.clientHeight == @refs.popupBody.scrollHeight)
      scrollfade.style.display = 'none'
      @refs.close.style = ''
      @refs.close.classList.remove('-fixed')
    else if(@refs.popupBody.clientHeight < @refs.popupBody.scrollHeight)
      rightIndent = ((@refs.popupBody.clientWidth / 2) - 20)
      topIndent = (@refs.popupBody.offsetTop + 20)
      @refs.close.style = "right: calc(50% - #{rightIndent}px); top: #{topIndent}px;"
      @refs.close.classList.add('-fixed')

  handleScroll: (e) ->
    @refs.scrollfade.style.display = 'none'
    if (@refs.popupBody.scrollTop)
      @refs.close.classList.add('-bordered')
    else if(@refs.popupBody.scrollTop == 0)
      @refs.close.classList.remove('-bordered')

  escClosing: (event) ->
    if event.keyCode == 27
      console.log 'POPUP'
      event.stopImmediatePropagation()
      @props.close()

  render: ->
    (<div tabIndex={2} ref="popupCont" id={@props.id} className={classNames 'popup', @props.className, @props.type, '-visible': @props.open}>
      <div className="popup__background" onClick={@props.close}></div>
      <div className="popup__body" ref="popupBody" onScroll={@handleScroll}>
        <div ref="scrollfade" className="popup__scrollfade-y"></div>
        <h2 id="popupHeader" className="popup__heading">{@props.title}</h2>
        <div id="close" ref="close" className="popup__close close" onClick={@props.close}></div>
        {@props.children}
      </div>
    </div>)

module.exports = @Popup
