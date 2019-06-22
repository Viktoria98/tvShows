/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-no-bind */

import React, { Component } from 'react';
import classNames from 'classnames';
import Base from '../_dropdownBase';

const SearchToolsDropdown = class extends Component {
  constructor (props) {
    super(props);
    this.closeOnClick = this.closeOnClick.bind(this);
  }

  closeOnClick (value) {
    this.props.onSelect(value);
    this.refs.base.closeDropdown();
  }

  render () {
    let label = this.props.label;

    const items = this.props.options.map((item, index) => {
      if ((this.props.selected === item.name) && (item.name !== 'everywhere')) {
        label = item.text;
      }

      return (<li
        key={index}
        id={index}
        className={classNames(
          'dropdown__list__item',
          { '-active': this.props.selected === item.name }
        )}
        onClick={this.closeOnClick.bind(null, item.name)}
      >
        {item.text}
      </li>);
    });

    return (
      <Base
        ref="base"
        disabled={this.props.disabled}
        className="select"
        buttonText={label}
      >
        <div className="dropdown__scroll" style={{ maxHeight: window.innerHeight - 170 }}>
          {items}
        </div>
      </Base>
    );
  }
};

SearchToolsDropdown.displayName = 'SearchToolsDropdown';

SearchToolsDropdown.propTypes = {
  label: React.PropTypes.string,
  options: React.PropTypes.array,
  disabled: React.PropTypes.oneOfType([
    React.PropTypes.func,
    React.PropTypes.bool,
  ]),
  onSelect: React.PropTypes.func.isRequired,
  selected: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
};

export default SearchToolsDropdown;
