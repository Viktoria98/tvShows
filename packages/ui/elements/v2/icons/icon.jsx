import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import assets from './assets';

const Icon = class extends Component {

  render () {
    // object containing svg attributes
    const iconTypes = {
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
        viewBox: '0 0 42 41',
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
    // form svg icon
    const icon = (
      <svg
        className={classNames(
            'icon',
            this.props.className,
            `-${this.props.type}`,
            { [`-${this.props.size}`]: this.props.size },
            { '-small': this.props.small }
        )}
        viewBox={(iconTypes[this.props.type] || iconTypes.unknown).viewBox}
      >
        {assets[this.props.type]}
      </svg>);

    return icon;
  }
};

Icon.displayName = 'Icon';

Icon.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  small: PropTypes.bool,
  size: PropTypes.string,
};

export default Icon;
