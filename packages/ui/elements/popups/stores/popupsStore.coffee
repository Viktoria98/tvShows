PopupsEvents = require('./popupsEvents')

class @PopupsStore extends PopupsEvents
  @openPopup: (data, popup) ->
    @popupsEvent true, data, popup

  @hidePopup: ->
    @popupsEvent false

module.exports = @PopupsStore
