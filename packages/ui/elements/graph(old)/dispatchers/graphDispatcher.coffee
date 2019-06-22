@GraphDispatcher = (store) ->

  switch Action.type()

    when 'SHOW_TOOLTIP'
      store.updateTooltip Action.array

    when 'HIDE_TOOLTIP'
      store.hideTooltip()
