/* eslint-disable react/no-unused-prop-types */

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const Textarea = (props) => {
  let label = '';
  if (props.label) {
    label = <label className="form__label">{props.label}</label>;
  }

  return (
    <div className="form__group">
      {label}
      <textarea
        className={classNames('form__input', { '-error': props.error })}
        name={props.name}
        onChange={props.onChange}
        disabled={props.disabled}
        value={props.value}
      />
      <p className={classNames('form__error', { '-visible': props.error })}>{props.error}</p>
    </div>
  );
};

Textarea.displayName = 'Textarea';

Textarea.propTypes = {
  initialValue: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default Textarea;
