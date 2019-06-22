import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Checkbox from '../../checkboxes/checkbox.jsx';

const SystemCheckbox = (props) => {
  const { disableCheckbox, checked, cb } = props;

  if (disableCheckbox) {
    return null;
  }

  return <Checkbox checked={checked} onCheck={cb} />;
};

SystemCheckbox.propTypes = {
  disableCheckbox: PropTypes.bool,
  checked: PropTypes.bool,
  cb: PropTypes.func,
};

export default SystemCheckbox;
