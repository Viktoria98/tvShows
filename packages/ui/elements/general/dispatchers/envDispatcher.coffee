@EnvDispatcher = ->

  switch Action.type()

    when 'ENV_PROD'
      GlobalStore.ENV = 'prod'

    when 'ENV_DEV'
      GlobalStore.ENV = 'dev'

  GlobalStore.envEvent()

module.exports = @EnvDispatcher
