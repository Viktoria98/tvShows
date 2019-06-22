import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './popups.styl';

const PopupBase = (props) => (
  <section id={props.id} className={classNames('popup', { 'popup--active': props.active })}>
    <div className="popup__overlay" onClick={props.onClose} />
    <div className={`popup__body ${props.className}`}>
      <h2 className="popup__title">{props.title}</h2>
      <div className="popup__close-btn" onClick={props.onClose} />
      <div className="popup__content-box">{props.children}</div>
    </div>
  </section>
);

PopupBase.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  active: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};

export default PopupBase;
