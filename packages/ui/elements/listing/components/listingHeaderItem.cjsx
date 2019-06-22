@ListingHeaderItem = React.createClass
  displayName: 'ListingHeaderItem'

  render: ->
    if !@props.singleLined
      array = @props.name.split(' ')
      length = array.length
      if length > 2
        biggerHalf = Math.round(length / 2)
        lesserHalf = length - biggerHalf
      else
        biggerHalf = length
      firstLine = array.slice(0, biggerHalf).join(' ')
      secondLine = array.slice(biggerHalf, length).join(' ')
    else
      firstLine = @props.name
    (<div className={classNames 'cell', @props.className}>
      <span className="limiter" title={@props.title}>
        <span className="line">{firstLine}</span>
        <span className="line">{secondLine}</span>
      </span>
    </div>)
