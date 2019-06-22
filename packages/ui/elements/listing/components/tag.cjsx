@Tag = React.createClass
  displayName: 'Tag'

  onClick: (event) ->
    if @props.handleClick then @props.handleClick() else event.preventDefault()
  render: ->
    (<button className={classNames('tag', @props.color)} onClick={@onClick}>{@props.name}</button>)
