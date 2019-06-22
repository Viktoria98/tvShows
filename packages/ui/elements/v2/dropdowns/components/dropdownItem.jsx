/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

export default function dropdownItem (props) {
  return (
    <li
      id={props.id}
      className={classNames(
        'dropdown__list__item',
        { '-disabled': props.disabled },
        { '-active': props.active }
      )}
      onClick={() => props.onItemClick(props.param, props.disabled, props.options)}
    >
      {props.text ? props.text.replace(/&quot;/g, '"') : ''}
      {props.counter}
    </li>
  );
}

dropdownItem.displayName = 'DropdownItem';

dropdownItem.propTypes = {
  onItemClick: PropTypes.func,
  param: PropTypes.any,
  text: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  counter: PropTypes.element,
  options: PropTypes.object,
};
