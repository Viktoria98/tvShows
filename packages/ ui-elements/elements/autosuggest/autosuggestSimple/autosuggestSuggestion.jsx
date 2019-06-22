import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const AutosuggestSuggestion = (props) => {
  const onClick = () => {
    const { callback, value } = props;
    return callback(value);
  };

  return (
    <div
      className={classNames('autosuggest-simple__suggestion', {
        '-hovered': props.hovered,
      })}
      onClick={onClick}
    >
      {props.text}
    </div>
  );
};

AutosuggestSuggestion.propTypes = {
  callback: PropTypes.func,
  text: PropTypes.string,
  value: PropTypes.string,
};

export default AutosuggestSuggestion;
