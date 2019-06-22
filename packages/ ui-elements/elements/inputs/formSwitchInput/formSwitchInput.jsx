/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React from 'react';
import classNames from 'classnames';

import './formSwitchInput.styl';

class FormSwitchInput extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      switchOpen: false,
      value: this.props.value || '',
      switched: this.props.default || 0,
    };
    this.switchWidth = 0;
    this.openSwitch = this.openSwitch.bind(this);
    this.closeSwitch = this.closeSwitch.bind(this);
    this.updateSwitch = this.updateSwitch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount () {
    this.switchWidth = this.switch.offsetWidth;
  }

  componentWillReceiveProps (nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        value: nextProps.value || '',
        switched: nextProps.default || 0,
      });
    }
  }

  openSwitch (e) {
    e.stopPropagation();
    if (this.props.disabled || this.props.switchDisabled) {
      return;
    }
    this.setState({ switchOpen: true });
    document.addEventListener('click', this.closeSwitch, false);
  }

  closeSwitch () {
    this.setState({ switchOpen: false });
    document.removeEventListener('click', this.closeSwitch, false);
  }

  updateSwitch (switched) {
    this.setState({ switched, switchOpen: false });
    const { value } = this.state;
    this.props.onChange(this.props.name, { value, switched });
  }

  handleChange (e) {
    const { value } = e.target;
    this.setState({ value });

    const { switched } = this.state;
    this.props.onChange(this.props.name, { value, switched });
  }

  render () {
    let switchOptions;
    let switchOptionsContainer;
    if (this.state.switchOpen) {
      switchOptions = this.props.options.map((item, index) => (
        <li
          key={index}
          className={classNames('options__item', `item_${index}`, {
            '--selected': index === this.state.switched,
          })}
          onClick={() => this.updateSwitch(index)}
        >
          {item}
        </li>
      ));
      switchOptionsContainer = (
        <div
          ref={(c) => {
            this.switchOptions = c;
          }}
          className="switch__options"
          style={{ minWidth: this.switchWidth }}
        >
          {switchOptions}
        </div>
      );
    }

    return (
      <div
        id={this.props.id}
        className={classNames(
          'form__element form__switchInput',
          { '--active': this.state.active },
          { '--reversed': this.props.reversed },
          this.props.className
        )}
      >
        <label>{this.props.label}</label>
        <div className="container" role="presentation" onClick={this.open}>
          <div
            ref={(c) => {
              this.switch = c;
            }}
            role="presentation"
            className={classNames(
              'input__switch',
              { '--active': this.state.switchOpen },
              { '-disabled': this.props.disabled || this.props.switchDisabled },
              this.props.className
            )}
            onClick={this.openSwitch}
          >
            {this.props.options[this.state.switched]}
            {switchOptionsContainer}
          </div>
          <input
            className="input__action"
            ref={(c) => {
              this.input = c;
            }}
            type="text"
            value={this.state.value}
            placeholder={this.props.placeholder}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            disabled={this.props.disabled}
          />
          <span className="input__hint">{this.props.hint}</span>
        </div>
      </div>
    );
  }
}

FormSwitchInput.displayName = 'FormSwitchInput';

FormSwitchInput.propTypes = {};

export default FormSwitchInput;
