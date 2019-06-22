import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Icon from '../icons/icon';

/* eslint-disable react/prop-types */

const Checkbox = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      focused: false,
    };
    this.check = this.check.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
  }

  check (event) {
    event.stopPropagation();
    this.props.onCheck(this.props.name);
  }

  focus () {
    this.setState({ focused: true });
  }

  blur () {
    this.setState({ focused: false });
  }

  render () {
    let label;
    let check;
    if (this.props.label) {
      label = <span className="checkbox__label">{this.props.label}</span>;
    }
    if (this.props.checked) {
      check = <Icon type="check" className="checkbox__check" />;
    }
    return (
      <div
        className={classNames('checkbox', { '-error': this.props.error }, { 'checkbox--selectAll-partial': this.props.partialChecked })}
        onClick={this.check}
      >
        <input
          className="checkbox__input"
          type="checkbox"
          onFocus={this.focus}
          onBlur={this.blur}
        />
        <div className={classNames('checkbox__box', { '-focused': this.state.focused })}>
          {check}
        </div>
        {label}
      </div>
    );
  }
};

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
  error: PropTypes.bool,
  checked: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onCheck: PropTypes.func,
};

export default Checkbox;
