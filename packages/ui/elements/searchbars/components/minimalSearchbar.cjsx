React = require 'react'

@MinimalSearchbar = React.createClass
  displayName: 'MinimalSearchbar'

  getInitialState: ->
    value: @props.initialValue

  onChange: (event) ->
    value = event.target.value
    searchValue = value.trim().toLowerCase()
    @setState value: value, =>
      @props.updateSearch? searchValue

  onSubmit: (event) ->
    if event.which == 13 or event.keyCode == 13
      @props.doSubmit?(@state.value)

  render: ->
    (<div className="searchbar">
        <input type="text" className="searchbar__input" placeholder="Search"
          onChange={@onChange} value={@state.value} onKeyDown={@onSubmit} />
    </div>)

module.exports = @MinimalSearchbar
