import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { Dispatch as dispatch } from 'meteor/meteorflux:meteorflux';
import Classes from '../../../constants/classes';

const FormTextfield = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value: props.value || '',
      readonly: true,
      error: false,
    };
    this.keyUp = this.keyUp.bind(this);
    this.change = this.change.bind(this);
    this.toggleReadonly = this.toggleReadonly.bind(this);
    this.checkReadonly = this.checkReadonly.bind(this);
  }

  componentWillReceiveProps (props) {
    if (this.state.value !== props.value) {
      this.setState({ value: props.value || '' });
    }
    if (props.error) {
      this.setState({
        error: true,
      });
    } else {
      this.setState({
        error: false,
      });
    }
  }

  keyUp (event) {
    if (event.keyCode === 13) {
      if (typeof this.props.onEnter === 'function') {
        this.props.onEnter(this.state.value);
      }
    }
  }

  change (event) {
    this.setState({
      value: event.target.value,
      error: false,
    }, () => {
      const changeProp = this.props.change;

      if (typeof changeProp === 'function') {
        changeProp(this.state.value, this.props.name);
      }
      if (!this.props.change) {
        dispatch('FORM_FIELD_VALUE_CHANGE', {
          name: this.props.name,
          value: this.state.value,
        });
      }
    });
  }

  toggleReadonly () {
    if (!this.props.chromeAutofillAllowed) {
      // hack to prevent chrome from autofilling inputs
      if (this.state.readonly) {
        this.setState({ readonly: false });
      } else {
        this.setState({ readonly: true });
      }
    }
  }

  checkReadonly () {
    return this.props.chromeAutofillAllowed ? false : this.state.readonly;
  }

  render () {
    let label = '';
    let autofill = 'on';
    let hint = '';

    if (this.props.noAutofill) {
      autofill = 'off';
    }

    if (this.props.label) {
      label = <label className={classNames('form__label', { '-required': this.props.required })}>{this.props.label}</label>;
    }

    if (this.props.hint) { // eslint-disable-line
      let hintPosition = 'right';
      if (this.props.hintPosition && this.props.hintPosition === 'left') { // eslint-disable-line
        hintPosition = 'left';
      }
      hint = (
        <p className={classNames('form__input__hint', hintPosition)}>
          {this.props.hint}
        </p>
      );
    }

    return (
      <div id={this.props.id} className={classNames('form__group', { [Classes.FORM_GROUP_ERROR]: this.props.error })}>
        {label}
        <input
          ref="input"
          className={classNames('form__input', { '-error': this.state.error })}
          type={this.props.type || 'text'}
          name={this.props.name}
          onKeyUp={this.keyUp}
          onChange={this.change}
          value={this.state.value}
          disabled={this.props.disabled}
          placeholder={this.props.placeholder}
          required={this.props.required}
          readOnly={this.checkReadoy}
          onFocus={this.toggleReadonly}
          onBlur={this.toggleReadonly}
          autoComplete={autofill}
        />
        <p className={classNames('form__error', { '-visible': this.state.error })}>{this.props.error}</p>
        {hint}
      </div>
    );
  }
};

FormTextfield.displayName = 'FormTextfield';

FormTextfield.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  label: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  initialValue: PropTypes.string, // eslint-disable-line
  onEnter: PropTypes.func,
  change: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  noAutofill: PropTypes.bool,
  chromeAutofillAllowed: PropTypes.bool,
};

export default FormTextfield;
