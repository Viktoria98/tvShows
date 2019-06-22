@Gradient = React.createClass
  displayName: 'Gradient'

  render: ->
    (
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%" spreadMethod="pad">
          <stop offset="0%" stopColor="white" stopOpacity="1"></stop>
          <stop offset="100%" stopColor="#E5EEFE" stopOpacity="1"></stop>
        </linearGradient>
      </defs>
    )
