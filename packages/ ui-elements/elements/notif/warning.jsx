import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icons/icon';

const Warning = (props) => (
  <div id="warning" className={classNames('warning', `-${props.type}`)}>
    <div id="icon">
      <Icon type={props.icon} />
    </div>
    <div id="textbox">{props.message}</div>
  </div>
);

Warning.displayName = 'Warning';

Warning.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.string,
};

export default Warning;

