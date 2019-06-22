import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LineGraphLegendButton from './lineGraphLegendButton';
import LineGraphLegendDropdown from './lineGraphLegendDropdown';
import _ from 'underscore';

class LineGraphLegend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      padding: '0px',
      mini: false,
    };
  }

  componentDidMount() {
    const firstButtonTop = this.refs.legendButtons.firstChild.getBoundingClientRect().top;
    const lastButtonTop = this.refs.legendButtons.lastChild.getBoundingClientRect().top;
    if (!this.state.mini && firstButtonTop !== lastButtonTop) {
      this.setState({ mini: true });
    }
  }

  render() {
    let ret = {};
    if (this.state.mini) {
      const buttons = [];
      this.props.metrics.forEach((metric, i) => {
        buttons.push(
          <LineGraphLegendButton
            key={i}
            name={metric.name} color={metric.color}
            selectMetric={this.props.selectMetric}
            active={_.contains(this.props.selectedMetric, metric.name)}
            mini={this.state.mini}
          />
        );
      }, this);

      let selectedMetric;
      if (Array.isArray(this.props.selectedMetric)) {
        selectedMetric = this.props.selectedMetric.filter((m) => {
          return _.find(this.props.metrics, { name: m });
        });
      }

      ret = (
        <div className="legend" ref="legendContainer">
          <span className={this.props.label}>{this.props.label}</span>
          <div className="legend__buttons" style={{ paddingLeft: this.state.padding }}>
            {buttons}
          </div>
          <LineGraphLegendDropdown
            options={this.props.metrics}
            selectMetric={this.props.selectMetric}
            selectedMetric={selectedMetric || []}
          />
        </div>
      );
    } else {
      const buttons = [];
      this.props.metrics.forEach((metric, i) => {
        buttons.push(
          <LineGraphLegendButton
            key={i}
            name={metric.name} color={metric.color}
            selectMetric={this.props.selectMetric}
            active={_.contains(this.props.selectedMetric, metric.name)}
          />
        );
      }, this);

      ret = (
        <div className="legend">
          <span className={this.props.label}>{this.props.label}</span>
          <div className="legend__buttons" ref={'legendButtons'} style={{ paddingLeft: this.state.padding }}>
            {buttons}
          </div>
        </div>
      );
    }
    return ret;
  }
}

LineGraphLegend.propTypes = {
  label: PropTypes.string,
  metrics: PropTypes.array,
  selectMetric: PropTypes.func,
  selectedMetric: PropTypes.array,
};

export default LineGraphLegend;
