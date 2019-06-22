import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

export default function notification (props) {
  return (
    <div
      className={classNames('notification', {
        '-visible': props.active,
      }, props.type)}
    >
      <span>{props.message}</span>
    </div>
  );
}

notification.propTypes = {
  active: PropTypes.bool,
  type: PropTypes.string,
  message: PropTypes.string,
};

notification.displayName = 'Notification';
