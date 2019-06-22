/* eslint-disable react/prop-types */

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const FixedTooltip = class extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      coords: {},
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter (event) {
    this.checkTriggerCoords(event);
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(event);
    }
  }

  onMouseOver (event) {
    this.checkTriggerCoords(event);
    if (this.props.onMouseOver) {
      this.props.onMouseOver(event);
    }
  }

  onMouseLeave (event) {
    this.setState({
      coords: Object.assign({}, this.state.coords, { opacity: 0 }),
    });
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(event);
    }
  }

  checkTriggerCoords (event) {
    const coords = event.target.getBoundingClientRect();
    const leftShiftCoords = coords.width / 2;
    const cloudHeight = this.refs.cloud.getBoundingClientRect().height;
    this.setState({
      coords: {
        top: coords.top - cloudHeight,
        left: coords.left + leftShiftCoords,
        opacity: 1,
      },
    });
  }

  render () {
    const align = 'up';
    return (
      <div
        className={classNames(
          'fixed-tooltip',
          this.props.className
        )}
        onMouseEnter={this.onMouseEnter}
        onMouseOver={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.props.callback}
      >
        <div
          className={classNames(
            'fixed-tooltip__cloud',
            align
          )}
          ref="cloud"
          style={this.state.coords}
        >
          {this.props.children}
        </div>
        {this.props.visible}
      </div>
    );
  }
};

FixedTooltip.displayName = 'FixedTooltip';

FixedTooltip.propTypes = {
  className: PropTypes.string,
  callback: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  visible: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]),
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]),
};

export default FixedTooltip;
