import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Tooltip from '../tooltips/tooltip';
import Icon from '../icons/icon';

export default function button (props) {
  let text;
  let tooltip;

  if (props.icon) {
    text = <Icon type={props.icon} />;
  } else {
    text = props.text;
  }

  if (props.tooltip) {
    tooltip = (
      <Tooltip visible={text} align={props.tooltipAlign}>
        {props.tooltip}
      </Tooltip>
    );
  }

  return (
    <button
      id={props.id || ''}
      className={
        classNames(
          'button', props.className,
          { '-tooltip': props.tooltip },
          { '-icon': props.icon },
          { '-disabled': props.disabled }
        )
      }
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
    >
      {tooltip || text}
    </button>
  );
}

button.displayName = 'Button';

button.propTypes = {
  onClick: PropTypes.func,
  tooltip: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  tooltipAlign: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  className: PropTypes.string,
};
