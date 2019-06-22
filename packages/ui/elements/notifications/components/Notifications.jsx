import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const Notifications = (props) => (
  <div id="notification" className={classNames('notification', { '-visible': props.active }, props.type)}>
    <span>{props.message}</span>
  </div>
);

Notifications.displayName = 'Notifications';

Notifications.propTypes = {
  active: PropTypes.bool,
  message: PropTypes.string,
  type: PropTypes.string,
};

export default Notifications;
