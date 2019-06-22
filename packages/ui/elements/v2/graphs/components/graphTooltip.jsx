/* eslint-disable react/prop-types */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import moment from 'moment-timezone';
import SimpleDate from '../../../formatters/SimpleDate';

class GraphTooltip extends Component {
  constructor (props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      date: '',
      metric: '',
      value: 0,
      visible: false,
      wrapped: false,
      locked: false,
    };
    this.unlockTooltip = this.unlockTooltip.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps && nextProps.data && !this.state.visible) {
      if (nextProps.data.locked) {
        return this.setState({
          locked: true,
        });
      }
      let dateFormat;
      const groupBy = this.props.groupBy;
      if (groupBy === 'week') {
        const dateVal = SimpleDate.format(nextProps.data.date, 'MMM Do');
        dateFormat = `Week ${moment(nextProps.data.date).week()} (${dateVal})`; // eslint-disable-line
      } else if (groupBy === 'month') {
        dateFormat = SimpleDate.format(nextProps.data.date, 'MMM, gggg');
      } else if (groupBy === 'quarter') {
        dateFormat = `Quarter ${moment(nextProps.data.date).quarter()}, ${SimpleDate.format(nextProps.data.date, 'gggg')}`; // eslint-disable-line
      } else {
        dateFormat = SimpleDate.format(nextProps.data.date, 'MMM Do, gggg');
      }

      return this.setState({
        x: nextProps.cx,
        y: nextProps.cy + 30,
        date: dateFormat,
        metric: nextProps.data.metric,
        value: nextProps.data.value,
        visible: true,
      }, ((_this) => () => {
        const pos = _this.refs.cloud.getBoundingClientRect();
        if (pos.left < 0 || pos.right > document.body.clientWidth) {
          return _this.setState({
            wrapped: true,
          });
        }
        return undefined;
      })(this));
    }
    return this.hideTooltip();
  }

  unlockTooltip () { // eslint-disable-line
    return this.setState({ locked: false }, () => this.hideTooltip());
  }

  hideTooltip () {
    if (!this.state.locked) {
      return this.setState({
        x: 0,
        y: 0,
        visible: false,
        wrapped: false,
        locked: false,
      });
    }
    return undefined;
  }

  getXOffset () {
    const defaultOffset = 50;
    const { x } = this.state;
    if (!this.refs.cloud || !x) {
      return defaultOffset;
    }
    const width = this.refs.cloud.offsetWidth || 190; // (avg window width)/2
    if (x > window.innerWidth - width) {
      return { offsetRight: true, dist: 80 };
    } else if (x < width) {
      return { offsetLeft: true, dist: 20 };
    }
    return { dist: defaultOffset };
  }

  render () {
    const offset = !this.state.wrapped ? 105 : 127;
    const xOffset = this.getXOffset();
    return (
      <div className={classNames('graphTooltip', { '-visible': this.state.visible })}>
        <div
          className={classNames(
            'graphTooltip__cloud',
            { 'tip-left': xOffset.offsetLeft },
            { 'tip-right': xOffset.offsetRight }
          )}
          ref="cloud"
          style={{
            left: `${this.state.x}px`,
            top: `${this.state.y}px`,
            transform: `translate(-${xOffset.dist}%, -${offset}px)` }}
        >
          <div className="graphTooltip__date">{this.state.date}</div>
          <div className="graphTooltip__value">
            {this.state.metric}: <span className={classNames({ '-shifted': this.state.wrapped })}>
              {this.state.value}
            </span>
          </div>
        </div>
        <div
          className={classNames('graphTooltip__closer', { '-visible': this.state.locked })}
          onClick={this.unlockTooltip}
        />
      </div>
    );
  }
}

GraphTooltip.displayName = 'GraphTooltip';

GraphTooltip.propTypes = {
  data: PropTypes.object,
  groupBy: PropTypes.string,
};

export default GraphTooltip;
