/* eslint-disable react/jsx-no-bind */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import StatsApp from './components/statsApp.jsx';
import LineGraph from './components/lineGraph.jsx';
import LineGraphSimplified from './components/lineGraphSimplified.jsx';

import './graphs.styl';

class Statistic extends React.Component {
  constructor (props) {
    super(props);
    this.renderSimplifiedGraphs = this.renderSimplifiedGraphs.bind(this);
    this.renderDetailedGraph = this.renderDetailedGraph.bind(this);
    // approximates 0 for log scale, since log(0)=-infinity
    this.logScaleMinValue = 0.1;
  }

  checkDataRanges (data, threshold = 1e2) { // eslint-disable-line class-methods-use-this
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
    const chosenGraph = this.props.chosenGraph || graphNames[0];
    graphNames.forEach((name) => {
      if (_.isEmpty(this.props.data[name].data)) {
        // eslint-disable-line
        return;
      }
      let isLog = false;
      if (name === 'custom') {
        const detailedGraphData = this.props.data[name];
        isLog = this.checkDataRanges(detailedGraphData.data);
      }
      graphs.push(<div // eslint-disable-line
        key={name}
        className={classNames('graph', { '-active': name === chosenGraph })}
        onClick={() => this.props.changeGraph(name)}
      >
        <h3 className="graph__name">{name}</h3>
        <LineGraphSimplified
          data={this.props.data[name]}
          startDate={this.props.date.startDate}
          endDate={this.props.date.endDate}
          isLog={isLog}
          logScaleMinValue={this.logScaleMinValue}
        />
      </div>);
    });
    return graphs;
  }

  renderDetailedGraph () {
    const graphNames = Object.keys(this.props.data);
    const chosenGraph = this.props.chosenGraph || graphNames[0];
    const detailedGraphData = this.props.data[chosenGraph];
    let isLog = false;

    if (chosenGraph === 'custom') {
      isLog = this.checkDataRanges(detailedGraphData.data);
    }
    return (
      <LineGraph
        height={310}
        label={chosenGraph}
        data={detailedGraphData}
        startDate={this.props.date.startDate}
        endDate={this.props.date.endDate}
        onChange={this.props.saveMetric}
        savedMetric={this.props.metrics && this.props.metrics[chosenGraph]}
        isLog={isLog}
        logScaleMinValue={this.logScaleMinValue}
      />
    );
  }

  render () {
    let stats;
    if (this.props.stats) {
      stats = (
        <div className="statistic__stats">
          <StatsApp data={this.props.stats} />
        </div>
      );
    }

    return (
      <div className="statistic">
        <div
          className={classNames('statistic__graphs', {
            '-short': this.props.stats,
          })}
        >
          <div className="statistic__graphs__detailed">{this.renderDetailedGraph()}</div>
          <div className="statistic__graphs__simplified">{this.renderSimplifiedGraphs()}</div>
        </div>
        {stats}
      </div>
    );
  }
}

Statistic.displayName = 'Statistic';

Statistic.propTypes = {
  stats: PropTypes.any,
  date: PropTypes.shape({
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
  }),
  data: PropTypes.any,
  hideSimplified: PropTypes.bool,
  chosenGraph: PropTypes.string,
  changeGraph: PropTypes.func,
  saveMetric: PropTypes.func,
  metrics: PropTypes.any,
};

Statistic.defaultProps = {
  stats: null,
  date: {
    startDate: new Date(),
    endDate: new Date(),
  },
  data: {},
  hideSimplified: false,
  chosenGraph: '',
  metrics: [],
};

export default Statistic;
