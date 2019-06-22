import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './input.styl';

const Input = (props) => {
  let label = '';
  if (props.label || props.required) {
    label = (
      <label className={classNames('form__label', { '-required': props.required })}>
        {props.label}
      </label>
    );
  }

  const onKeyUp = (event) => {
    if (event.keyCode === 13 && typeof props.onEnter === 'function') {
      props.onEnter(event.target.value);
    }
  };

  return (
    <div id={props.id} className="form__group">
      {label}
      <input
        className={classNames('form__input', { '-error': props.error })}
        type={props.type || 'text'}
        name={props.name}
        onChange={props.onChange}
        onKeyUp={onKeyUp}
        value={props.value}
        disabled={props.disabled}
        placeholder={props.placeholder}
        required={props.required}
        autoComplete={props.autoComplete}
      />
      <p className={classNames('form__error', { '-visible': props.error })}>{props.error}</p>
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  initialValue: PropTypes.string,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  chromeAutofillAllowed: PropTypes.bool,
  autoComplete: PropTypes.string,
};

export default Input;
