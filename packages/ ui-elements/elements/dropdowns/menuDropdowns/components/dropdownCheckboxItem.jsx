import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Checkbox from '../../../checkboxes/checkbox.jsx';

const DropdownCheckboxItem = (props) => {
  const { cb, text, checked } = props;

  const onClick = () => {
    const { value, text } = props;
    cb(value || text);
  };

  return (
    <li className="dropdown__checkbox-item" onClick={onClick}>
      <Checkbox name={text} checked={checked} onCheck={onClick} />
      {text}
    </li>
  );
};

DropdownCheckboxItem.propTypes = {
  item: PropTypes.object,
  cb: PropTypes.func,
  text: PropTypes.string,
};

export default DropdownCheckboxItem;
