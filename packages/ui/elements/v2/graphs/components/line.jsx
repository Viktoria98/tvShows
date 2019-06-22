/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-prop-types */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import d3 from 'd3';

class Line extends Component {
  constructor () {
    super();
    this.renderLine = this.renderLine.bind(this);
  }

  componentDidMount () {
    return this.renderLine();
  }

  componentDidUpdate () {
    return this.renderLine();
  }

  handleYValue (value) {
    if (this.props.isLog) {
      if (!value && this.props.logScaleMinValue) {
        // approximate zero with logScaleMinValue, since log(0) = NaN (-infinity)
        return this.props.logScaleMinValue;
      }
    }
    return value;
  }

  renderLine () {
    const props = this.props;
    const line = d3.svg.line()
      .defined((d) => {
        const isDisplayed = d.value === null ? null : d;
        return isDisplayed;
      })
      .x((d) => props.x(d.date))
      .y((d) => props.y(this.handleYValue(d.value)))
      .interpolate('monotone');
    return d3.select(ReactDOM.findDOMNode(this))
      .attr('d', line(this.props.values)
    );
  }

  render () {
    return (
      <path className={classNames('line', this.props.color, { enabled: this.props.enabled })} />
    );
  }
}

Line.displayName = 'Line';

Line.propTypes = {
  values: PropTypes.array,
  color: PropTypes.string,
  store: PropTypes.any,
  enabled: PropTypes.bool,
};

export default Line;
