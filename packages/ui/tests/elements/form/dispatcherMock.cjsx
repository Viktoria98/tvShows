@Dispatch = (name, action) ->
  if name and action
    @dispatched = {
      name
      action
    }
  else
    return @dispatched
