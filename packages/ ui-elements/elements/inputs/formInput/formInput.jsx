/* eslint-disable react/prop-types */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './formInput.styl';

class FormInput extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      value: props.value || '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props !== nextProps) {
      this.setState({ value: nextProps.value || '' });
    }
  }

  handleChange (event) {
    this.setState(
      {
        value: event.target.value,
      },
      () => {
        this.props.onChange(this.props.name, this.state.value);
      }
    );
  }

  render () {
    return (
      <div
        id={this.props.id}
        className={classNames('form__element form__input_new', this.props.className, {
          '-disabled': this.props.disabled,
        })}
      >
        <label>{this.props.label}</label>
        <div className="container" onClick={this.open} style={{ width: this.props.width }}>
          <input
            ref="input"
            type="text"
            placeholder={this.props.placeholder}
            onChange={this.handleChange}
            value={this.state.value}
            defaultValue={this.props.value}
            disabled={this.props.disabled}
            className={this.props.disabledStyle}
          />
          <span className="input__hint">{this.props.hint}</span>
        </div>
      </div>
    );
  }
}

FormInput.displayName = 'FormInput';

FormInput.propTypes = {
  disabledStyle: PropTypes.string,
};

export default FormInput;
