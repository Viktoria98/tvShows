/* eslint-disable no-param-reassign */

import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Dispatch as dispatch } from 'meteor/meteorflux:meteorflux';

import ListingEvents from './listingEvents';

import SimpleDate from '../../formatters/SimpleDate';

const DAY = 1000 * 60 * 60 * 24;

export default class ListingStore extends ListingEvents {
  constructor () {
    super();

    this.errorHandler = this.errorHandler.bind(this);
    this.getGeoData = this.getGeoData.bind(this);
    // Suffix storage keys with version
    // to prevent bugs and to add compatiblity for mgirations
    this.storageVersion = 18;
    this.storageCommon = 'Common';

    this.isActive = false;

    this.isSaving = false;

    // Override this in parent
    this.offset = 0;
    this.limit = 50;
    this.action = '';

    this.startLoadingTimeout = false;
    this.loaderTimeout = false;
    this.loaderLongTimeout = false;

    this.columnViewSettings = {
      defaultSettings: 'default',
      maxLockedColumns: 3,
      lockableColumnIndexes: [],
      settings: {
        default: {
          label: 'Default template',
          name: 'default',
          groups: {
            general: {
              label: 'General',
              position: 0,
              visible: true,
              items: {},
            },
          },
          wordWrap: false,
          freezedColumnsCount: 0,
        },
        currentSettings: {},
      },
    };

    this.storageKey = '';

    this.data = {};
    this.newData = {};
    this.selectedRows = [];
    this.excludedRows = [];
    this.checkedAll = false;
    this.checkedAllPopup = false;

    this.filterCounts = {};

    this.popupData = {};
    this.selectedPopupRows = {};

    this.userCity = localStorage.getItem('userCity') || '';
    this.userTimezone = localStorage.getItem('userTimezone') || '';
    this.userCityUpdated = false;
    this.userTimezoneUpdated = false;
  }

  init () {
    this.filtersUpdated = false;
    this.filterTimeout = false;

    this.data = {};
    this.newData = {};

    this.selectedRows = [];
    this.excludedRows = [];

    this.selectedPopupRows = {};
    this.popupData = {};
    this.popup = {
      open: false,
      target: '',
      exportToGoogle: false,
    };

    this.form = {};

    this.count = 0;
    this.totalArticles = 0;
    this.wordWrap = false;

    this.scrolled = 0;
    this.scrollLeft = 0;

    this.restoreSettings();
    this.rewind();

    this.elementEvent();

    this.initialized = true;
    this.setPopupData('statsReport', this.statsPopupRows);
  }

  copyCurrentSettingsFromDefault () {
    const copyOfDefaultSettings = _
      .cloneDeep(this.columnViewSettings.settings[this.columnViewSettings.defaultSettings]);
    this.columnViewSettings.settings.currentSettings = copyOfDefaultSettings;
  }

  copyDefaultFromCurrentSettings () {
    this.columnViewSettings.settings[this.columnViewSettings.defaultSettings] = _
      .cloneDeep(this.getCurrentSettings());
  }

  isDefaultSettings () {
    return this.getCurrentSettings().name === 'default';
  }

  canModifyExistingSettings () {
    return !this.isDefaultSettings();
  }

  modifySettingsIfPossible () {
    this.copyDefaultFromCurrentSettings();
  }

  removeCurrentViewSettings () {
    delete this.columnViewSettings.settings[this.columnViewSettings.defaultSettings];
  }

  createNewViewSettings (settingsKey) {
    this.columnViewSettings.settings[settingsKey] = _.cloneDeep(this.getCurrentSettings());
    this.columnViewSettings.settings[settingsKey].label = `${settingsKey} (user)`;
    this.columnViewSettings.settings[settingsKey].name = settingsKey;
  }

  switchViewSettings (settingsKey) {
    this.columnViewSettings.defaultSettings = settingsKey;
    this.copyCurrentSettingsFromDefault();
  }

