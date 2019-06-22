import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import Task from '../task.jsx';

import Types from './itemTypes.js';

const taskSource = {
  beginDrag (props, monitor, component) {
    const { task, customTaskStyles } = props.componentProps;
    return {
      id: task.id,
      title: task.data.title,
      assignee: task.assignee,
      customTaskStyles,
    };
  },
};

function collectSource (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
  };
}

const DndCalendarTask = class extends Component {
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
    const {
      connectDragSource, componentProps, isDragging, item, itemType,
    } = this.props;
    const taskIsDraggedByHandle =
      itemType === Types.RESIZE_HANDLE && componentProps.task.id === item.id;
    return connectDragSource(<div>
      <Task {...componentProps} fade={isDragging || taskIsDraggedByHandle} />
    </div>);
  }
};

DndCalendarTask.propTypes = {
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
  item: PropTypes.object,
  itemType: PropTypes.string,
  isDragging: PropTypes.bool,
  componentProps: PropTypes.object,
};

export default DragSource(Types.TASK, taskSource, collectSource)(DndCalendarTask);
