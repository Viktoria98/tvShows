/* eslint-disable react/prop-types */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

const IconSwitch = class extends Component {
  constructor (props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle () {
    this.props.callback(this.props);
  }

  render () {
    const icon = (this.props.enabled) ? this.props.checkedIcon : this.props.uncheckedIcon;
    return (
      <div
        onClick={this.toggle}
        title={this.props.title}
        className={classNames(
        'switch__icon',
        this.props.className,
        { '-enabled': this.props.enabled }
      )}
      >
        {icon}
        <span className="switch__label">{this.props.label}</span>
      </div>);
  }
};

IconSwitch.displayName = 'IconSwitch';

IconSwitch.propTypes = {
  enabled: PropTypes.bool,
  callback: PropTypes.func,
  label: PropTypes.string,
  uncheckedIcon: PropTypes.element,
  checkedIcon: PropTypes.element,
};

export default IconSwitch;