  switchViewSettingsToDefault () {
    this.switchViewSettings('default');
  }

  getCurrentSettings () {
    return this.columnViewSettings.settings.currentSettings;
  }

  getCurrentWordWrap () {
    return this.getCurrentSettings().wordWrap;
  }

  switchCurrentWordWrap () {
    const curSettings = this.getCurrentSettings();
    curSettings.wordWrap = !curSettings.wordWrap;
    return curSettings.wordWrap;
  }

  getViewSettingsTitles () {
    const settingsTitles = [];
    _.mapValues(this.columnViewSettings.settings, (settings, settingsKey) => {
      if (settingsKey === 'currentSettings') {
        return;
      }
      settingsTitles.push({ key: settingsKey, label: settings.label });
    });
    return settingsTitles;
  }

  getCurrentFreezedColumnsCount () {
    return this.getCurrentSettings().freezedColumnsCount;
  }

  getCurrentGroupColumns (groupName) {
    return this.getCurrentSettings().groups[groupName].items;
  }

  getCurrentGroups () {
    return this.getCurrentSettings().groups;
  }

  unfreezeAllColumnsForGroup (groupName) {
    _.mapValues(this.getCurrentGroupColumns(groupName), (column) => {
      column.freezed = false;
      return column.freezed;
    });
  }

  getColumn (columnName) {
    let column;
    _.mapValues(this.getCurrentGroups(), (group) => {
      _.mapValues(group.items, (col) => {
        if (col.name === columnName) {
          column = col;
        }
      });
    });
    return column;
  }

  getAllSortedColumns () {
    const columns = [];
    const currentGroups = this.getCurrentGroups();
    _.mapValues(currentGroups, (group) => {
      _.mapValues(group.items, (column) => {
        columns.push(column);
      });
    });
    const sortedColumns = _.sortBy(columns, ['groupPosition', 'position']);
    return sortedColumns;
  }

  setInitialColumnPositionsAndNames () {
    _.mapValues(this.columnViewSettings.settings, (settings) => {
      _.mapValues(settings.groups, (group, groupKey) => {
        group.name = groupKey;
        this.setGroupVisibilityBasedOnColumns(group);
        _.mapValues(group.items, (column, columnKey) => {
          column.name = columnKey;
          column.groupPosition = group.position;
          column.position = column.position || 0;
        });
      });
    });
  }

  /* Need refactoring here for fix eslint errors */
  getGeoData () {
    // eslint-disable-next-line
    return new Promise((resolve, reject) => {
      if (this.userCity && this.userTimezone && this.userTimezoneUpdated && this.userCityUpdated) {
        return resolve();
      }

      // eslint-disable-next-line
      HTTP.call('GET', 'https://api.ipify.org/', (err, data) => {
        if (!data || !data.content) {
          return resolve();
        }
        const args = {
          ip: data.content,
        };

        Meteor.call('ClientAction.getGeoData', args, (geoError, geoData) => {
          if (geoData && geoData.city && geoData.city.names && geoData.city.names.en) {
            this.userCity = geoData.city.names.en;
            localStorage.setItem('userCity', this.userCity);
            this.userCityUpdated = true;
          }
          if (geoData && geoData.location && geoData.location.time_zone) {
            this.userTimezone = geoData.location.time_zone;
            localStorage.setItem('userTimezone', this.userTimezone);
            this.userTimezoneUpdated = true;
          }
          return resolve();
        });
      });
    });
  }

  switchVisibilityAndRecheckFrozeness (visibilityChecked, options) {
    if (options.type == 'group') { // eslint-disable-line
      const currentGroup = this.getCurrentGroups()[options.name];
      currentGroup.visible = visibilityChecked;
      _.mapValues(currentGroup.items, (column) => {
        column.visible = visibilityChecked;
        return column.visible;
      });
      if (currentGroup.position == 0) { // eslint-disable-line
        this.unfreezeAllColumnsForGroup(options.name);
      }
    } else {
      const group = this.getCurrentGroups()[options.group];
      const column = group.items[options.name];
      column.visible = visibilityChecked;
      column.freezed = false;
      this.setGroupVisibilityBasedOnColumns(group);
    }
  }

