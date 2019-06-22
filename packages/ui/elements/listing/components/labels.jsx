import PropTypes from 'prop-types';
import React from 'react';

export default function labels (props) {
  return (
    <div className="labels__holder">
      {renderLabels(props.labels)}
    </div>
  );
}

labels.displayName = 'Labels';

labels.propTypes = {
  labels: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

function renderLabels (labelsList) {
  return labelsList
    .map((label, key) => {
      if (typeof label === 'string') {
        return (
          <span
            key={key}
            className="label"
          >
            {label}
          </span>
        );
      }

      if (typeof label === 'object') {
        return (
          <span
            key={key}
            className={`label ${label.color}`}
          >
            {label.name}
          </span>
        );
      }

      return '';
    });
}
