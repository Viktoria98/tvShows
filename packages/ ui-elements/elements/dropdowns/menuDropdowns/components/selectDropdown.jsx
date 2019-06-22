/* eslint react/no-array-index-key: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Base from '../_dropdownBase.jsx';
import Icon from '../../../icons/icon.jsx';

const SelectDropdown = class extends Component {
  constructor (props) {
    super(props);
    this.closeOnClick = this.closeOnClick.bind(this);
  }

  closeOnClick (value, callback) {
    if (typeof callback === 'function') {
      callback();
    } else {
      this.props.onSelect(value);
    }
    this.base.closeDropdown();
  }

  render () {
    const items = this.props.options.map((item, index) => {
      const active = this.props.selected === (item.value || item.text);
      const checkIcon = active ? <Icon type="check" /> : false;
      if (item.divider) {
        return <li className="divider" />;
      }
      return (
        // eslint-disable-next-line
        <li
          id={item.id}
          key={index}
          className={classNames(
            'dropdown__list__item',
            { '-disabled': item.disabled },
            { '-active': active }
          )}
          onClick={() => this.closeOnClick(item.value || item.text, item.cb)}
        >
          {item.text}
          {checkIcon}
        </li>
      );
    });

    return (
      <Base
        ref={(base) => {
          this.base = base;
        }}
        disabled={this.props.disabled}
        className={`select ${this.props.className}`}
        buttonIcon={this.props.buttonIcon}
        buttonText={this.props.label}
      >
        <div className="dropdown__scroll" style={{ maxHeight: window.innerHeight - 170 }}>
          {items}
        </div>
      </Base>
    );
  }
};

SelectDropdown.propTypes = {
  buttonIcon: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  onSelect: PropTypes.func,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
};

SelectDropdown.defaultProps = {
  buttonIcon: '',
  label: '',
  options: [],
  disabled: false,
  onSelect: () => {},
  selected: NaN,
  className: '',
};

export default SelectDropdown;