  setGroupVisibilityBasedOnColumns (group) {
    let wholeGroupInvisible = true;
    _.forEach(group.items, (column) => {
      if (column.visible) {
        wholeGroupInvisible = false;
      }
    });
    group.visible = !wholeGroupInvisible;
  }

  changeGroupsPositionsAndRecheckFrozeness (sortedGroups, initialStartPos, endPos) {
    const currentGroups = this.getCurrentGroups();
    sortedGroups.forEach((group, idx) => {
      const currentGroup = currentGroups[group.name];
      currentGroup.position = idx;
      currentGroup.shortName = group.name;
      _.mapValues(currentGroup.items, (column) => {
        column.groupPosition = idx;
        return column.groupPosition;
      });
    });
    if (initialStartPos == 0) { // eslint-disable-line
      // eslint-disable-next-line
      const initialFirstGroup = _.find(groups, { position: endPos });
      this.unfreezeAllColumnsForGroup(initialFirstGroup.name);
    }
  }

  changeColumnsPositionsAndRecheckFrozeness (sortedColumns, groupName) {
    const group = this.getCurrentGroups()[groupName];
    sortedColumns.forEach((column, idx) => {
      group.items[column.name].position = idx;
      group.items[column.name].shortName = column.name;
    });
    if (group.position === 0) {
      this.unfreezeAllColumnsForGroup(groupName);
    }
  }

  getFirstVisibleColumnGroup (settings) {
    let firstVisibleGroup = null;
    const sortedGroups = _.sortBy(settings.groups, 'position');
    sortedGroups.forEach((group) => {
      if (!firstVisibleGroup && group.visible) {
        firstVisibleGroup = group;
      }
    });
    return firstVisibleGroup;
  }

  resetAndCountFreezedColumnsForCurrentViewSettings () {
    const settings = this.getCurrentSettings();
    const firstGroup = this.getFirstVisibleColumnGroup(settings);
    if (!firstGroup) {
      return 0;
    }
    const sortedColumns = _.sortBy(firstGroup.items, 'position');
    const lockableColumnIndexes = this.getCurrentLockableColumnIndexes(sortedColumns);
    let lockedColumnsCounter = 0;
    // need refactoring here for eslint fix
    // eslint-disable-next-line
    sortedColumns.forEach((column, idx) => {
      if (idx === lockableColumnIndexes[lockedColumnsCounter] && column.freezed) {
        lockedColumnsCounter += 1;
        return lockedColumnsCounter;
      }
      column.freezed = false;
    });

    settings.freezedColumnsCount = lockedColumnsCounter;
    return settings.freezedColumnsCount;
  }

  getCurrentLockableColumnIndexes (columns) {
    this.columnViewSettings.lockableColumnIndexes = [];
    const limit = this.columnViewSettings.maxLockedColumns;
    let counter = 0;
    columns.forEach((column, idx) => {
      if (column.visible && counter < limit) {
        this.columnViewSettings.lockableColumnIndexes.push(idx);
        counter += 1;
      }
    }, this);
    return this.columnViewSettings.lockableColumnIndexes;
  }

  isUnchanged () {
    const startDays = Math.round(this.startDate / DAY);
    const selectedRangeStartDays = Math.round(this.common.selectedRange.startDate / DAY);

    return this.initialized && startDays === selectedRangeStartDays;
  }

  unload () {
    this.selectedRows = [];
    this.selectedPopupRows = {};
    this.initialized = false;

    this.active(false);
  }

  active (value) {
    if (_.isBoolean(value)) {
      this.isActive = value;
    }

    return this.isActive;
  }

