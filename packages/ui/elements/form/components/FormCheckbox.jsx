import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { Dispatch as dispatch } from 'meteor/meteorflux:meteorflux';
import Checkbox from '../../checkboxes/components/Checkbox';
import Classes from '../../../constants/classes';


const FormCheckbox = class extends Component {
  constructor (props) {
    super(props);
    this.check = this.check.bind(this);
  }

  check (value, name) {
    const changeProp = this.props.change;

    if (typeof changeProp === 'function') {
      changeProp(value, name);
    }
    if (!changeProp) {
      dispatch('FORM_FIELD_VALUE_CHANGE', { name, value });
    }
  }

  render () {
    if (this.props.options) {
      const checkboxes = this.props.options.map((item) => (
        <Checkbox
          id={item.name}
          key={item.name}
          label={item.text}
          name={item.name}
          checked={item.checked}
          onCheck={this.check}
          error={item.error}
        />)
      );

      let label = '';
      if (this.props.label) {
        label = <label className={classNames('form__label', { '-required': this.props.required })}>{this.props.label}</label>;
      }
      return (
        <div className={classNames('form__group form_checkbox', { [Classes.FORM_GROUP_ERROR]: this.props.error })}>
          {label}
          {checkboxes}
          <p className={classNames('form__error', { '-visible': this.props.error })}>{this.props.error}</p>
        </div>
      );
    }
    return (
      <div>
        <Checkbox
          key={this.props.name}
          label={this.props.label}
          name={this.props.name}
          checked={this.props.checked}
          onCheck={this.check}
          error={this.props.error}
          required={this.props.required}
        />
        <p className={classNames('form__error', { '-visible': this.props.error })}>{this.props.error}</p>
      </div>
    );
  }
};

FormCheckbox.displayName = 'FormCheckbox';

FormCheckbox.propTypes = {
  change: PropTypes.func,
  options: PropTypes.array,
  label: PropTypes.string,
  name: PropTypes.string,
  error: PropTypes.bool,
  checked: PropTypes.bool,
  required: PropTypes.bool,
};

export default FormCheckbox;
