/* eslint-disable react/no-unused-prop-types */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

const Switch = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isChecked: this.props.enabled,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle () {
    this.props.callback(this.props);
    this._handleChange();
  }

  _handleChange () {
    this.setState({ isChecked: !this.state.isChecked });
  }

  render () {
    let labelContent;
    if (this.props.label) {
      labelContent = this.props.label;
    } else {
      labelContent = this.props.children;
    }
    return (
      <div className={classNames('switch__container', { '-enabled': this.state.isChecked, '-small': this.props.small })}>
        <div className="switch__toggler" onClick={this.toggle}>
          <div className="switch__button" />
        </div>
        <span className="switch__label">{labelContent}</span>
      </div>);
  }
};

Switch.displayName = 'Switch';

Switch.propTypes = {
  enabled: PropTypes.bool,
  label: PropTypes.string,
  small: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.element,
  ]),
  callback: PropTypes.func,
  name: PropTypes.string,
};

export default Switch;
