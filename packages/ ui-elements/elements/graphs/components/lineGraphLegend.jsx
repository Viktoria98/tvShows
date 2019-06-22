import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import LineGraphLegendButton from './lineGraphLegendButton.jsx';
import LineGraphLegendDropdown from './lineGraphLegendDropdown.jsx';

class LineGraphLegend extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      padding: '0px',
      mini: false,
    };
  }

  componentDidMount () {
    const firstButtonTop = this.legendButtons.firstChild.getBoundingClientRect().top;
    const lastButtonTop = this.legendButtons.lastChild.getBoundingClientRect().top;
    if (!this.state.mini && firstButtonTop !== lastButtonTop) {
      this.setState({ mini: true }); // eslint-disable-line react/no-did-mount-set-state
    }
  }

  render () {
    let ret = {};
    if (this.state.mini) {
      const buttons = [];
      this.props.metrics.forEach((metric) => {
        buttons.push(<LineGraphLegendButton
          key={metric.name}
          name={metric.name}
          color={metric.color}
          selectMetric={this.props.selectMetric}
          active={_.includes(this.props.selectedMetric, metric.name)}
          mini={this.state.mini}
        />);
      }, this);

      let selectedMetric;
      if (Array.isArray(this.props.selectedMetric)) {
        selectedMetric = this.props.selectedMetric.filter((m) =>
          _.find(this.props.metrics, { name: m }));
      }

      ret = (
        <div
          className="legend"
        >
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
      this.props.metrics.forEach((metric) => {
        buttons.push(<LineGraphLegendButton
          key={metric.name}
          name={metric.name}
          color={metric.color}
          selectMetric={this.props.selectMetric}
          active={_.includes(this.props.selectedMetric, metric.name)}
        />);
      }, this);

      ret = (
        <div className="legend">
          <span className={this.props.label}>{this.props.label}</span>
          <div
            className="legend__buttons"
            ref={(c) => {
              this.legendButtons = c;
            }}
            style={{ paddingLeft: this.state.padding }}
          >
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
