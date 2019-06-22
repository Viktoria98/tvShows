import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { Dispatch as dispatch } from 'meteor/meteorflux:meteorflux';

class FormRadioGroup extends Component {
  constructor (props) {
    super(props);
    this.change = this.change.bind(this);
    this.state = {
      value: props.value,
    };
  }

  componentWillReceiveProps (props) {
    this.setState({ value: props.value });
  }

  change (event) {
    this.setState({
      value: $(event.target)
        .val(),
    }, () => {
      dispatch('FORM_FIELD_VALUE_CHANGE', {
        name: this.props.name,
        value: this.state.value,
      });
    });
  }

  render () {
    const options = this.props.options.map((option, i) => (
      <label key={i}>
        <input
          type="radio"
          checked={option.value === this.state.value}
          name={this.props.name}
          value={option.value}
          autoComplete="off"
          onChange={this.change}
        />
        <span>{option.text}</span>
      </label>)
    );
    return (
      <div className="form__group">
        <label className={classNames('form__label', { hidden: !this.props.label })}>{this.props.label}</label>
        <div className={classNames('radio__group', { '-justified': !this.props.minified, '-error': this.props.error })}>
          {options}
        </div>
        <p className={classNames('form__error', { '-visible': this.props.error })}>{this.props.error}</p>
      </div>
    );
  }
}

FormRadioGroup.displayName = 'FormRadioGroup';

FormRadioGroup.propTypes = {
  options: PropTypes.array,
  minified: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  error: PropTypes.string,
  value: PropTypes.string,
};

export default FormRadioGroup;
