import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragLayer } from 'react-dnd';

import TaskPreview from '../taskDragPreview.jsx';

import Types from './itemTypes.js';

function collect (monitor) {
  return {
    itemType: monitor.getItemType(),
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getClientOffset(),
    sourceOffset: monitor.getInitialSourceClientOffset(),
  };
}

const CustomDragLayer = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};

    (this.bodyScrollLeft = props.scrollLeft),
    (this.overlayStyles = {
      [Types.RESIZE_HANDLE]: {
        position: 'absolute',
      },
      [Types.TASK]: {
        position: 'fixed',
      },
    });
  }

  // get specific coords for drag preview
  getPreivewCoords (type) {
    const {
      currentOffset, sourceOffset, scrollLeft, item,
    } = this.props;

    if (!currentOffset) {
      return {
        display: 'none',
      };
    }

    switch (type) {
      case Types.TASK:
        const handleOffset = 50;
        return {
          transform: `translate(${currentOffset.x - handleOffset}px, ${currentOffset.y}px)`,
          ...item.customTaskStyles,
        };

      case Types.RESIZE_HANDLE:
        const bodyMarginTop = 90;
        const taskTopOffset = 20;
        const bodyMarginLeft = 150;
        const taskLeftOffset = 6;
        return {
          position: 'absolute',
          top: sourceOffset.y - bodyMarginTop - taskTopOffset,
          left: this.bodyScrollLeft + sourceOffset.x - bodyMarginLeft - taskLeftOffset,
          width:
            currentOffset.x - sourceOffset.x + 20 + (this.props.scrollLeft - this.bodyScrollLeft),
          ...item.customTaskStyles,
        };

      default:
        return {};
    }
  }

  render () {
    const renderPreview = (type) => {
      const topLayerStyles = {
        pointerEvents: 'none',
        zIndex: 100,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        ...this.overlayStyles[type],
      };
      const customPreviewCoords = this.getPreivewCoords(type);
      const title = this.props.item.title;
      const preview = <TaskPreview text={title} coords={customPreviewCoords} />;

      return (
        <div className="calendar__drag-layer" style={topLayerStyles}>
          {preview}
        </div>
      );
    };

    const { isDragging, itemType, scrollLeft } = this.props;
    const allowedTypes = [Types.TASK, Types.RESIZE_HANDLE];

    if (!isDragging) {
      this.bodyScrollLeft = scrollLeft;
    }

    const shouldCreateLayer = isDragging && allowedTypes.includes(itemType);
    return shouldCreateLayer ? renderPreview(itemType) : null;
  }
};

CustomDragLayer.propTypes = {
  item: PropTypes.object,
  itemType: PropTypes.string,
  isDragging: PropTypes.bool.isRequired,
  scrollLeft: PropTypes.number,
  currentOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  sourceOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
};

export default DragLayer(collect)(CustomDragLayer);
