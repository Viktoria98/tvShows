import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { Dispatch as dispatch } from 'meteor/meteorflux:meteorflux';
import Dropdown from '../../dropdowns/components/Dropdown';

const FormDropdown = class extends Component {
  constructor (props) {
    super(props);
    this.change = this.change.bind(this);
  }

  change (value) {
    if (this.props.change && typeof this.props.change === 'function') {
      this.props.change(value, this.props.name);
    } else {
      dispatch('FORM_FIELD_VALUE_CHANGE', {
        name: this.props.name,
        value,
      });
    }
  }

  render () {
    return (
      <div className="form__group">
        <label className={classNames('form__label', { '-required': this.props.required })}>{this.props.label}</label>
        <Dropdown
          id={this.props.id}
          onChange={this.change}
          options={this.props.options}
          placeholder={this.props.placeholder}
          value={this.props.value}
          disabled={this.props.disabled}
          error={this.props.error}
          resetState={this.props.resetState}
          text={this.props.text}
        />
        <p className={classNames('form__error', { '-visible': this.props.error })}>{this.props.error}</p>
      </div>
    );
  }
};

FormDropdown.displayName = 'FormDropdown';

FormDropdown.propTypes = {
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  resetState: PropTypes.bool,
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  text: PropTypes.string,
  change: PropTypes.func,
  required: PropTypes.bool,
};

export default FormDropdown;