  restoreSettings () {
    const savedSettings = Storage.get(`${this.storageKey}Versioned`);

    if (savedSettings) {
      const matchesVersion = this.storageVersion === savedSettings.version;

      if (savedSettings.columnViewSettings) {
        this.columnViewSettings = _.get(savedSettings, ['columnViewSettings'], this.columnViewSettings);
        this.copyCurrentSettingsFromDefault();
      }

      if (matchesVersion) {
        this.columns = _.get(savedSettings, ['columns'], this.columns);
      } else if (savedSettings.columns) {
        this.columns = _
          .chain(this.columns)
          .mapValues((column, columnName) => Object
            .assign(column, {
              visible: _.get(savedSettings, ['columns', columnName, 'visible'], column.visible),
            }))
          .value();
      }

      if (savedSettings.wordWrap) {
        this.wordWrap = savedSettings.wordWrap;

        if (savedSettings.version < 18) {
          this.wordWrap = !this.wordWrap;
        }
      }

      if (savedSettings.customChartsGrouping) {
        this.customChartsGrouping = savedSettings.customChartsGrouping;
      }

      if (savedSettings.customGraph) {
        this.customGraph = savedSettings.customGraph;
      }

      this.overall = savedSettings.overall || this.overall;
      this.metrics = savedSettings.metrics || this.metrics;
    }
  }

  saveSettings () {
    const settings = {
      version: this.storageVersion,
      columnViewSettings: this.columnViewSettings,
      columns: this.columns,
      wordWrap: this.wordWrap,
      overall: this.overall,
      metrics: this.metrics,
      customChartsGrouping: this.customChartsGrouping,
      customGraph: this.customGraph,
    };

    Storage.set(`${this.storageKey}Versioned`, settings);
  }

  getCounts (cb = _.noop) {
    const args = {
      protoFilters: this.getFiltersQuery(),
    };

    return this
      .call('count', args)
      .catch(this.errorHandler)
      .then((data) => {
        this.filterCounts = data;
        this.elementEvent();
      })
      .then(cb);
  }

  increaseCounts () {
    this.count += 1;
  }

  decreaseCounts () {
    this.count -= 1;
  }

  timeframeToUTC (date) {
    const dateObject = new Date(date);

    return SimpleDate
      .utcOffset(dateObject)
      .toDate();
  }

  getData (cb = _.noop, opts = {}) {
    if (!opts.noLoadingMessage) {
      this.showLoading(true);
    }

    const args = {
      limit: this.limit,
      offset: this.offset,
      protoFilters: this.getFiltersQuery(),
      userId: Meteor.userId(),
    };

    if (this.reduxStore.getState().selectAll) {
      args.selectAll = this.reduxStore.getState().selectAll;
      console.log(args);
    }
    return this
      .call('list', args)
      .then((data) => {
        if (!opts.noLoadingMessage) {
          this.showLoading(false);
        }
        if (_.isEmpty(data)) {
          cb();

          return null;
        }

        const rows = this.getList(data);
        this.count = _.get(data, ['count'], 0);
        this.totalArticles = _.get(data, ['totalArticles'], 0);
        this.totalDisabledWidget = _.get(data, ['disabledWidget'], 0);
        this.totalEnabledWidget = _.get(data, ['enabledWidget'], 0);

        if (this.popup.open && ['edit', 'disallowedUrlPopup'].includes(this.popup.target)) {
          this.selectedRows = _
            .chain(this.selectedRows)
            .concat(_
              .chain(rows)
              .sortBy('id')
              .map((row) => this.getItemRowId(row.id))
              .value())
            .value();
        }

        if (data.params) {
          this.params = data.params;
        }

        const newDataRows = {};
        rows.forEach((row) => {
          newDataRows[this.getItemRowId(row.id)] = row;
        });

        if (this.offset === 0) {
          this.data = newDataRows;
        } else {
          this.data = _
            .chain(this.data)
            .assign(newDataRows)
            .value();
        }

        if (_.isEmpty(rows)) {
          this.dataEvent(false);
        } else {
          this.offset += this.limit;
        }

        this.elementEvent();

        cb(data);

        this.saveSettings();
        return data;
      })
      .then(() => this.dataEvent())
      .then(() => this.getGeoData())
      .catch(this.errorHandler);
  }

