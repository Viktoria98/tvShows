import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Tooltip from '../tooltips/tooltip.jsx';
import Icon from '../icons/icon.jsx';

import './buttons.styl';

const Button = (props) => {
  const content = [];
  let tooltip;

  if (props.icon) {
    content.push(<Icon key="icon" type={props.icon} />);
  }
  if (props.text) {
    content.push(props.text);
  }

  if (props.tooltip) {
    tooltip = (
      <Tooltip visible={content} align={props.tooltipAlign}>
        {props.tooltip}
      </Tooltip>
    );
  }

  return (
    <button
      id={props.id}
      className={classNames(
        'button',
        props.className,
        { '-tooltip': props.tooltip },
        { '-icon': props.icon },
        { '-disabled': props.disabled }
      )}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {tooltip || content}
    </button>
  );
};

Button.propTypes = {
  id: PropTypes.string,
  onClick: PropTypes.func,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  tooltipAlign: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
};

export default Button;
