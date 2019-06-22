@FormDispatcher = (store) ->

  switch Action.type()

    when 'FORM_FIELD_VALUE_CHANGE'
      store.form[Action.name] = Action.value
      store.elementEvent()

    when 'FORM_SUBMIT'
      store.saveItem()

module.exports = @FormDispatcher