  suggestInfo () {
    return [];
  }

  suggestValue (item) {
    return item.id;
  }

  suggestTitle (item) {
    return item.firstName;
  }

  suggestSubtitle () {
    return null;
  }

  /**
   * new getSuggestData for EnchancedSearchBar
   *
   * @params {object} params
   * @params {string} params.query
   * @params {string} params.where
   * @returns {Promise}
   */
  getEnhancedSuggest (params) {
    let args;
    if (!params.searchWithoutFilters) {
      args = {
        limit: 15,
        protoFilters: this.getSuggestQuery(params),
      };
    } else {
      const query = this.getSuggestQuery(params);
      if (query.entities) {
        query.entities = {};
      }
      if (query.properties) {
        query.properties = {};
      }
      args = {
        limit: 15,
        protoFilters: query,
      };
    }

    return this
      .call('suggest', args)
      .catch(this.errorHandler)
      .then((response) => ({
        count: _.get(response, ['count'], 0),
        rows: _
          .chain(response)
          .get(['rows'])
          .map((item) => Object
            .assign({}, item, {
              suggestInfo: this.suggestInfo(item),
              suggestValue: this.suggestValue(item),
              suggestTitle: this.suggestTitle(item),
              suggestSubtitle: this.suggestSubtitle(item),
            }))
          .value(),
      }));
  }

  getSuggestData (query, suggestCallback, cb = _.noop, searchWithoutFilters) {
    const params = {
      query,
      where: 'everywhere',
    };

    if (searchWithoutFilters) {
      params.searchWithoutFilters = true;
    }

    return this
      .getEnhancedSuggest(params)
      .then(({ count, rows }) => ({
        count,
        rows: _.map(rows, (item) => Object
          .assign({}, item, {
            callback: suggestCallback,
          })),
      }))
      .then(cb);
  }

  /**
   * Having keys as numbers makes V8 order them asc
   *
   * @param {number|string} id - id of item
   */
  getItemRowId (id) {
    return `_${id}`;
  }

  addItem (item) {
    const rowId = this.getItemRowId(item.id);
    this.newData[rowId] = item;
  }

  update (attrs, convertId = false, cb = _.noop) {
    let ids = this.getSelectedIds() || attrs.ids;
    if (convertId) {
      ids = attrs.ids;
    }
    const itemIds = attrs.itemIds;
    const uid = Math.random();
    const args = {
      ids,
      uid,
      attrs,
    };

    if (this.checkedAll) {
      args.protoFilters = this.getFiltersQuery();
      args.updateAll = this.checkedAll;
      args.excludedIds = (_.isEmpty(this.excludedRows)) ? undefined : this.excludedRows;
    }
    this.showLoading(true);
    let interval = null;
    if (!attrs.noProgressNotification) {
      interval = this.progressNotification(this.action, 'Updated', uid);
    }
    this.call('update', args)
      .then((data) => {
        this.call('list', { ids, itemIds, protoFilters: this.getFiltersQuery() })
          .then((listResponse) => {
            this.showLoading(false);
            clearInterval(interval);
            const updateable = attrs.updateable || this.storageKey.toLowerCase();
            dispatch('NOTIFICATION', {
              message: `${data.length} ${updateable} have been updated`,
              kind: 'success',
            });
            const rows = listResponse.rows || listResponse;
            this.updateListingItems(rows);
            this.selectedRows = [];
            _.each(ids, (id) => {
              this.elementEvent({ unselected: id });
            });
          })
          .then(() => cb(ids))
          .then(() => this.dataEvent());
      })
      .catch(() => {
        clearInterval(interval);
        this.errorHandler();
      });
  }

