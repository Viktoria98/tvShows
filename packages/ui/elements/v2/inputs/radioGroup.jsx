/* eslint-disable react/no-unused-prop-types */

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const RadioGroup = (props) => {
  const options = props.options.map((option, i) =>
    (<RadioItem
      key={i}
      name={props.name}
      value={option.value}
      onChange={props.onChange}
      text={option.text}
      disabled={option.disabled}
      selected={props.selected}
    />)
  );

  return (
    <div className="form__group">
      <label className={classNames('form__label', { hidden: !props.label })}>{props.label}</label>
      <div
        className={classNames('radio__group',
                              { /* '-justified': !props.minified, */ },
                              { '-error': props.error })}
      >
        {options}
      </div>
      <p className={classNames('form__error', { '-visible': props.error })}>{props.error}</p>
    </div>
  );
};

const RadioItem = (props) => {
  const onClick = () => {
    if (!props.disabled && props.selected !== props.value) {
      props.onChange(props);
    }
  };
  return (
    <label className={classNames({ '-disabled': props.disabled, '-selected': props.selected === props.value })}>
      <input
        type="radio"
        name={props.name}
        value={props.value}
        autoComplete="off"
        onClick={onClick}
      />
      <span className="radio-item">
        <strong className="radio-item__width-placeholder">{props.text}</strong>
        <i className="radio-item__text">{props.text}</i>
      </span>
    </label>
  );
};

RadioItem.displayName = 'RadioItem';

RadioItem.propTypes = {
  selected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  value: PropTypes.string,
  name: PropTypes.string,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

RadioGroup.displayName = 'RadioGroup';
RadioGroup.propTypes = {
  options: PropTypes.array,
  minified: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  value: PropTypes.string,
  onChange: PropTypes.func,
  selected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default RadioGroup;
