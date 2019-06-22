import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './field.styl';

const Field = (props) => {
  const label =
    props.label || props.required ? (
      <label className={classNames('field__label', { '-required': props.required })}>
        {props.label}
      </label>
    ) : (
      ''
    );
  const error = props.error ? <p className="field__error">{props.error}</p> : '';

  return (
    <div id={props.id} className={classNames('field', { '-error': props.error }, props.className)}>
      {label}
      {props.children}
      {error}
    </div>
  );
};

Field.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  required: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.element]).isRequired,
};

export default Field;