  updateListingItem (newItem, fields) {
    this.updateListingItems([newItem], fields);
  }

  updateListingItems (newItems, fields) {
    const rowsIds = _
      .chain(newItems)
      .map('id')
      .map(this.getItemRowId)
      .value();

    const items = this.getSelectedData(rowsIds);

    this.updateItems(items, newItems, fields);
  }

  updateItem (item, newItem, fields) {
    this.updateItems([item], [newItem], fields);
  }

  updateItems (items, newItems, fields = []) {
    const keyById = _
      .chain(newItems)
      .map((newItem) => {
        if (_.isEmpty(fields)) {
          return newItem;
        }

        const requiredFields = _.concat('id', fields);

        return _.pick(newItem, requiredFields);
      })
      .keyBy('id')
      .value();

    _.each(items, (item) => Object
      .assign(item, keyById[item.id]));
  }

  setPopupData (target, data) {
    this.popupData[target] = [];
    this.selectedPopupRows[target] = [];
    let keys;
    if (data) {
      keys = Object.keys(data);
      keys.forEach((key) => {
        const item = data[key];
        if (item !== null && item !== undefined) {
          item.target = target;
          item.id = key;
          this.popupData[target][`_${key}`] = item;
          if (item.checked) {
            this.selectedPopupRows[target].push(`_${key}`);
          }
        }
      });
    }
  }

  getPopupData (target) {
    return _.get(this.popupData, [target], {});
  }

  selectAll () {
    const target = _.get(this.popup, ['target']);

    if (!_.isString(target)) {
      return;
    }

    if (this.popup.open) {
      this.selectedPopupRows[this.popup.target] = _.keys(this.popupData[this.popup.target]);

      return;
    }

    this.selectedRows = _.keys(this.data);
    if (!_.isEmpty(this.newData)) {
      this.selectedRows = this.selectedRows.concat(_.keys(this.newData));
    }
  }

  /**
   * Return total amount of selected rows
   * @returns {number}
   */
  getSelectedRowsCount () {
    if (this.checkedAll) {
      return this.count - this.excludedRows.length;
    }
    return this.selectedRows.length;
  }

  getPopupSelectedData (target = _.get(this.popup, ['target'])) {
    return _
      .chain(this.popupData)
      .get([target])
      .pick(this.selectedPopupRows[target])
      .map()
      .value();
  }

  getSelectedData (selectedRows = this.selectedRows) {
    return _
      .chain([])
      .concat(_
        .chain(this.newData)
        .pick(selectedRows)
        .map()
        .value())
      .concat(_
        .chain(this.data)
        .pick(selectedRows)
        .map()
        .value())
      .value();
  }

  getSelectedIds (selectedRows = this.selectedRows) {
    return _
      .chain(this.getSelectedData(selectedRows))
      .map('id')
      .value();
  }

  getList (response) {
    return _
      .chain(response)
      .get(['rows'], response)
      .concat()
      .value();
  }

  getFirst (response) {
    return _.first(this.getList(response));
  }

  rewind () {
    this.offset = 0;

    this.data = {};
    this.newData = {};

    this.filtersUpdated = false;

    this.count = undefined;
  }

  updateFilters () {
    console.error('updateFilters are not exitst anymore'); // eslint-disable-line no-console
  }

  preFilter () {
    console.error('preFilter are not exitst anymore'); // eslint-disable-line no-console
  }

  filterData (cb = _.noop) {
    this.rewind();

    return Promise
      .all([
        this.getCounts(),
        this.getData(cb),
      ]);
  }

