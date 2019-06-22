import React from 'react';
import PropTypes from 'prop-types';
import PopupBase from '../_popupBase.jsx';

const Popup = (props) => (
  <PopupBase
    id={props.id}
    active={props.active}
    title={props.title}
    onClose={props.onClose}
    className={props.className}
  >
    {props.children}
  </PopupBase>
);

Popup.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  active: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};

export default Popup;
