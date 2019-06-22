/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const DropdownItem = (props) => {
  const { cb, value, text, selected, meaningText } = props;
  const additionalText = meaningText ? <span className="option__additional-text">{meaningText}</span> : '';
  const checkIcon = selected ? <img src="/packages/ff_ui/assets/images/check.png" /> : ''; // eslint-disable-line

  return (
    <li // eslint-disable-line
      className={
        classNames(
          'dropdown-base__option',
          { '-selected': selected }
        )}
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

DropdownItem.displayName = 'DropdownItem';

DropdownItem.propTypes = {
  cb: PropTypes.func,
  value: PropTypes.any,
  text: PropTypes.string,
  selected: PropTypes.bool,
  meaningText: PropTypes.string,
};

export default DropdownItem;
