/* eslint-disable react/prop-types */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Grid extends Component {
  constructor () {
    super();
    this.renderLines = this.renderLines.bind(this);
  }

  renderLines (coords, i) {
    let offsetLeft = 0;
    let offsetRight = 0;
    if (this.props.isLog) {
      // leaves only every 10th tick, since log scale has many ticks
      // to visiualize the distortion it produces
      if (i % 10 !== 0) {
        return null;
      }
      offsetLeft = 50;
      offsetRight = 60;
    }
    const props = {
      x1: 0 + offsetLeft,
      x2: this.props.w - offsetRight,
      y1: this.props.y(coords),
      y2: this.props.y(coords),
    };

    return (
      <line key={i} className="stroke horizontal" {...props} />
    );
  }

  render () {
    return (
      <g className="grid">
        {this.props.y.ticks(5)
          .map(this.renderLines)}
      </g>
    );
  }
}

Grid.displayName = 'Grid';

Grid.propTypes = {
  w: PropTypes.number,
  y: PropTypes.func,
};

export default Grid;
