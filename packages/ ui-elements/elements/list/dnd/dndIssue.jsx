import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import flow from 'lodash/flow';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import ListItem from '../listItem.jsx';
import Types from './itemTypes.js';

const itemSource = {
  beginDrag (props, monitor, component) {
    const { id } = props.data;

    let selected = null;
    if (props.selectedItems.some((item) => item.id === id)) {
      selected = props.selectedItems;
    }

    return {
      id,
      data: props.data,
      index: props.index,
      selected,
      group: props.group,
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

const itemTarget = {
  drop (props, monitor, component) {
    // selected issues passed from state
    const { selectedItems } = props;

    let dragIndex = monitor.getItem().index;
    let dragId = monitor.getItem().id;
    const dragGroup = monitor.getItem().group.name;

    const hoverIndex = props.index;
    const hoverId = props.data.id;
    const hoverGroup = props.group.name;

    if (dragIndex === hoverIndex || dragGroup !== hoverGroup) {
      return;
    }

    const multipleDragItems = {};
    if (selectedItems.length > 1 && selectedItems.some((item) => item.id === dragId)) {
      selectedItems.forEach((item) => {
        multipleDragItems[item.id] = item.index;
      });

      dragIndex = Object.values(multipleDragItems);
      dragId = Object.keys(multipleDragItems);
    }

    props.sortContainerCb({
      drag: {
        id: dragId,
        index: dragIndex,
      },
      hover: {
        id: hoverId,
        direction: component.state.insert,
        index: hoverIndex,
      },
    });
  },

  hover (props, monitor, component) {
    const dragItem = monitor.getItem();
    const dragIndex = dragItem.index;
    const hoverIndex = props.index;
    if (dragIndex === hoverIndex || dragItem.group.name !== props.group.name) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component)
      .getBoundingClientRect();

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

const DndIssue = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      insert: null,
    };
  }

  componentWillReceiveProps () {
    const { selected, selectedItems } = this.props;
    if (selected && selectedItems && selectedItems.length > 1) {
      this.props.connectDragPreview(getEmptyImage());
    } else {
      this.props.connectDragPreview(this.listItem);
    }

    if (this.state.insert) {
      this.setState({ insert: null });
    }
  }

  render () {
    const {
      connectDragSource,
      connectDropTarget,
      isDragging,
      item,
      itemType,
      selected,
      selectedItems,
      componentProps,
      data,
      index,
    } = this.props;
    const { insert } = this.state;

    let shouldHideElement = null;
    if (
      itemType === Types.ITEM &&
      selected &&
      selectedItems &&
      selectedItems.length > 1 &&
      item.selected
    ) {
      shouldHideElement = true;
    }

    const style = {
      opacity: isDragging || shouldHideElement ? 0 : 1,
    };

    return connectDragSource(connectDropTarget(<div
      style={style}
      className={classNames('list__dnd-item', {
        '-insert-above': insert === 'above',
        '-insert-below': insert === 'below',
      })}
      ref={(listItem = this.listItem = listItem)}
    >
      <ListItem {...componentProps} index={index} data={data} selected={selected} />
    </div>));
  }
};

DndIssue.propTypes = {
  // react-dnd specific
  connectDropTarget: PropTypes.func,
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
  isDragging: PropTypes.bool,
  isOver: PropTypes.bool,
  item: PropTypes.object,
  itemType: PropTypes.string,
  // issue
  data: PropTypes.object,
  componentProps: PropTypes.object,
  index: PropTypes.number,
  selected: PropTypes.bool,
  selectedItems: PropTypes.array,
  sortContainerCb: PropTypes.func,
};

export default flow(
  DropTarget(Types.ITEM, itemTarget, collectTarget),
  DragSource(Types.ITEM, itemSource, collectSource)
)(DndIssue);
