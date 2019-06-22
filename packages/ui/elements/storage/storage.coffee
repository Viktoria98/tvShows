class @Storage

  @set: (key, value) ->
    localStorage.setItem key, JSON.stringify value

  @get: (key) ->
    ret = localStorage.getItem key
    if ret
      return JSON.parse ret, (key, value) ->
        if typeof value is 'string'
          a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value)
          if a
            return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]))
        value

  @delete: (key) ->
    localStorage.removeItem key
