import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './switches.styl';

const Switch = class extends Component {
  constructor (props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle () {
    this.props.callback(this.props);
  }

  render () {
    let labelContent;
    if (this.props.label) {
      labelContent = this.props.label;
    } else {
      labelContent = this.props.children;
    }
    return (
      <div
        className={classNames('switch__container', {
          '-enabled': this.props.enabled,
        })}
      >
        <div className="switch__toggler" onClick={this.toggle}>
          <div className="switch__button" />
        </div>
        <span className="switch__label">{labelContent}</span>
      </div>
    );
  }
};

Switch.propTypes = {
  enabled: PropTypes.bool,
  label: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.element]),
  callback: PropTypes.func,
  name: PropTypes.string,
};

export default Switch;