  filterRows (key, value, type) {
    let rowsSubset = [];
    switch (type) {
      case 'selected':
        rowsSubset = this.selectedRows;
        break;
      case 'excluded':
        rowsSubset = this.excludedRows.map(this.getItemRowId);
        break;
      default:
        rowsSubset = Object.keys(this.data)
          .concat(Object.keys(this.newData));
    }
    return rowsSubset.reduce((selectedIds, rowId) => {
      const row = this.data[rowId] || this.newData[rowId];
      if (row && row[key] === value) {
        selectedIds.push(row.id);
      }
      return selectedIds;
    }, []);
  }

  narrowDataByIds (itemRowIds) {
    this.data = _.pick(this.data, itemRowIds);
    this.newData = _.pick(this.newData, itemRowIds);
  }

  createItem (cb = _.noop) {
    this.isSaving = true;
    return this
      .call('create', this.form)
      .then((data) => {
        this.isSaving = false;
        const item = this.getFirst(data);
        const rowId = this.getItemRowId(item.id);
        this.addItem(item);
        const affectedRows = this.getList(data)
          .slice(1);
        this.updateListingItems(affectedRows);
        this.form = {};
        if (this.checkedAll) {
          this.selectedRows.push(rowId);
          this.elementEvent({ selected: item.id });
        }

        this.increaseCounts();
        cb(item);
        this.dataEvent();
      })
      .catch((error) => {
        this.isSaving = false;
        cb();
        this.errorHandler(error);
      });
  }

  saveItem (cb = _.noop, cbOnError) {
    const item = _.first(this.getSelectedData());

    if (!item) {
      return;
    }

    if (item.id) {
      this.form.id = item.id;
    }

    this.isSaving = true;
    Meteor.call(`${this.action}.save`, this.form, (err, data) => {
      this.isSaving = false;
      if (err) {
        this.refreshItem(item);

        dispatch('NOTIFICATION', {
          message: err.reason,
          kind: 'error',
        });

        if (typeof cbOnError === 'function') {
          cbOnError();
        }

        return;
      }

      const newItem = this.getFirst(data);

      this.updateItem(item, newItem);

      item.openedAt = new Date();

      this.selectedRows.shift();

      this.elementEvent({ unselected: item.id });
      if (this.popup.open && this.popup.target === 'edit') {
        this.excludedRows.push(item.id);
      }
      this.dataEvent();

      this.form = {};

      cb();
    });
  }

  refreshItems (items) {
    const ids = _.map(items);

    return this
      .call('entities', ids)
      .then((data) => {
        const refreshedItems = this.getList(data);

        this.updateItems(items, refreshedItems);

        items
          .forEach((item) => Object
            .assign(item, {
              openedAt: new Date(),
            }));
      })
      .catch(this.errorHandler);
  }

  refreshItem (item) {
    return this
      .call('entities', [item.id])
      .then((data) => {
        const refreshedItem = this.getFirst(data);

        this.updateItem(item, refreshedItem);

        Object.assign(item, {
          openedAt: new Date(),
        });

        dispatch('REFRESH_ITEM', {
          item,
        });
      })
      .catch(this.errorHandler);
  }

  removeListingItem (rowId) {
    delete this.data[rowId];
    delete this.newData[rowId];
  }

  deleteItem (arg, cb = _.noop) {
    this.deleteItems([arg], cb);
  }

  deleteItems (arg, cb = _.noop) {
    const rowIds = arg ? _.concat(arg) : this.selectedRows;

    const items = this.getSelectedData(rowIds);

    const deleteRequests = items
      .map(({ id }) => this
        .call('delete', id)
        .then(() => this.getItemRowId(id))
        .then((rowId) => {
          this.removeListingItem(rowId);
          this.selectedRows = _.difference(this.selectedRows, [rowId]);
        })
        .then(() => this.dataEvent())
        .then(() => this.elementEvent()));

    Promise
      .all(deleteRequests)
      .then(cb)
      .catch(this.errorHandler);
  }

