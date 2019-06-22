/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Cell,
} from 'meteor/ff:ui';
import Checkbox from '../../v2/checkboxes/checkbox';
import Popup from '../../popups/components/popup.cjsx';
import Dispatcher from '../dispatchers/listingDispatcher'; // eslint-disable-line

export default {
  visibleColumns: 0,
  shouldCheckWidth: false,

  getInitialState () {
    return {
      allChecked: false,
      allCheckedPopup: false,
      partialChecked: false,
      partialCheckedPopup: false,
      scrollbarX: true,
      scrollbarY: true,
      noRowsSelected: false,
      areCellsSelectable: this.areCellsSelectable && this.areCellsSelectable(),
    };
  },

  getChildContext () {
    return {
      setColumnWidth: this.setColumnWidth,
    };
  },

  childContextTypes: {
    setColumnWidth: PropTypes.func,
  },

  setColumnWidth (colNum, colName, newWidth) {
    if (!(this.store().popup.open && _.includes(['trackingSlugs'], this.store().popup.target))) {
      const colRef = (this.state.areCellsSelectable) ? `${colNum}_wrapped_cell` : colNum;
      this.refs[`header_${colNum}`].setWidth(newWidth);
      Object.keys(this.refs)
        .forEach((ref) => {
          if (+ref >= 0) {
            this.refs[ref].refs[colRef].setWidth(newWidth);
          }
        });
      this.store()
        .getColumn(colName).width = newWidth;
      this.store()
        .modifySettingsIfPossible();
      this.saveSettings();
    }
  },

  // eslint-disable-next-line
  saveSettings: _.debounce(() => Dispatch('SAVE_SETTINGS'), 1000),

  wrap () {
    return this.refs.wrap;
  },

  header () {
    return this.refs.header;
  },

  listingScrollArea () {
    return this.refs.listingScrollArea;
  },

  componentDidMount () {
    this.store()
      .addElementListener(this.onListingChange);
  },

  componentDidUpdate () {
    this.setState({ // eslint-disable-line
      scrollbarX: (this.refs.listingScrollArea.clientWidth < this.refs.listingScrollArea.scrollWidth), // eslint-disable-line
      scrollbarY: (this.refs.listingScrollArea.clientHeight < this.refs.listingScrollArea.scrollHeight), // eslint-disable-line
    });
  },

  onListingChange () {
    if (!this.props.isPopup && !this.store().popup.open && this.store().checkedAll) {
      if (this.store().excludedRows.length) {
        this.setState({ partialChecked: true });
      } else {
        this.setState({ partialChecked: false });
      }
      return;
    }
    if (this.props.isPopup && this.store().popup.open && this.store().checkedAllPopup) {
      const target = this.store().popup.target;
      if (!this.store().popupData[target]) {
        return;
      }
      const dataLength = Object.keys(this.store().popupData[target]).length;
      const selectedLength = this.store().selectedPopupRows[target].length;
      if (dataLength !== selectedLength) {
        this.setState({ partialCheckedPopup: true });
      } else {
        this.setState({ partialCheckedPopup: false });
      }
    }
    if (
      this.props.isPopup
      && _.includes(['csvReport', 'statsReport'], this.store().popup.target)
    ) {
      const noRowsSelected = _.isEmpty(this.store().getPopupSelectedData()); // eslint-disable-line
      this.setState({
        noRowsSelected,
      });
    }
  },

  moveFreezedCols (offsetLeft, freezedColumnsCount) {
    Object.keys(this.refs)
      .forEach((ref) => {
        if (+ref >= 0) {
          this.refs[ref].refs.checkboxCell.moveLeft(offsetLeft);
          for (let i = 0; i < freezedColumnsCount; i++) {
            this.refs[ref].refs[i].moveLeft(offsetLeft);
          }
        }
      });
    this.refs.checkboxAllCell.moveLeft(offsetLeft);
    for (let i = 0; i < freezedColumnsCount; i++) {
      this.refs[`header_${i}`].moveLeft(offsetLeft);
    }
  },

  getPopupTitle () {
    if (this.props.store.popup.exportToGoogle) {
      return 'Export to Google Sheets';
    }

    return this.props.popupTitle || 'Generate report';
  },

  render () {
    const sortedColumns = this.props.sortedColumns || [];
    const freezedColumnsCount = this.props.freezedColumnsCount;
    let haveCheckBox;
    if (this.props.haveCheckBox !== null && this.props.haveCheckBox !== undefined) {
      haveCheckBox = this.props.haveCheckBox;
    }
    if (!(haveCheckBox !== undefined && haveCheckBox !== null)) {
      haveCheckBox = true;
    }
    const selectAll = this.props.selectAll !== false;

    let selectAllChecked = true;
    const newListingItems = [];
    let position = 0;
    if (this.props.newData) {
      let keys = Object.keys(this.props.newData);
      if (!this.props.isPopup) {
        keys = _.chain(keys)
          .sort()
          .reverse()
          .value();
      }
      keys.forEach((key) => {
        const data = this.props.newData[key];
        if (selectAllChecked && !data.checked) {
          selectAllChecked = false;
        }
        newListingItems.push(
          this.prepare(
            data,
            haveCheckBox,
            position,
            sortedColumns,
            this.state.areCellsSelectable,
            freezedColumnsCount
          )
        );
        position += 1;
      });
    }
    const listingItems = [];
    if (this.props.data) {
      if (this.props.dataType === 'statsTable') {
        const availableStatColumnsObj = _.zipObject(
          _.map(sortedColumns, (col) => col.name), sortedColumns
        );
        const statsGroupNames = Object.keys(this.props.store.statsGroups);

        statsGroupNames.forEach((name) => {
          const preparedMetrics = [];
          const value = this.props.store.statsGroups[name];
          if (value.metrics.length) {
            value.metrics.forEach((metric) => {
              if (this.props.data[metric]) {
                const dat = Object.assign(this.props.data[metric], { isGroupName: false });
                const title = this.props.data[metric].title;
                const check = (_.isObject(title) ? title.title : title).replace(/ /gi, '_');
                if (this.store().selectedRows.indexOf(`_${check}`) > -1) {
                  dat.checked = true;
                }
                preparedMetrics.push(dat);
              }
            });
          }

          if (!_.isEmpty(preparedMetrics)) {
            listingItems.push(this.prepare(
                { title: value.title, isGroupName: true }, false, position,
                availableStatColumnsObj, this.state.areCellsSelectable, freezedColumnsCount));
            position += 1;
            preparedMetrics.forEach((metric) => {
              listingItems.push(this.prepare(metric, haveCheckBox, position,
                    availableStatColumnsObj, this.state.areCellsSelectable, freezedColumnsCount));
              position += 1;
            });
          }
        });
      } else {
        Object.keys(this.props.data)
          .forEach((key) => {
            const data = this.props.data[key];
            if (selectAllChecked && !data.checked) {
              selectAllChecked = false;
            }
            listingItems.push(this.prepare(data, haveCheckBox, position,
                sortedColumns, this.state.areCellsSelectable, freezedColumnsCount));
            position += 1;
          });
      }
    }
    const header = [];
    const checkboxAll = selectAll ? (
      <Checkbox
        ref={this.props.isPopup ? 'checkboxAllPopup' : 'checkboxAll'}
        key={this.props.isPopup ? 'checkboxAllPopup' : 'checkboxAll'}
        onCheck={this.handleCheckbox}
        checked={this.props.isPopup ? this.state.allCheckedPopup : this.state.allChecked}
        partialChecked={this.props.isPopup ?
          this.state.partialCheckedPopup : this.state.partialChecked}
      />
    ) : '';
    if (haveCheckBox) {
      header.push((
        <Cell
          ref="checkboxAllCell"
          key="checkboxCell"
          className="cell checkboxCell"
          dontWrapContent
          value={checkboxAll}
          freezed={!!freezedColumnsCount}
          listingCell
        />
      ));
    }
    let colNum = 0;
    sortedColumns.forEach((column) => {
      if (!column.visible) {
        return;
      }
      if (column.items !== null && column.items !== undefined) {
        const innerKeys = Object.keys(column.items);
        innerKeys.forEach((innerKey) => {
          const innerColumn = column.items[innerKey];
          header.push((
            <Cell
              ref={`header_${colNum}`}
              id={column.name}
              key={innerKey}
              xPos={colNum}
              className={innerKey}
              value={innerColumn.label}
              width={innerColumn.width}
              freezed={(colNum < freezedColumnsCount)}
              wrapped={false}
              listingCell
            />
          ));
        });
      } else {
        header.push((
          <Cell
            ref={`header_${colNum}`}
            id={column.name}
            key={column.name}
            xPos={colNum}
            className={column.name}
            value={column.label}
            width={column.width}
            freezed={(colNum < freezedColumnsCount)}
            wrapped={false}
            listingCell
          />
        ));
      }
      colNum += 1;
    });
    let result;
    result = (
      <div
        ref="wrap"
        id={!this.props.isPopup ? this.props.id : `${this.props.id}Listing`}
        className={
          classNames('listing',
          { '-wrap': this.props.wordWrap },
          { '-noscrollX': !this.state.scrollbarX },
          { '-noscrollY': !this.state.scrollbarY },
          { 'selectable-listing': this.state.areCellsSelectable })
        }
      >
        <div className={classNames('listing__header', { '-checked': this.state.allChecked })} ref="header">
          {header}
        </div>
        <div ref="listingScrollArea" className="listing__scrollarea" id="listing__scrollarea">
          <div className="listing__body">
            {newListingItems}
            {listingItems}
            {newListingItems.length === 0 && listingItems.length === 0 && this.props.children}
          </div>
        </div>
        <div className="listing__fade-x" />
      </div>
    );
    if (this.props.isPopup) {
      result = (
        <Popup
          id={this.props.id}
          className="reportStatsPopup"
          title={this.getPopupTitle()}
          open={this.state.open}
          close={this.close}
          type="auto"
        >
          {result}
          <button
            id={this.props.popupBtn || 'Continue'}
            className={classNames('button -primary')}
            onClick={this.props.cb}
            disabled={this.state.noRowsSelected}
          >
            {this.props.popupBtn || 'Continue'}
          </button>
        </Popup>
      );
    }
    return result;
  },
};
