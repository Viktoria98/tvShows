import React from 'react';
import PropTypes from 'prop-types';

const DragMultipleIssuesPreview = (props) => (
  <div className="drag-layer__preview" style={props.coords}>
    Dragging {props.length} issues
  </div>
);

DragMultipleIssuesPreview.propTypes = {
  coords: PropTypes.object.isRequired,
  length: PropTypes.number,
};

export default DragMultipleIssuesPreview;
