import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Icon from '../../../icons/icon.jsx';

const DropdownItem = (props) => {
  const {
    cb, value, text, selected, meaningText, chosen,
  } = props;
  const additionalText = meaningText ? (
    <span className="option__additional-text">{meaningText}</span>
  ) : (
    ''
  );
  const checkIcon = selected ? (
    <Icon className="option__check-icon" type="checkDropDownCell" />
  ) : (
    ''
  );

  return (
    <li
      className={classNames('dropdown-base__option', {
        '-selected': selected,
        '-hovered': chosen,
      })}
      onClick={cb.bind(null, value)}
    >
      <span>
        {text}
        {additionalText}
      </span>
      {checkIcon}
    </li>
  );
};

DropdownItem.propTypes = {
  width: PropTypes.number,
  cb: PropTypes.func,
  value: PropTypes.any,
  text: PropTypes.string,
  selected: PropTypes.bool,
};

export default DropdownItem;
