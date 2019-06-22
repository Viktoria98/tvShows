import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

import Block from '../block.jsx';

import Types from './itemTypes.js';

const componentTarget = {
  drop (props, monitor, component) {
    const { date, assignee } = props.componentProps;
    const item = monitor.getItem();
    const itemType = monitor.getItemType();

    switch (itemType) {
      case Types.TASK:
        const args = {
          id: item.id,
          startDate: date,
        };

        if (item.assignee === assignee.id) {
          return props.dropCb(args);
        }
        return props.dropCb({
          ...args,
          assignee: assignee.id,
          previousAssignee: item.assignee,
        });

      case Types.RESIZE_HANDLE:
        let difference = Math.round(date.diff(item.currentEndDate, 'days', true));

        if (difference === 0) {
          return;
        } // dropped on same day, duration won't change

        difference = item.duration[0] + difference;
        return props.dropCb({
          id: item.id,
          duration: [difference, 'day'],
        });

      default:
    }
  },

  canDrop (props, monitor, component) {
    if (!props.checkBlockAvalability(props.id)) {
      return;
    } // user is trying to drop on block that is fulley loaded

    const itemType = monitor.getItemType();

    if (itemType === Types.RESIZE_HANDLE) {
      const item = monitor.getItem();
      const { date } = props.componentProps;

      if (
        item.rowId !== props.rowId || // user is hovering over different row
        date.isBefore(item.startDate) // user is hovering over block that placed is before startDate
      ) {
        return false;
      }
    }

    return true;
  },
};

function collectTarget (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}

const DndCalendarBlock = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const {
      connectDropTarget, componentProps, isOver, canDrop,
    } = this.props;
    return connectDropTarget(<div>
      <Block {...componentProps} highlight={isOver && canDrop} />
    </div>);
  }
};

DndCalendarBlock.propTypes = {
  connectDropTarget: PropTypes.func,
  componentProps: PropTypes.object,
  dropCb: PropTypes.func,
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
  rowId: PropTypes.string,
};

export default DropTarget([Types.TASK, Types.RESIZE_HANDLE], componentTarget, collectTarget)(DndCalendarBlock);