  showLoading (isNeedToShow) {
    if (isNeedToShow) {
      NProgress.configure({ showSpinner: false });
      NProgress.start();

      this.startLoadingTimeout = setTimeout(() => NProgress.set(0.5), 200);

      clearTimeout(this.loaderTimeout);
      this.loaderTimeout = setTimeout(() => dispatch('NOTIFICATION', { loading: true }), 200);

      clearTimeout(this.loaderLongTimeout);
      this.loaderLongTimeout = setTimeout(() => dispatch('NOTIFICATION', { loading: 'Still loading, please wait...' }), 30000);

      return;
    }

    NProgress.done();

    clearTimeout(this.startLoadingTimeout);
    clearTimeout(this.loaderLongTimeout);
    clearTimeout(this.loaderTimeout);

    dispatch('HIDE_NOTIFICATION');
  }

  destroy () {
    this.destroyEvent();
    this.removeListeners();
    this.unload();
  }

  selectItem (id) {
    const target = _.get(this.popup, ['target']);
    const isPopupOpen = _.get(this.popup, ['open']);

    const rowId = this.getItemRowId(id);

    if (isPopupOpen) {
      this.selectedPopupRows[target].push(rowId);
    } else {
      this.selectedRows.push(rowId);
    }

    this.elementEvent({
      selected: id,
      target,
    });
  }

  unselectItem (id) {
    const target = _.get(this.popup, ['target']);
    const isPopupOpen = _.get(this.popup, ['open']);

    const rowId = this.getItemRowId(id);

    if (isPopupOpen) {
      this.selectedPopupRows[target] = _.difference(this.selectedPopupRows[target], [rowId]);
    } else {
      this.selectedRows = _.difference(this.selectedRows, [rowId]);
    }

    this.elementEvent({
      unselected: id,
      target,
    });
  }

  updateFormCheckboxState (item, type) {
    this.form = _
      .chain(this.form)
      .assign(_
        .chain(this.form)
        .pickBy(_.isBoolean)
        .mapValues(() => false)
        .value())
      .assign(_
        .chain(item)
        .get([type])
        .reduce((result, field) => Object
          .assign(result, {
            [field]: true,
          }), {})
        .value())
      .set('openedAt', new Date())
      .value();
  }

  /**
   * Set interval for notifying about progress status of
   * current action and return id of this interval
   * @param {string} action
   * @param {string} message
   * @param {number} uid
   * @returns {number}
   */
  progressNotification (action, messageData, uid) {
    const kind = messageData.kind || 'info';
    const initialMessage = messageData.initialMessage || 'Preparing...';
    const description = messageData.description;
    dispatch('NOTIFICATION', { message: initialMessage, kind });
    const interval = setInterval(() => Meteor
      .call(`${action}.updateStatus`, uid, (err, data) => {
        if (data) {
          if (data.ready || (data.current === data.total)) {
            return;
          }
          dispatch('NOTIFICATION', {
            message: `${_.isUndefined(description) ? data.message : description} ${data.current} out of ${data.total}`,
            force: true,
            kind,
          });
        } else {
          dispatch('NOTIFICATION', { message: initialMessage, kind });
        }
      }), 1000);

    return interval;
  }

  call (method, ...args) {
    return this
      .rawCall(`${this.action}.${method}`, ...args);
  }

  rawCall (method, ...args) {
    return new Promise((resolve, reject) => {
      Meteor.apply(method, args, (err, data) => {
        if (err) {
          reject(err);

          return;
        }

        resolve(data);
      });
    });
  }

  getFiltersQuery () {
    return null;
  }

  getSuggestQuery () {
    return null;
  }

  getDateRange () {
    return null;
  }

  errorHandler (error) {
    this.showLoading(false);

    /**
     * If error.reason don't exits so it not Meteor.Error and we need
     * to show something in error notification and real error in console
     */
    if (!_.has(error, 'reason')) {
      console.error(error); // eslint-disable-line no-console
    }

    dispatch('NOTIFICATION', {
      message: error.reason || 'Internal Error',
      kind: 'error',
    });
  }
}
