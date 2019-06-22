import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

const Labels = (props) => {
  const renderLabels = (labels = []) => {
    if (!_.isArray(labels)) {
      console.error('Invalid data type');
      labels = [];
    }

    const labelsArray = [];
    labels.forEach((label, key) => {
      if (typeof label === 'string') {
        labelsArray.push(<span key={key} className="tag">
          {label}
        </span>);
      } else if (typeof label === 'object') {
        labelsArray.push(<span key={key} className={`tag ${label.color}`}>
          {label.value}
        </span>);
      }
    });
    return labelsArray;
  };

  return <div className="tag__holder">{renderLabels(props.labels)}</div>;
};

Labels.propTypes = {
  labels: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default Labels;
