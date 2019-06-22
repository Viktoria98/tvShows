import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './tooltip.styl';

const Tooltip = (props) => {
  const {
    visible, children, align, ...rest
  } = props;

  return (
    <div className="tooltip" {...rest}>
      <div className={classNames('tooltip__cloud', align || 'up')}>{children}</div>
      {visible}
    </div>
  );
};

Tooltip.propTypes = {
  align: PropTypes.string,
  visible: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
      ])
    ),
  ]).isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

Tooltip.defaultOption = {
  arrowDirection: 'down',
  horizontalDirection: 'center',
};

export default Tooltip;
