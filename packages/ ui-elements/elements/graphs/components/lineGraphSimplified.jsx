/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import d3 from 'd3';
import moment from 'moment-timezone';

import Line from './line.jsx';

class LineGraphSimplified extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      width: 0,
    };
  }

  componentDidMount () {
    this.resize();
    return window.addEventListener('resize', this.resize);
  }

  componentDidUpdate () {
    this.resize();
  }

  componentWillUnmount () {
    return window.removeEventListener('resize', this.resize);
  }

  resize () {
    if (!this.container) {
      return null;
    }
    const width = this.container.offsetWidth;
    if (this.state.width === width) {
      return null;
    }
    return this.setState({
      width,
    });
  }

  render () {
    if (!this.props.data) {
      return null;
    }
    const { data } = this.props.data;
    const height = 80;
    const horizontalPadding = 0;
    const margins = [15, 0, 15, 0];
    // eslint-disable-next-line
    const dates = _.uniq(data.map((d) => d.date.toString())).map((d) => new Date(d));
    if (dates.length === 1 && typeof this.displayDotsOnStart === 'undefined') {
      this.displayDotsOnStart = true;
    }
    const w = this.state.width - margins[1] - margins[3];
    const h = height - margins[0] - margins[2];
    const startDate = moment(this.props.startDate);
    const endDate = moment(this.props.endDate);
    const { isLog, logScaleMinValue } = this.props;

    const x = d3.time
      .scale()
      .domain([startDate.toDate(), endDate.toDate()])
      .range([horizontalPadding, w - horizontalPadding])
      .nice();
    let y;

    if (isLog) {
      y = d3.scale
        .log()
        .range([h, 0])
        .domain([logScaleMinValue, d3.max(data, (d) => d.value)])
        .nice();
    } else {
      y = d3.scale
        .linear()
        .range([h, 0])
        .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
        .nice();
    }

    const dataNest = d3
      .nest()
      .key((d) => d.metric)
      .entries(data);
    const metrics = [];
    const lines = [];
    const { groupBy } = this.props.data;
    let allPreparedStatsArray = [];
    let timeRange;
    let timeClause;
    let padding;

    switch (groupBy) {
      case 'day':
        timeRange = Math.ceil(endDate.diff(startDate, 'days', true));
        timeClause = (curEl, curDate) => {
          const format = 'YYYY-MM-DD';
          const statsDate = moment(curEl.date);
          return statsDate.format(format) == curDate.format(format); // eslint-disable-line
        };
        break;
      case 'week':
        timeRange = Math.ceil(endDate.diff(startDate, 'weeks', true));
        timeClause = (curEl, curDate) => (+curEl.week).toString() === curDate.format('W');
        break;
      case 'month':
        timeRange = Math.ceil(endDate.diff(startDate, 'month', true));
        timeClause = (curEl, curDate) => {
          const monthMatch = curEl.month === curDate.format('MM');
          const yearMatch = curEl.year === curDate.format('YYYY');
          return monthMatch && yearMatch;
        };
        break;
      case 'quarter':
        timeRange = Math.ceil(endDate.diff(startDate, 'quarter', true));
        timeClause = (curEl, curDate) => {
          const qurterMatch = Math.ceil(curEl.month / 3) === curDate.quarter();
          const yearMatch = curEl.year === curDate.format('YYYY');
          return qurterMatch && yearMatch;
        };
        break;
      default:
        break;
    }

    let count = 0;
    dataNest.forEach((d, i) => {
      count += 1;
      let preparedStatsArray = [];
      let counter = 0;
      let currentDate;
      let currentStatEl;
      let currentStatValue;
      const { color } = d.values[0];

      metrics.push({
        name: d.key,
        color,
      });

      if (timeRange === d.values.length) {
        preparedStatsArray = d.values;
      } else {
        currentDate = startDate.clone();
        if (groupBy === 'week') {
          currentDate.startOf('isoWeek');
        }
        while (currentDate.isBefore(endDate)) {
          currentStatEl = d.values[counter];
          if (currentStatEl) {
            const statsDate = moment(currentStatEl.date);
            if (currentDate.isAfter(statsDate)) {
              currentDate = statsDate.clone();
            }
            if (timeClause(currentStatEl, currentDate)) {
              currentStatValue = currentStatEl.value;
              counter += 1;
            } else {
              currentStatValue = null;
            }
          } else {
            currentStatValue = null;
          }

          const statsItem = {
            color: d.values[0].color,
            date: currentDate.toDate(),
            day: currentDate.format('DD'),
            metric: d.values[0].metric,
            month: currentDate.format('MM'),
            value: currentStatValue,
            week: currentDate.format('WW'),
            year: currentDate.format('YYYY'),
          };

          preparedStatsArray.push(statsItem);
          currentDate.add(1, `${groupBy}s`);
        }
      }

      allPreparedStatsArray = allPreparedStatsArray.concat(preparedStatsArray);

      return lines.push(<Line
        key={d.key}
        values={preparedStatsArray}
        color={d.values[0].color}
        x={x}
        y={y}
        enabled
        isLog={isLog}
        logScaleMinValue={logScaleMinValue}
      />);
    });

    return (
      <div
        className="graphContainer"
        ref={(c) => {
          this.container = c;
        }}
      >
        <svg
          className={classNames('graph', '-simplified')}
          width={this.state.width}
          height={height}
        >
          <g transform={`translate(${margins[3]}, ${margins[0]})`}>{lines}</g>
        </svg>
      </div>
    );
  }
}

LineGraphSimplified.displayName = 'LineGraphSimplified';

LineGraphSimplified.propTypes = {
  value: PropTypes.object,
  data: PropTypes.object,
};

export default LineGraphSimplified;
