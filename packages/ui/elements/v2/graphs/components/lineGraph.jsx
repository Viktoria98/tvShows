/* eslint-disable react/prop-types */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import d3 from 'd3';
import moment from 'moment-timezone';
import _ from 'underscore';
import Format from '../../../formatters/Format';
import Line from './line';
import Dots from './dots';
import GraphTooltip from './graphTooltip';
import Grid from './grid';
import XAxis from './xAxis';
import YAxis from './yAxis';
import LineGraphLegend from './lineGraphLegend';

class LineGraph extends Component {
  constructor (props) {
    super(props);
    this.state = {
      width: 0,
      selectedMetric: this.props.savedMetric || [],
      tooltipData: null,
    };
    this.initSelectedMetric = this.initSelectedMetric.bind(this);
    this.resize = this.resize.bind(this);
    this.selectMetric = this.selectMetric.bind(this);
    this.saveMetric = this.saveMetric.bind(this);
    this.showTooltip = this.showTooltip.bind(this);
    this.resetTooltip = this.resetTooltip.bind(this);
    this.lockTooltip = this.lockTooltip.bind(this);
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

  initSelectedMetric () {
    return this.setState({
      selectedMetric: this.props.savedMetric || [],
    });
  }

  resize () {
    if (!this.refs.container) {
      return;
    }
    const width = this.refs.container.offsetWidth;
    if (this.state.width === width) {
      return null; // eslint-disable-line
    }
    return this.setState({ // eslint-disable-line
      width,
    });
  }

  selectMetric (metric) {
    const array = this.state.selectedMetric.slice();
    if (_.contains(array, metric)) {
      return this.setState({
        selectedMetric: _.without(array, metric),
      }, () => this.saveMetric());
    }
    array.push(metric);
    return this.setState({
      selectedMetric: array,
    }, () => this.saveMetric());
  }

  saveMetric () {
    return this.props.onChange(this.state.selectedMetric, this.props.label);
  }

  showTooltip (tooltipData) {
    // tooltip will now show if previously shown one didn't disappeared yet
    const newData = tooltipData;
    if (this.state.tooltipData != null) {
      this.resetTooltip(() => {
        this.setState({
          tooltipData: newData,
        });
      });
    }
    newData.data.value = Format.number(newData.data.value);
    return this.setState({
      tooltipData: newData,
    });
  }

  resetTooltip (cb) {
    return this.setState({
      tooltipData: null,
    }, cb);
  }

  lockTooltip () {
    const newData = this.state.tooltipData;
    newData.data.locked = true;
    return this.setState({
      tooltipData: newData,
    });
  }

  render () {
    if (!this.props.data) {
      return null;
    }
    const data = this.props.data.data;
    const dates = _.uniq(data.map((d) => d.date.toString()))
                    .map((d) => new Date(d));
    if (dates.length === 1 && typeof this.displayDotsOnStart === 'undefined') {
      this.displayDotsOnStart = true;
    }
    const height = this.props.height;
    const horizontalPadding = 70;
    const bottomAxisTextPadding = 5;
    const margins = [30, 0, 30, 0];
    const w = this.state.width - margins[1] - margins[3];
    const h = height - margins[0] - margins[2] - bottomAxisTextPadding;
    const startDate = moment(this.props.startDate);
    const endDate = moment(this.props.endDate);
    const { isLog, logScaleMinValue } = this.props;
    let x;
    let y;

    const dataArr = Object.values(data);
    const map = dataArr
      .filter((item) => this.state.selectedMetric.includes(item.metric))
      .map((item) => item.value);

    if (isLog) {
      y = d3.scale.log()
        .range([h, 0])
        .domain([
          logScaleMinValue, d3.max(data, (d) => d.value),
        ])
        .nice();
    } else {
      const minVal = d3.min(data, (d) => d.value);
      let maxVal = Math.max.apply(null, map) > 0 ?
        Math.max.apply(null, map) :
        d3.max(data, (d) => d.value);
      if (minVal === 0 && maxVal === 0) {
        maxVal = 1;
      }
      y = d3.scale.linear()
        .range([h, 0])
        .domain([
          minVal, maxVal,
        ])
        .nice();
    }

    const dataNest = d3.nest()
                      .key((d) => d.metric)
                      .entries(data);
    const groupBy = this.props.data.groupBy;
    const metrics = [];
    const lines = [];
    let dotsData = [];
    const noMetricSelected = _.isEmpty(this.state.selectedMetric);
    let allPreparedStatsArray = [], // eslint-disable-line
      timeRange,
      timeClause,
      weekFormat, // eslint-disable-line
      padding, // eslint-disable-line
      selected,
      enabled,
      dots;

    switch (groupBy) {
      case 'day':
        timeRange = Math.ceil(endDate.diff(startDate, 'days', true));
        timeClause = (curEl, curDate) => {
          const format = 'YYYY-MM-DD';
          const statsDate = moment(curEl.date);
          // eslint-disable-next-line
          return statsDate.format(format) == curDate.format(format);
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

    dataNest.forEach((d, i) => {
      let preparedStatsArray = [], // eslint-disable-line
        counter = 0,
        currentDate,
        currentStatEl,
        currentStatValue;
      const color = d.values[0].color;

      metrics.push({
        name: d.key,
        color,
      });

      if (dates.length === 1 && this.displayDotsOnStart) {
        this.state.selectedMetric.push(d.key);
      }
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
            if (statsDate.isAfter(currentDate)) {
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

      x = d3.time.scale()
                   .domain([preparedStatsArray[0].date,
                     preparedStatsArray[preparedStatsArray.length - 1].date])
                   .range([horizontalPadding, (w - horizontalPadding) + 20])
                   .nice();

      allPreparedStatsArray = allPreparedStatsArray.concat(preparedStatsArray);

      selected = _.contains(this.state.selectedMetric, d.key);
      if (selected) {
        dotsData = dotsData.concat(preparedStatsArray);
      }
      enabled = noMetricSelected || selected;

      return lines.push(
        <Line
          key={i}
          values={preparedStatsArray}
          color={d.values[0].color}
          x={x}
          y={y}
          enabled={enabled}
          isLog={isLog}
          logScaleMinValue={logScaleMinValue}
        />
      );
    });

    allPreparedStatsArray = _.uniq(allPreparedStatsArray.map((d) => d.date))
                                                        .map((d) => new Date(d));

    if (!noMetricSelected || dates.length === 1) {
      dots = (
        <Dots
          data={dotsData}
          x={x}
          y={y}
          type={this.state.selectedMetric}
          showTooltip={this.showTooltip}
          resetTooltip={this.resetTooltip}
          lockTooltip={this.lockTooltip}
          dates={allPreparedStatsArray}
          isLog={isLog}
          logScaleMinValue={logScaleMinValue}
        />
      );
    }
    this.displayDotsOnStart = dates.length !== 1;

    return (
      <div className="graphOuterContainer" ref="container">
        <LineGraphLegend
          metrics={metrics}
          selectMetric={this.selectMetric}
          selectedMetric={this.state.selectedMetric}
          label={this.props.label}
        />
        <div className="graphInnerContainer">
          <svg className="graph" width={this.state.width} height={height}>
            <g transform={`translate(${margins[3]}, ${margins[0] - 5})`}>
              <XAxis
                x={x}
                h={h}
                translate={{ x: (allPreparedStatsArray.length === 1 ? 600 : 0), y: h + 10 }}
                data={allPreparedStatsArray}
                groupBy={groupBy}
                isLog={isLog}
              />
              <YAxis
                y={y}
                translate="40"
                align="left"
                isLog={isLog}
              />
              <YAxis
                y={y}
                translate={w - 5}
                align="right"
                isLog={isLog}
              />
              <Grid w={w} y={y} isLog={isLog} />
              {lines}
              {dots}
            </g>
          </svg>
          <GraphTooltip groupBy={groupBy} {...this.state.tooltipData} />
        </div>
      </div>
    );
  }
}

LineGraph.displayName = 'LineGraph';

LineGraph.propTypes = {
  savedMetric: PropTypes.array,
  onChange: PropTypes.func,
  label: PropTypes.string,
  data: PropTypes.object,
};

export default LineGraph;
