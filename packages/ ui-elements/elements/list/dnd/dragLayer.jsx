import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragLayer } from 'react-dnd';

import DragMultipleIssuesPreview from './dragMultipleIssuesPreview.jsx';

function collect (monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
  };
}

const CustomDragLayer = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  // get specific coords for drag preview
  getPreivewCoords () {
    const { currentOffset } = this.props;

    if (!currentOffset) {
      return {
        display: 'none',
      };
    }

    const { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;

    return {
      transform,
      WebkitTransform: transform,
    };
  }

  render () {
    const renderPreview = (array) => {
      const topLayerStyles = {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 100,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
      };
      const customPreviewCoords = this.getPreivewCoords();
      const preview = (
        <DragMultipleIssuesPreview coords={customPreviewCoords} length={array.length} />
      );

      return <div style={topLayerStyles}>{preview}</div>;
    };

    const { isDragging, itemType, item } = this.props;
    // render specific layer, only if user is dragging element, dragged element is item (issue)
    // and user have selected more than one issue
    const shouldCreateLayer =
      isDragging && itemType === 'item' && item.selected && item.selected.length > 1;

    let customLayer = null;
    if (shouldCreateLayer) {
      customLayer = renderPreview(item.selected);
    }

    return customLayer;
  }
};

CustomDragLayer.propTypes = {
  item: PropTypes.object,
  itemType: PropTypes.string,
  isDragging: PropTypes.bool.isRequired,
  currentOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
};

export default DragLayer(collect)(CustomDragLayer);
