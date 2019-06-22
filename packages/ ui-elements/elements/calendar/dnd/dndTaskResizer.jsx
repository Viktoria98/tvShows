import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import Types from './itemTypes.js';

const componentSource = {
  beginDrag (props, monitor, component) {
    const { task, rowId, customTaskStyles } = props;
    return {
      id: task.id,
      title: task.data.title,
      currentEndDate: task.startDate.clone()
        .add(...task.duration),
      duration: task.duration,
      startDate: task.startDate,
      rowId,
      customTaskStyles,
    };
  },
};

function collectSource (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
  };
}

const DndTaskResizer = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  preparePreview () {
    this.props.connectDragPreview(getEmptyImage());
  }

  componentWillMount () {
    this.preparePreview();
  }

  componentWillReceiveProps () {
    this.preparePreview();
  }

  render () {
    const { connectDragSource, customTaskStyles } = this.props;
    return connectDragSource(<div>
      <div className="calendar__task-resizer" />
    </div>);
  }
};

DndTaskResizer.propTypes = {
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
  task: PropTypes.object,
  customTaskStyles: PropTypes.object,
};

export default DragSource(Types.RESIZE_HANDLE, componentSource, collectSource)(DndTaskResizer);
