/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import d3 from 'd3';
import ReactDOM from 'react-dom';
import moment from 'moment-timezone';
import _ from 'lodash';

class XAxis extends Component {
  constructor () {
    super();
    this.renderAxis = this.renderAxis.bind(this);
  }

  componentDidMount () {
    return this.renderAxis();
  }

  componentDidUpdate () {
    return this.renderAxis();
  }

  renderAxis () {
    const node = ReactDOM.findDOMNode(this);
    const data = _.uniqBy(this.props.data, (d) => d.getTime());
    const groupBy = this.props.groupBy;
    const totalTicks = 6;
    let ticks;

    if (data.length > 14 || groupBy === 'month') {
      ticks = [];
      let date;
      const lastDate = data[data.length - 1];
      const tickRange = data.length / totalTicks;
      let n = 0;
      for (let i = 0; i < totalTicks; i++) {
        date = data[Math.floor(n)];
        if (date) {
          ticks.push(date);
          n += tickRange;
        }
        ticks.push(lastDate);
      }
    } else {
      ticks = data;
    }

    const axis = d3.svg.axis()
                  .scale(this.props.x)
                  .tickValues(ticks);

    // eslint-disable-next-line
    (groupBy === 'week' || groupBy === 'quarter') ? axis.tickFormat(() => '') :
    (groupBy === 'month') ? axis.tickFormat(d3.time.format('%b')) :
                            axis.tickFormat(d3.time.format('%b %d'));

    d3.select(node)
      .call(axis);

    if (groupBy === 'week') {
      d3.selectAll('.x.axis.week g text')
        .each(function (d) {
          putWeekAndDateOnTwoLines(d, this);
        });
    }

    if (groupBy === 'quarter') {
      d3.selectAll('.x.axis.quarter g text')
        .each(function (d) {
          putQuarter(d, this);
        });
    }
  }

  render () {
    const timeTypeClass = this.props.groupBy;
    return (
      <g
        className={classNames('x', 'axis', timeTypeClass)}
        transform={`translate(${this.props.translate.x}, ${this.props.translate.y})`}
      />
    );
  }
}

XAxis.displayName = 'XAxis';

XAxis.propTypes = {
  translate: PropTypes.object,
  x: PropTypes.func,
  data: PropTypes.array,
  groupBy: PropTypes.string,
};

export default XAxis;

function putWeekAndDateOnTwoLines (d, el) {
  const d3el = d3.select(el);
  const date = moment(d);
  const weekText = d3el.append('tspan')
                    .text(`Week ${date.week()}`);
  const dayText = d3el.append('tspan')
                    .text(`${date.format('MMM')} ${date.format('DD')}`);

  weekText
    .attr('x', 0)
    .attr('y', '0');
  dayText
    .attr('x', 0)
    .attr('y', '25');
}

function putQuarter (d, el) {
  const d3el = d3.select(el);
  const date = moment(d);
  const quarterText = d3el.append('tspan')
                        .text(`Q${date.quarter()}`);
  const yearText = d3el.append('tspan')
                    .text(`${date.format('YYYY')}`);

  quarterText
    .attr('x', 0)
    .attr('y', '0');
  yearText
    .attr('x', 0)
    .attr('y', '25');
}
