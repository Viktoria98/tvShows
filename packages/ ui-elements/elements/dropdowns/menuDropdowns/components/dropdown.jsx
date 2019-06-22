import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Base from '../_dropdownBase.jsx';
import DropdownItem from './dropdownItem.jsx';
import DropdownCheckboxItem from './dropdownCheckboxItem.jsx';

const Dropdown = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.closeOnClick = this.closeOnClick.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
  }

  closeOnClick (param, disabled) {
    if (!disabled && param && typeof param === 'function') {
      this.refs.base.closeDropdown();
      param();
    }
  }

  // render simple option, option with checkbox or divider
  renderOptions () {
    const { checkmarkPos } = this.props;

    return this.props.options.map((item, index) => {
      if (item.divider) {
        return <hr key={index} />;
      } else if (item.checkbox) {
        return (
          <DropdownCheckboxItem
            key={index}
            item={item}
            cb={item.cb}
            text={item.text}
            value={item.value}
            checked={item.checked}
          />
        );
      }
      const active = this.props.selected === (item.value || item.text);
      return (
        <DropdownItem
          id={item.id}
          key={index}
          onItemClick={this.closeOnClick}
          item={item}
          param={item.cb}
          disabled={item.disabled}
          checkmarkPos={checkmarkPos}
          active={active}
          text={item.text}
        />
      );
    });
  }

  render () {
    const {
      id,
      className,
      label,
      buttonIcon,
      buttonClassName,
      buttonTooltip,
      align,
      maxHeight,
    } = this.props;

    const items = this.renderOptions();
    return (
      <Base
        id={id}
        ref="base"
        className={className}
        buttonText={label}
        buttonIcon={buttonIcon}
        buttonClassName={buttonClassName}
        buttonTooltip={buttonTooltip}
        align={align}
      >
        <div
          className="dropdown__scroll"
          style={{ maxHeight: maxHeight || window.innerHeight - 170 }}
        >
          {items}
        </div>
      </Base>
    );
  }
};

Dropdown.propTypes = {
  id: PropTypes.string,
  align: PropTypes.string,
  label: PropTypes.string,
  buttonIcon: PropTypes.string,
  buttonTooltip: PropTypes.string,
  buttonClassName: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      cb: PropTypes.func,
      text: PropTypes.string,
      checked: PropTypes.bool,
      divider: PropTypes.bool,
      disabled: PropTypes.bool,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  maxHeight: PropTypes.number,
  checkmarkPos: PropTypes.string,
};

Dropdown.defaultProps = {
  id: 'moreActions',
  checkmarkPos: 'right',
};

export default Dropdown;
