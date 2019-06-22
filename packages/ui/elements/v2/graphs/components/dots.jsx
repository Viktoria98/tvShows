/* eslint-disable react/prop-types */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Dot from './dot';

class Dots extends Component {
  constructor () {
    super();
    this.renderDots = this.renderDots.bind(this);
  }

  handleYValue (value) {
    if (this.props.isLog) {
      if (!value && this.props.logScaleMinValue) {
        // approximate zero with logScaleMinValue, since log(0) = NaN (-infinity)
        return this.props.y(this.props.logScaleMinValue);
      }
    }
    // hide from view if no value in DB
    return value === null ? -1000000 : this.props.y(value);
  }

  renderDots (coords, i) {
    const props = {
      data: {
        metric: coords.metric,
        date: coords.date,
        value: coords.value,
        week: coords.week,
        color: coords.color,
      },
      type: this.props.type,
      cx: this.props.dates.length === 1 ? 720 : this.props.x(coords.date),
      cy: this.handleYValue(coords.value),
      r: 4,
      showTooltip: this.props.showTooltip,
      resetTooltip: this.props.resetTooltip,
      lockTooltip: this.props.lockTooltip,
      key: i,
    };

    return <Dot {...props} />;
  }

  render () {
    return (
      <g className="dots">
        {this.props.data.map(this.renderDots)}
      </g>
    );
  }
}

Dots.displayName = 'Dots';

Dots.propTypes = {
  type: PropTypes.array,
  dates: PropTypes.array,
  x: PropTypes.func,
  y: PropTypes.func,
  showTooltip: PropTypes.func,
  resetTooltip: PropTypes.func,
  lockTooltip: PropTypes.func,
  data: PropTypes.array,
};

export default Dots;
