@ListingWordWrap =

  getInitialState: ->
    wordWrap: true

  componentDidMount: ->
    @setState
      wordWrap: @store().getCurrentWordWrap()

  toggleWordWrap: ->
    @setState
      wordWrap: @store().switchCurrentWordWrap()
    , =>
      @store().modifySettingsIfPossible();
      Dispatch('SAVE_SETTINGS')

module.exports = @ListingWordWrap
