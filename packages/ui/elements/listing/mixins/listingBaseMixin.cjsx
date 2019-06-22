_ = require 'lodash'

@ListingBaseMixin =

  _clone: (obj) ->
    if obj
      JSON.parse JSON.stringify(obj), (key, value) ->
        if typeof value is 'string'
          a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value)
          if a
            return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]))
        value
    else
      return {}

  getInitialState: ->
    data: @_clone @store().data
    newData: @_clone @store().newData
    selectedRows: @_clone @store().selectedRows
    filtersUpdated: @store().filtersUpdated
    hasSelectedItems: false
    countSelectedRows: 0
    filterCounts: @_clone @store().filterCounts
    count: @store().count
    params: @store().params
    columns: @_clone @store().columns
    freezedColumnsCount: @store().resetAndCountFreezedColumnsForCurrentViewSettings()
    sortedColumns: @_clone @store().getAllSortedColumns()
    currentViewSettings: @_clone @store().getCurrentSettings()

  componentWillUnmount: ->
    @store().removeDataListener @_onDataChange
    @store().removeElementListener @_onElementChange
    if @store().storageKey is 'Reports'
      @store().removeUpdateReportsStatuses()

  componentWillMount: ->
    @store().addDataListener @_onDataChange
    @store().addElementListener @_onElementChange
    if @store().storageKey is 'Reports'
      @store().setUpdateReportsStatuses()
    @store().active true
    @store().init()
    @store().dataEvent()

  _onDataChange: ->
    @setState
      data: @_clone @store().data
      newData: @_clone @store().newData
      count: @store().count

  _onElementChange: ->
    @setState
      selectedRows: @_clone @store().selectedRows
      filtersUpdated: @_clone @store().filtersUpdated
      hasSelectedItems: @store().selectedRows.length > 0
      countSelectedRows: @store().selectedRows.length
      filterCounts: @_clone @store().filterCounts
      count: @store().count
      columns: @_clone @store().columns
      freezedColumnsCount: @store().resetAndCountFreezedColumnsForCurrentViewSettings()
      sortedColumns: @_clone @store().getAllSortedColumns()
      currentViewSettings: @_clone @store().getCurrentSettings()

  columnVisibility: (checked, options) ->
    @store().switchVisibilityAndRecheckFrozeness(checked, options)
    @store().modifySettingsIfPossible()
    @refreshListingAndSaveSettings()

  changeGroupsPositions: (sortedGroups, initialStartPos, endPos) ->
    @store().changeGroupsPositionsAndRecheckFrozeness(sortedGroups, initialStartPos, endPos)
    @store().modifySettingsIfPossible()
    @refreshListingAndSaveSettings()

  changeColumnsPositions: (sortedColumns, groupName) ->
    @store().changeColumnsPositionsAndRecheckFrozeness(sortedColumns, groupName)
    @store().modifySettingsIfPossible()
    @refreshListingAndSaveSettings()

  columnFreezed: (checked, options) ->
    @store().getCurrentGroups()[options.group].items[options.name].freezed = checked
    @store().modifySettingsIfPossible()
    @refreshListingAndSaveSettings()

  switchViewSettings: (settingsKey) ->
    @store().switchViewSettings(settingsKey)
    @refreshListingAndSaveSettings()

  createNewSettingsAndSwitch: (settingsLabel) ->
    @store().createNewViewSettings(settingsLabel)
    @store().switchViewSettings(settingsLabel)
    @refreshListingAndSaveSettings()

  removeCurrentSettings: ->
    @store().removeCurrentViewSettings()
    @store().switchViewSettingsToDefault()
    @refreshListingAndSaveSettings()

  refreshListingAndSaveSettings: ->
    @store().elementEvent()
    @refs.container.scrollLeft = 0
    Dispatch 'SAVE_SETTINGS'

module.exports = @ListingBaseMixin
