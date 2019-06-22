import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Icon from '../../../icons/icon.jsx';

const DropdownItem = class extends Component {
  constructor (props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick () {
    this.props.onItemClick(this.props.param, this.props.disabled);
  }

  render () {
    const {
      id, active, disabled, text, counter, checkmarkPos,
    } = this.props;
    const checkIcon = active ? <Icon type="check" /> : false;
    return (
      <li
        id={id}
        className={classNames(
          'dropdown__list__item',
          { '-disabled': disabled },
          { '-active': active },
          { '-left-checkmark': checkmarkPos === 'left' }
        )}
        onClick={this.onClick}
      >
        {text}
        {checkIcon}
        {counter}
      </li>
    );
  }
};

DropdownItem.propTypes = {
  id: PropTypes.string,
  onItemClick: PropTypes.func,
  item: PropTypes.object,
  param: PropTypes.any,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  counter: PropTypes.element,
};

export default DropdownItem;
