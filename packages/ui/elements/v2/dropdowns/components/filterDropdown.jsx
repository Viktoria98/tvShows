/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Base from '../_dropdownBase';
import DropdownItem from './dropdownItem';
import DropdownSubmenu from './dropdownSubmenu';
import Format from '../../../formatters/Format';

export default class FilterDropdown extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  getShowStatsFilters () {
    return _.chain(this.props.showStats)
      .map((group, key) => {
        const checkedItems = [];
        const items = _.chain(group)
          .get('items')
          .map((filter, index) => {
            if (filter.checked) {
              checkedItems.push(filter.label);
            }

            const count = (
              <span className="dropdown__list__item__count">
                {filter.count ? Format.number(filter.count) : ''}
              </span>
            );

            return (
              <DropdownItem
                id={index}
                key={index}
                text={filter.label}
                active={filter.checked}
                onItemClick={filter.toggle}
                counter={count}
              />
            );
          })
          .value();

        return (
          <DropdownSubmenu
            id={_.camelCase(group.label) || key}
            key={key}
            label={group.label}
            checked={checkedItems.length ? checkedItems.join(', ') : ''}
            resetCallback={group.reset}
            resetButton
          >
            {items}
          </DropdownSubmenu>
        );
      })
      .value();
  }

  getSearchFilters () {
    return _.chain(this.props.searches)
      .map((group, key) => {
        const checkedItems = [];
        const items = _.chain(group)
          .get('items')
          .map((filter, index) => {
            if (filter.checked) {
              checkedItems.push(filter.label);
            }

            const count = (
              <span className="dropdown__list__item__count">
                {filter.count ? Format.number(filter.count) : ''}
              </span>
            );

            return (
              <DropdownItem
                id={index}
                key={index}
                text={filter.label}
                active={filter.checked}
                onItemClick={filter.toggle}
                counter={count}
              />
            );
          })
          .value();

        return (
          <DropdownSubmenu
            id={_.camelCase(group.label) || key}
            key={key}
            label={group.label}
            checked={checkedItems.length ? checkedItems.join(', ') : ''}
            resetCallback={group.reset}
            resetButton
          >
            {items}
          </DropdownSubmenu>
        );
      })
      .value();
  }

  getPropertyFilters () {
    return _.chain(this.props.properties)
      .map((group, key) => {
        const disabled = group.disabled;
        const checkedItems = [];
        const items = _.chain(group)
          .get('items')
          .sortBy(items, 'order')
          .map((filter, i) => {
            if (filter.checked) {
              checkedItems.push(filter.label);
            }

            const count = (
              <span className="dropdown__list__item__count">
                {filter.count ? Format.number(filter.count) : ''}
              </span>
            );

            return (
              <DropdownItem
                id={_.camelCase(filter.label) || i}
                key={i}
                text={filter.label}
                active={filter.checked}
                onItemClick={filter.toggle}
                counter={count}
              />
            );
          })
          .value();

        return (
          <DropdownSubmenu
            key={key}
            id={_.camelCase(group.label) || key}
            label={group.label}
            disabled={disabled}
            checked={checkedItems.length ? checkedItems.join(', ') : ''}
            resetButton={checkedItems.length}
            resetCallback={group.reset}
          >
            {items}
          </DropdownSubmenu>
        );
      })
      .value();
  }

  hasActiveFilter () {
    return _.chain([...this.props.properties, ...this.props.searches, ...this.props.showStats])
      .some((group) => {
        const hasFilterChecked = _.chain(group)
          .get('items')
          .some((filter) => filter.checked)
          .value();

        return hasFilterChecked;
      })
      .value();
  }

  render () {
    const resetAll = (
      <DropdownItem
        id="resetAllFilters"
        text="Clear all filters"
        onItemClick={this.props.reset}
      />
    );

    const dropdownScrollStyle = { maxHeight: window.innerHeight - 220 };

    return (
      <Base
        id={this.props.id}
        className="dropdown__filter"
        buttonText={this.props.label}
        hasActiveFilter={this.hasActiveFilter()}
      >
        <div className="dropdown__scroll" style={dropdownScrollStyle}>
          {
            _.isEmpty(this.props.searches) ? '' : (
              <div className="dropdown__list__group dropdown__filter__entities">
                {this.getSearchFilters()}
              </div>
            )
          }
          {
            _.isEmpty(this.props.showStats) ? '' : (
              <div className="dropdown__list__group dropdown__filter__entities">
                {this.getShowStatsFilters()}
              </div>
            )
          }
          <div className="dropdown__list__group">
            {this.getPropertyFilters()}
          </div>
          {resetAll}
        </div>
      </Base>
    );
  }
}

FilterDropdown.displayName = 'FilterDropdown';

FilterDropdown.propTypes = {
  reset: PropTypes.func,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  searches: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      reset: PropTypes.func,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          toggle: PropTypes.func,
          checked: PropTypes.bool,
        })
      ),
    })
  ),
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      reset: PropTypes.func,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          toggle: PropTypes.func,
          checked: PropTypes.bool,
        })
      ),
    })
  ),
  // buttonIcon: React.PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};
