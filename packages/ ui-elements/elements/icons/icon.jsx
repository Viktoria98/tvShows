import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as assets from './assets';

import './icons.styl';

const Icon = class extends Component {
  render () {
    const {
      className, type, size, small, style,
    } = this.props;
    // object containing svg attributes
    const iconTypes = {
      arrow: {
        viewBox: '0 0 37 17',
      },
      longArrow: {
        viewBox: '0 0 11 18',
      },
      wrench: {
        viewBox: '0 0 40 40',
      },
      stylus: {
        viewBox: '0 0 23 24',
      },
      star: {
        viewBox: '0 0 423 413',
      },
      search: {
        viewBox: '0 0 34 34',
      },
      check: {
        viewBox: '0 0 12 10',
      },
      basket: {
        viewBox: '0 0 19 24',
      },
      notification: {
        viewBox: '0 0 48 48',
      },
      unknown: {
        viewBox: '0 0 0 0',
      },
      gear: {
        viewBox: '0 0 29 30',
      },
      cloud: {
        viewBox: '0 0 35 32',
      },
      setup: {
        viewBox: '0 0 8 37',
      },
      checkDropDownCell: {
        viewBox: '0 0 18 18',
      },
      trash: {
        viewbox: '0 0 33 35',
      },
      plus: {
        viewBox: '0 0 36 36',
      },
      invertedPlus: {
        viewBox: '0 0 12 12',
      },
      chevron: {
        viewBox: '0 0 6 4',
      },
      chevron_listing: {
        viewBox: '0 0 6 4',
      },
      checked_row: {
        viewBox: '0 0 13 13',
      },
      filter: {
        viewBox: '0 0 12 12',
      },
      more: {
        viewBox: '0 0 11 3',
      },
      shape: {
        viewBox: '0 0 8 6',
      },
      comments: {
        viewBox: '0 0 19 17',
      },
      delta: {
        viewBox: '0 0 9 4',
      },
      trashNew: {
        viewBox: '0 0 10 12',
      },
      add: {
        viewBox: '0 0 12 12',
      },
      trendMD: {
        viewBox: '0 0 95 23',
      },
      upload: {
        viewBox: '0 0 400 400',
      },
      reload: {
        viewBox: '0 0 308 308',
      },
      dislike: {
        viewBox: '0 0 169 169',
      },
      chevronDatepicker: {
        viewBox: '0 0 5 8',
      },
      share: {
        viewBox: '0 0 38 36',
      },
      view: {
        viewBox: '0 0 30 18',
      },
      bell: {
        viewBox: '0 0 48 48',
      },
      filters: {
        viewBox: '0 0 36 36',
      },
      reset: {
        viewBox: '0 0 24 24',
      },
      filtertool: {
        viewBox: '0 0 26 26',
      },
      info: {
        viewBox: '0 0 532 532',
      },
      error: {
        viewBox: '0 0 532 532',
      },
      warning: {
        viewBox: '0 0 532 532',
      },
    };
    // create svg icon
    const icon = (
      <svg
        className={classNames(
          'icon',
          className,
          `-${type}`,
          { [`-${size}`]: size },
          { '-small': small }
        )}
        viewBox={(iconTypes[type] || iconTypes.unknown).viewBox}
        style={style}
      >
        {assets[type]}
      </svg>
    );

    return icon;
  }
};

Icon.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  small: PropTypes.bool,
  size: PropTypes.string,
  style: PropTypes.object,
};

export default Icon;
