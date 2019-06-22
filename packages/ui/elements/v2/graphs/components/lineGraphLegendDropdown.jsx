/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import _ from 'underscore';

const Dropdown = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
  }

  toggleDropDown (ev) {
    ev.preventDefault();
    if (!this.props.disabled) {
      this.setState({ open: !this.state.open });
    }
  }

  closeDropdown () {
    this.setState({ open: false });
  }

  render () {
    let color = this.props.options[0].color;
    const items = this.props.options.map((item, index) => {
      if (this.props.selectedMetric.slice(-1)[0] === item.name) {
        color = item.color;
      }
      return (
        <li
          key={index}
          className={classNames(
            'dropdown__item',
            'legend__button',
            item.color,
            { active: _.contains(this.props.selectedMetric, item.name) }
          )}
          onClick={this.props.selectMetric.bind(null, item.name)}
        >
          {item.name}
        </li>
      );
    });


    return (
      <div className={'dropdown'} onClick={this.toggleDropDown}>
        <div className={classNames('dropdown__button', 'legend__button', color)}>
          {this.props.selectedMetric.slice(-1)[0] || 'Select metric'}
        </div>
        <div
          className={
            classNames('dropdown__close',
            { '-visible': this.state.open }
          )}
          onClick={this.toggleDropDown}
        />
        <div
          className={classNames('dropdown__container', { '-visible': this.state.open })}
        >
          <div
            className="dropdown__scroll"
            style={{ maxHeight: this.props.maxHeight || window.innerHeight - 250 }}
          >
            {items}
          </div>
        </div>
      </div>
    );
  }
};

Dropdown.displayName = 'Dropdown';

Dropdown.propTypes = {
  options: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  maxHeight: PropTypes.number,
  metrics: PropTypes.array,
  selectMetric: PropTypes.func,
  selectedMetric: PropTypes.array,
  disabled: PropTypes.bool,
};

export default Dropdown;
