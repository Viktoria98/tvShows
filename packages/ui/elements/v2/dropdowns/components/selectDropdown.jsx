/* eslint-disable react/no-unused-prop-types */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-no-bind */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Base from '../_dropdownBase';

const SelectDropdown = class extends Component {
  constructor (props) {
    super(props);
    this.closeOnClick = this.closeOnClick.bind(this);
  }

  closeOnClick (value) {
    this.props.onSelect(value);
    this.refs.base.closeDropdown();
  }

  render () {
    const items = this.props.options.map((item, index) => {
      if (item.divider) {
        return (<li className="divider" />);
      }
      return (<li
        key={index}
        id={index}
        className={classNames(
          'dropdown__list__item',
          { '-disabled': item.disabled },
          { '-active': this.props.selected === item.text }
        )}
        onClick={this.closeOnClick.bind(null, item.text)}
      >
        {item.text}
      </li>);
    });

    const selected = this.props.selected ? this.props.selected.toString() : null;
    return (
      <Base
        ref="base"
        disabled={this.props.disabled}
        className="select"
        buttonText={selected || this.props.label}
      >
        <div className="dropdown__scroll" style={{ maxHeight: window.innerHeight - 170 }}>
          {items}
        </div>
      </Base>
    );
  }
};

SelectDropdown.displayName = 'SelectDropdown';

SelectDropdown.propTypes = {
  buttonIcon: PropTypes.string,
  buttonTooltip: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  align: PropTypes.string,
  disabled: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default SelectDropdown;
