/* eslint-disable react/jsx-no-bind */

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

function LineGraphLegendButton (props) {
  return (
    <button
      className={classNames(
        'legend__button',
        props.color,
        { mini: props.mini },
        { active: props.active }
      )}
      onClick={props.selectMetric.bind(null, props.name)}
    >
      {props.mini ? '' : props.name}
    </button>
  );
}

LineGraphLegendButton.displayName = 'LineGraphLegendButton';

LineGraphLegendButton.propTypes = {
  active: PropTypes.bool,
  mini: PropTypes.bool,
  color: PropTypes.string,
  name: PropTypes.string,
  selectMetric: PropTypes.func,
};

export default LineGraphLegendButton;
