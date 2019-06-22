/* eslint-disable react/jsx-no-bind */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

import StatsApp from './components/statsApp';
import LineGraph from './components/lineGraph';
import LineGraphSimplified from './components/lineGraphSimplified';

const Statistic = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenMetric: '',
    };
    this.changeMetric = this.changeMetric.bind(this);
    this.renderSimplifiedGraphs = this.renderSimplifiedGraphs.bind(this);
    this.renderDetailedGraph = this.renderDetailedGraph.bind(this);
    // approximates 0 for log scale, since log(0)=-infinity
    this.logScaleMinValue = 0.1;
  }

  componentWillReceiveProps (newProps) {
    this.setState({ chosenMetric: newProps.store.chosenGraph });
  }

  changeMetric (metric) {
    this.props.store.chosenGraph = metric;
    this.setState({ chosenMetric: metric }, () => {
      this.refs.mainGraph.initSelectedMetric();
    });
  }

  checkDataRanges (data, threshold = 1e2) {
    if (!data || !data.length) {
      return false;
    }
    const colors = [];
    let max = data[0].value;
    let min = data[0].value;
    data.forEach((item) => {
      if (item.color && colors.indexOf(item.color) === -1) {
        colors.push(item.color);
      }
      if (item.value > max) {
        max = item.value;
      }
      if (item.value < min) {
        min = item.value;
      }
    });
    // disable log scale if there is few colors
    // or negative values, since log(negative) is undefined
    if (colors.length <= 1 || min < 0) {
      return false;
    }
    if (min !== 0 && Math.abs(max / min) > threshold) {
      return true;
    } else if (min === 0 && Math.abs(max - min) > threshold * 100) {
      return true;
    }
    return false;
  }

  renderSimplifiedGraphs () {
    if (this.props.hideSimplified) {
      return null;
    }
    const graphs = [];
    const graphNames = Object.keys(this.props.data);
    const chosenGraph = this.state.chosenMetric || graphNames[0];
    graphNames.forEach((name) => {
      if (_.isEmpty(this.props.data[name].data)) { // eslint-disable-line
        return;
      }
      let isLog = false;
      if (name === 'custom') {
        const detailedGraphData = this.props.data[name];
        isLog = this.checkDataRanges(detailedGraphData.data);
      }
      graphs.push(
        <div
          key={name}
          className={classNames(
            'graph',
            { '-active': name === chosenGraph }
          )}
          onClick={this.changeMetric.bind(null, name)}
        >
          <h3 className="graph__name">{name}</h3>
          <LineGraphSimplified
            data={this.props.data[name]}
            startDate={this.props.date.startDate}
            endDate={this.props.date.endDate}
            isLog={isLog}
            logScaleMinValue={this.logScaleMinValue}
          />
        </div>
      );
    });
    return graphs;
  }

  renderDetailedGraph () {
    const graphNames = Object.keys(this.props.data);
    const chosenGraph = this.state.chosenMetric || graphNames[0];
    const detailedGraphData = this.props.data[chosenGraph];
    let isLog = false;

    if (chosenGraph === 'custom') {
      isLog = this.checkDataRanges(detailedGraphData.data);
    }
    return (
      <LineGraph
        ref="mainGraph"
        height={310}
        label={chosenGraph}
        data={detailedGraphData}
        startDate={this.props.date.startDate}
        endDate={this.props.date.endDate}
        onChange={this.props.store.saveMetric.bind(this.props.store)}
        savedMetric={this.props.store.metrics && this.props.store.metrics[chosenGraph]}
        isLog={isLog}
        logScaleMinValue={this.logScaleMinValue}
      />
    );
  }

  render () {
    let stats;
    if (this.props.stats) {
      stats = (<div className="statistic__stats">
        <StatsApp data={this.props.stats} />
      </div>);
    }

    return (
      <div className="statistic">
        <div
          className={classNames(
            'statistic__graphs',
            { '-short': this.props.stats }
          )}
        >
          <div className="statistic__graphs__detailed">
            {this.renderDetailedGraph()}
          </div>
          <div className="statistic__graphs__simplified">
            {this.renderSimplifiedGraphs()}
          </div>
        </div>
        {stats}
      </div>
    );
  }
};

Statistic.displayName = 'Statistic';

Statistic.propTypes = {
  stats: PropTypes.any,
  date: PropTypes.shape({
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
  }),
  data: PropTypes.any,
  store: PropTypes.any,
  hideSimplified: PropTypes.bool,
};

export default Statistic;
