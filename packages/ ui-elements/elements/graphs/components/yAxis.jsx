/* eslint-disable react/prop-types */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import d3 from 'd3';

class YAxis extends React.Component {
  constructor (props) {
    super(props);
    this.renderAxis = this.renderAxis.bind(this);
  }

  componentDidMount () {
    return this.renderAxis();
  }

  componentDidUpdate () {
    return this.renderAxis();
  }

  renderAxis () {
    const toMetricPrefix = (divident, divisor, prefix) => {
      const quotient = divident / divisor;
      const decimalPlaces = quotient % 1 === 0 ? 0 : 1;
      return `${quotient.toFixed(decimalPlaces)}${prefix}`;
    };
    const formatValues = (value) => {
      const absoluteValue = Math.abs(value);
      if (absoluteValue > 999 && absoluteValue < 1e6) {
        return toMetricPrefix(value, 1e3, 'K');
      }

      if (absoluteValue > 999999 && absoluteValue < 1e9) {
        return toMetricPrefix(value, 1e6, 'M');
      }

      if (absoluteValue > 999999999 && absoluteValue < 1e12) {
        return toMetricPrefix(value, 1e9, 'B');
      }

      return parseFloat(value.toFixed(2));
    };

    const node = ReactDOM.findDOMNode(this);
    const axis = d3.svg
      .axis()
      .scale(this.props.y)
      .orient('left');

    if (this.props.isLog) {
      axis.ticks(0, (d) => formatValues(d));
    } else {
      axis.ticks(5)
        .tickFormat((d) => formatValues(d));
    }

    return d3.select(node)
      .call(axis);
  }

  render () {
    return (
      <g
        className={classNames('y', 'axis', this.props.align)}
        transform={`translate(${this.props.translate}, -10)`}
      />
    );
  }
}

YAxis.displayName = 'YAxis';

YAxis.propTypes = {
  translate: PropTypes.any,
  y: PropTypes.any,
  align: PropTypes.string,
};

export default YAxis;
