import React, { Component } from 'react';
import PropTypes from 'prop-types';
import flow from 'lodash/flow';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import _ from 'lodash';

import Types from './itemTypes.js';

import Card from '../kanbanCard.jsx';

const itemSource = {
  beginDrag (props, monitor, component) {
    return {
      id: props.componentProps.item.id,
      index: props.index,
      category: props.category,
      data: props.componentProps.item,
    };
  },
};

function collectSource (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
  };
}

const itemTarget = {
  drop (props, monitor, component) {
    const item = monitor.getItem();
    const dragIndex = item.index;
    const dragId = item.id;

    const hoverIndex = props.index;
    const hoverId = props.componentProps.item.id;

    const args = {
      drag: {
        id: dragId,
        index: dragIndex,
      },
      hover: {
        id: hoverId,
        direction: component.state.insert,
        index: hoverIndex,
      },
    };

    if (props.category === item.category) {
      if (dragIndex !== hoverIndex) {
        props.sortContainerCb(args);
      }
    } else {
      props.sortContainerCb({
        ...args,
        itemIntruder: item.data,
      });
      props.editCb({
        id: item.id,
        newOverrides: {
          [props.target.field]: props.category,
        },
        oldOverrides: {
          [props.target.field]: item.category,
        },
      });
    }
  },

  hover (props, monitor, component) {
    const dragItem = monitor.getItem();
    const dragIndex = dragItem.index;
    const hoverIndex = props.index;
    if (dragIndex === hoverIndex && dragItem.category === props.category) {
      return;
    }

    // Determine rectangle on screen
    const node = findDOMNode(component)
      .querySelector('.kanban-card');
    const hoverBoundingRect = node.getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    if (hoverMiddleY < hoverClientY) {
      return component.setState({ insert: 'below' });
    }
    if (hoverMiddleY > hoverClientY) {
      return component.setState({ insert: 'above' });
    }
  },
};

function collectTarget (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

const DndKanbanCard = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      insert: null,
    };
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.isOver && !nextProps.isOver && this.state.insert) {
      this.setState({ insert: null });
    }
  }

  render () {
    const {
      connectDragSource,
      connectDropTarget,
      componentProps,
      isDragging,
      isOver,
      item,
      index,
      category,
    } = this.props;
    const { insert } = this.state;

    const style = {
      opacity: isDragging ? 0 : 1,
    };

    const draggedItemId = item && item.id;
    const draggedItemIndex = item && item.index;
    const draggedItemCategory = item && item.category;
    const isSameCategory = draggedItemCategory === category;

    const aboveItemIsSelf = isSameCategory && draggedItemIndex === index - 1;
    const belowItemIsSelf = isSameCategory && draggedItemIndex === index + 1;

    const renderPlaceholderAbove = isOver && !aboveItemIsSelf && insert === 'above';
    const renderPlaceholderBelow = isOver && !belowItemIsSelf && insert === 'below';

    const placeholder = <div key="placeholder" className="dnd-kanban-card__placeholder" />;

    return connectDragSource(connectDropTarget(<div style={style} className="dnd-kanban-card">
      {renderPlaceholderAbove && placeholder}
      <Card {...componentProps} />
      {renderPlaceholderBelow && placeholder}
    </div>));
  }
};

DndKanbanCard.propTypes = {
  connectDropTarget: PropTypes.func,
  connectDragSource: PropTypes.func,
  componentProps: PropTypes.object,
  category: PropTypes.string,
  editCb: PropTypes.func,
  index: PropTypes.number,
  isDragging: PropTypes.bool,
  isOver: PropTypes.bool,
  item: PropTypes.object,
  sortContainerCb: PropTypes.func,
  target: PropTypes.object,
};

export default flow(
  DropTarget(Types.CARD, itemTarget, collectTarget),
  DragSource(Types.CARD, itemSource, collectSource)
)(DndKanbanCard);
