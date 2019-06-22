import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Base from '../_dropdownBase';
import DropdownItem from './dropdownItem';

const Dropdown = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.closeOnClick = this.closeOnClick.bind(this);
  }

  closeOnClick (param, disabled, options) {
    if (!disabled && param && typeof param === 'function') {
      this.refs.base.closeDropdown();
      param(options);
    }
  }

  render () {
    const items = this.props.options.map((item, index) => {
      if (item.divider) {
        return (<li className="divider" />);
      }
      return (<DropdownItem
        key={index}
        onItemClick={this.closeOnClick}
        item={item}
        param={item.cb}
        options={item.options}
        disabled={item.disabled}
        text={item.text}
      />);
    });

    return (
      <Base
        ref="base"
        className="basic"
        buttonText={this.props.label}
        buttonIcon={this.props.buttonIcon}
        buttonClassName={this.props.buttonClassName}
        buttonTooltip={this.props.buttonTooltip}
        align={this.props.align}
      >
        <div
          className="dropdown__scroll"
          style={{ maxHeight: this.props.maxHeight || window.innerHeight - 170 }}
        >
          {items}
        </div>
      </Base>
    );
  }
};

Dropdown.displayName = 'Dropdown';

Dropdown.propTypes = {
  align: PropTypes.string,
  label: PropTypes.string,
  buttonIcon: PropTypes.string,
  buttonTooltip: PropTypes.string,
  buttonClassName: PropTypes.string,
  options: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  maxHeight: PropTypes.number,
};

export default Dropdown;
