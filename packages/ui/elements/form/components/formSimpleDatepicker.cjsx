@FormSimpleDatepicker = React.createClass
  displayName: 'FormSimpleDatepicker'

  _change: (value) ->
    Dispatch 'FORM_FIELD_VALUE_CHANGE',
      name: @props.name
      value: value

  render: ->
    (<div className="form__group">
      <label className="form__label">{@props.label}</label>
      <SimpleDatepicker value={@props.value} onChange={@_change} error={@props.error} />
      <p className={classNames 'form__error', '-visible': @props.error}>{@props.error}</p>
    </div>)
