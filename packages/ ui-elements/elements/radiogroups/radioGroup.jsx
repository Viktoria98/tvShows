import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RadioItem from './radioItem.jsx';

import './radiogroups.styl';

const RadioGroup = (props) => {
  const options = props.options.map((option, i) => (
    <RadioItem
      key={i}
      name={props.name}
      value={option.value}
      onChange={props.onChange}
      text={option.text}
      disabled={option.disabled}
      selected={props.selected}
    />
  ));

  return (
    <div className="form__group">
      <label className={classNames('form__label', { hidden: !props.label })}>{props.label}</label>
      <div
        className={classNames(
          'radio__group',
          {
            /* '-justified': !props.minified, */
          },
          { '-error': props.error }
        )}
      >
        {options}
      </div>
      <p className={classNames('form__error', { '-visible': props.error })}>{props.error}</p>
    </div>
  );
};

RadioGroup.propTypes = {
  options: PropTypes.array,
  minified: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  value: PropTypes.string,
  onChange: PropTypes.func,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default RadioGroup;
