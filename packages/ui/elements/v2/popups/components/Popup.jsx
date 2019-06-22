/* eslint-disable react/prop-types */

import PropTypes from 'prop-types';
import React from 'react';
import PopupBase from '../_popupBase';

const Popup = (props) => (
  <PopupBase
    id={props.id}
    className={props.className}
    width={props.width}
    active={props.active}
    title={props.title}
    onClose={props.onClose}
  >
    {props.children}
  </PopupBase>
);

Popup.displayName = 'Popup';

Popup.propTypes = {
  active: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Popup;
