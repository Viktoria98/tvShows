import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './notif.styl';

const Notification = (props) => (
  <div className={classNames('notification', { '-visible': props.message }, props.type)}>
    <span>{props.message}</span>
  </div>
);

Notification.propTypes = {
  active: PropTypes.bool, // not used
  type: PropTypes.string,
  message: PropTypes.string,
};

export default Notification;
