import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const RadioItem = (props) => {
  const onClick = () => {
    if (!props.disabled && props.selected !== props.value) {
      props.onChange(props);
    }
  };

  return (
    <label
      className={classNames({
        '-disabled': props.disabled,
        '-selected': props.selected === props.value,
      })}
    >
      <input
        type="radio"
        name={props.name}
        value={props.value}
        autoComplete="off"
        onChange={onClick}
      />
      <span className="radio-item">
        <strong className="radio-item__width-placeholder">{props.text}</strong>
        <i className="radio-item__text">{props.text}</i>
      </span>
    </label>
  );
};

RadioItem.propTypes = {
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
  name: PropTypes.string,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default RadioItem;
