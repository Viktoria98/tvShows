/* eslint-disable react/no-unused-prop-types */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

class Dot extends Component {
  constructor () {
    super();
    this.mouseEnter = this.mouseEnter.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.click = this.click.bind(this);
  }
  mouseEnter () {
    return this.props.showTooltip(this.props);
  }

  mouseLeave () {
    return this.props.resetTooltip();
  }

  click () {
    return this.props.lockTooltip();
  }

  render () {
    return (
      <circle
        className={classNames('dot', this.props.data.color)}
        cx={this.props.cx}
        cy={this.props.cy}
        r={this.props.r}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
        onClick={this.click}
        ref="dot"
      />
    );
  }
}

Dot.displayName = 'Dot';

Dot.propTypes = {
  data: PropTypes.any,
  type: PropTypes.array,
  cx: PropTypes.number,
  cy: PropTypes.number,
  r: PropTypes.number,
  showTooltip: PropTypes.func,
  resetTooltip: PropTypes.func,
  lockTooltip: PropTypes.func,
};

export default Dot;
