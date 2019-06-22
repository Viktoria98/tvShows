import PropTypes from 'prop-types';
import React, { Component } from 'react';
import difference from 'lodash';
import classNames from 'classnames';
import { Dispatch as dispatch } from 'meteor/meteorflux:meteorflux';
import MultiSelectDropdown from '../../dropdowns/components/MultiSelectDropdown';

const FormMultipleDropdown = class extends Component {
  constructor (props) {
    super(props);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.clickAll = this.clickAll.bind(this);
  }

  add (name, value) {
    if (!this.selected[name]) {
      this.selected[name] = [];
    }
    this.selected[name].push(value);
    dispatch('FORM_FIELD_VALUE_CHANGE', {
      name,
      value: this.selected[name],
    });
  }

  remove (name, value) {
    this.selected[name] = difference(this.selected[name], value);
    dispatch('FORM_FIELD_VALUE_CHANGE', {
      name,
      value: this.selected[name],
    });
  }

  clickAll () {
    // todo
    return true;
  }

  render () {
    return (
      <div className="form__group">
        <label className="form__label">{this.props.label}</label>
        <MultiSelectDropdown
          label={this.props.placeholder}
          options={this.props.options}
          add={this.add}
          remove={this.remove}
          error={this.props.error}
        />
        <p className={classNames('form__error', { '-visible': this.props.error })}>{this.props.error}</p>
      </div>
    );
  }
};

FormMultipleDropdown.displayName = 'FormMultipleDropdown';

FormMultipleDropdown.selected = {};

FormMultipleDropdown.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  error: PropTypes.string,
};

export default FormMultipleDropdown;
