import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Label from './label.jsx';

// TODO: after migration to React 16 allow exporting labels without wrapping div (using fragments)
// use prop (e.g. exportAsFragment) or smth to that effect
// first use case -- inside DropdownLabelsEditor
const LabelsContainer = (props) => {
  const renderLabels = () => {
    const { labels, onDisable } = props;

    return labels.map((label, i) => {
      if (_.isObject(label)) {
        const { value, ...args } = label;
        if (!value) {
          console.error('Invalid label value');
        }
        return <Label key={i} {...args} value={value} valueonDisable={onDisable} />;
      }
      return <Label key={i} value={label} onDisable={onDisable} />;
    });
  };

  const renderedLabels = renderLabels();

  return (
    <div style={props.containerStyle} className="labels-container">
      {renderedLabels}
    </div>
  );
};

LabelsContainer.propTypes = {
  labels: PropTypes.array.isRequired,
  onCloseBtn: PropTypes.func,
};

LabelsContainer.defaultProps = {
  labels: [],
};

export default LabelsContainer;
