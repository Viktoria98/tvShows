@Searchbar = React.createClass
  displayName: 'Searchbar'

  getInitialState: ->
    active: false
  activate: ->
    @setState
      active: true
  deactivate: ->
    @setState
      active: false
  handleButton: (event) ->
    event.preventDefault()
    @props.doSearch
  render: ->
    (<div className="searchbar">
      <form onSubmit={@props.doSearch}>
        <input type="text" className="searchbar__input" placeholder="Search" onChange={@props.updateSearch} onFocus={@activate} onBlur={@deactivate}/>
        <button className={classNames 'searchbar__button', '-visible': @state.active} onMouseDown={@handleButton}>Go</button>
      </form>
    </div>)
