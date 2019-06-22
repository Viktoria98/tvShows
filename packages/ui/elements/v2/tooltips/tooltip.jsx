import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const Tooltip = (props) => {
  const align = props.align || 'up';

  return (
    <div className={classNames('tooltip', align)}>
      <div className={classNames('tooltip__cloud', align)}>
        {props.children}
      </div>
      {props.visible}
    </div>
  );
};

Tooltip.displayName = 'Tooltip';

Tooltip.propTypes = {
  align: PropTypes.string,
  visible: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
};

export default Tooltip;
