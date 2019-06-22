@ListingDispatcher = (store) ->

  switch Action.type()

    when 'ADD_DATA'
      store.showLoading true
      store.getCounts()
      store.getData ->
        if store.checkedAll
          Dispatch 'SELECT_ALL', fromAdd: true
        store.showLoading false

    when 'SAVE_SETTINGS'
      store.wordWrap = Action.wordWrap if Action.wordWrap?
      store.saveSettings()

    when 'DELETE_DATA'
      store.deleteData()

    when 'SELECT_ONE'
      ##store.checkedAll = store.offset is (store.selectedRows.length + 1)
      itemId = '_' + Action.item
      if store.popup.open
        target = store.popup.target
        store.selectedPopupRows[target].push itemId
        if not store.checkedAllPopup
          data = store.popupData[target]
          if data
            if Object.keys(data).length is store.selectedPopupRows[target].length
              Dispatch 'SELECT_ALL'
      else if itemId not in store.selectedRows
        store.excludedRows.splice(store.excludedRows.indexOf(Action.item), 1)
        store.selectedRows.push itemId
        if not store.checkedAll
          if store.selectedRows.length is store.count
            Dispatch 'SELECT_ALL'
        store.articlesCount = undefined
      store.elementEvent selected: Action.item
      if Action.cb
        Action.cb()

    when 'UNSELECT_ONE'
      ##store.checkedAll = false
      if store.popup.open and store.popup.target isnt 'disallowedUrlPopup'
        target = store.popup.target
        store.selectedPopupRows[target] = _.difference(store.selectedPopupRows[target], ['_' + Action.item])
        if not store.selectedPopupRows[target].length and store.checkedAllPopup
          Dispatch 'UNSELECT_ALL'
      else
        if(store.checkedAll)
          store.excludedRows.push Action.item
          if store.excludedRows.length is store.count
            Dispatch 'UNSELECT_ALL'
        store.selectedRows = _.difference(store.selectedRows, ['_' + Action.item])
        store.articlesCount = undefined
      store.elementEvent unselected: Action.item

    when 'SELECT_ALL'
      if store.excludedRows.length < 1 and store.exclude and store.exclude.length > 0
        store.excludedRows = store.exclude
        store.exclude = []
      store.selectAll()
      if store.popup.open and store.popup.target isnt 'edit' and store.popup.target isnt 'disallowedUrlPopup'
        store.checkedAllPopup = true
        store.elementEvent selected: 'all', target: store.popup.target
      else
        store.checkedAll = true
        store.articlesCount = undefined
        store.elementEvent selected: 'all'
        if not Action.fromAdd
          store.excludedRows = []
        store.excludedRows.forEach (item) ->
          store.elementEvent unselected: item, target: target
          store.selectedRows = _.difference(store.selectedRows, ['_' + item])

    when 'UNSELECT_ALL'
      if store.popup.open
        target = store.popup.target
        store.checkedAllPopup = false
        store.selectedPopupRows[target] = []
        store.elementEvent unselected: 'all', target: target
      else
        store.checkedAll = false
        store.selectedRows = []
        store.excludedRows = []
        store.articlesCount = undefined
        store.elementEvent unselected: 'all'

    when 'OPEN_POPUP'
      store.form = {}
      store.popup.open = true
      store.popup.target = Action.target
      store.popup.fromRedirect = Action.fromRedirect
      store.popup.exportToGoogle = Action.exportToGoogle
      store.popup.data = Action.data
      store.popup.args = Action
      target = Action.target
      data = store.popupData[target]
      if Action.target is 'csvReport'
        store.checkedAllPopup = true
        Dispatch 'SELECT_ALL'
      else if data
        store.checkedAllPopup = Object.keys(data).length is store.selectedPopupRows[target].length
        if store.checkedAllPopup
          Dispatch 'SELECT_ALL'
      store.elementEvent()
      if Action.target is 'countryList'
        store.selectedPopupRows[Action.target] = []
        store.elementEvent unselected: 'all', target: Action.target
        if Action.data.length == 0
          store.selectItem '0'
        else
          for item in Action.data
            store.selectItem item

    when 'OPEN_POPUP_FROM_POPUP'
      # clearing previous popup before opening
      store.popup.open = false
      store.popup.exportToGoogle = false
      store.articlesCount = undefined
      store.elementEvent()

      store.form = {}
      store.popup.open = true
      store.popup.target = Action.target
      store.popup.exportToGoogle = Action.exportToGoogle
      store.popup.fromRedirect = Action.fromRedirect
      store.popup.data = Action.data
      store.popup.args = Action
      target = Action.target
      data = store.popupData[target]
      if data
        store.checkedAllPopup = Object.keys(data).length is store.selectedPopupRows[target].length
        if store.checkedAllPopup
          Dispatch 'SELECT_ALL'
      store.elementEvent()

    when 'CLOSE_POPUP'
      store.popup.open = false
      store.popup.exportToGoogle = false
      store.articlesCount = undefined
      store.elementEvent()

    when 'HEADER_CHANGE'
      store.elementEvent
        column: Action.column
        value: Action.value

    when 'REFRESH_ITEM'
      store.updateForm?(Action.item)
      store.elementEvent()
      store.dataEvent()

    when 'CREATE_CUSTOM_GRAPH'
      store.createCustomGraph()
      store.dataEvent()

module.exports = @ListingDispatcher
