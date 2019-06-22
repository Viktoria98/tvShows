import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Dispatch as dispatch } from 'meteor/meteorflux:meteorflux';

export default class FormTextarea extends Component {
  constructor (props) {
    super(props);
    this.change = this.change.bind(this);
    this.state = {
      value: this.props.initialValue,
    };
  }

  componentWillReceiveProps (props) {
    if (this.props.value !== props.initialValue) {
      this.setState({ value: props.initialValue });
    }
  }

  change (event) {
    this.setState({
      value: event.target.value,
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

  render () {
    let label = '';
    if (this.props.label) {
      label = (
        <label
          className="form__label"
        >
          {this.props.label}
        </label>
      );
    }
    /*
      {this.state.value or ''} - condition in textarea value related with this bug
      https://github.com/facebook/react/issues/2533
    */
    return (
      <div
        id={this.props.id}
        className="form__group"
      >
        {label}
        <textarea
          className={classNames('form__input', {
            '-error': this.props.error,
          })}
          name={this.props.name}
          onChange={this.change}
          disabled={this.props.disabled}
          value={this.state.value || ''}
        />
        <p
          className={classNames('form__error', {
            '-visible': this.props.error,
          })}
        >
          {this.props.error}
        </p>
      </div>
    );
  }

}

FormTextarea.displayName = 'FormTextarea';

FormTextarea.propTypes = {
  initialValue: PropTypes.string,
  value: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  disabled: PropTypes.bool,
  change: PropTypes.func,
};
