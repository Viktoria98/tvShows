@PopupsDispatcher = (store) ->

  switch Action.type()

    when 'SHOW_INFO_POPUP'
      store.openPopup Action.data, Action.popup
    when 'HIDE_INFO_POPUP'
      store.hidePopup()

module.exports = @PopupsDispatcher
