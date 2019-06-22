/* eslint-disable react/no-unused-prop-types */

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const Input = (props) => {
  let label = '';
  if (props.label) {
    label = <label className="form__label">{props.label}</label>;
  }

  return (
    <div className="form__group">
      {label}
      <input
        className={classNames('form__input', { '-error': props.error })}
        type={props.type || 'text'}
        name={props.name}
        onChange={props.onChange}
        onKeyUp={props.onKeyUp}
        value={props.value}
        disabled={props.disabled}
        placeholder={props.placeholder}
        required={props.required}
      />
      <p className={classNames('form__error', { '-visible': props.error })}>{props.error}</p>
    </div>
  );
};

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  initialValue: PropTypes.string,
  onChange: PropTypes.func,
  onKeyUp: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  chromeAutofillAllowed: PropTypes.bool,
};

export default Input;
