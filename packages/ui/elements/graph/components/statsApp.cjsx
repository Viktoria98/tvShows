React = require 'react'

@StatsApp = React.createClass
  displayName: 'StatsApp'

  render: ->
    stats = _.map @props.data, (item) ->
      <Stat name={item.name} info={item.info}/>
    , @
    (<div className="statsApp">
        {stats}
      </div>)

Stat = React.createClass

  render: ->
    info = _.map @props.info, (item) ->
      <StatInfo name={item.name} value={item.value}/>
    , @
    (<div className="statApp">
        <div className="statApp__name">{@props.name}</div>
        {info}
      </div>)

StatInfo = React.createClass

  render: ->
    (<div className="statApp__info">
      <div className="statApp__info__name">{@props.name}</div>
      <div className="statApp__info__value">{@props.value}</div>
    </div>)

`export default StatsApp`
