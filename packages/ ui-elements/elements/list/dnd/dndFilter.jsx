import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { DropTarget, DragSource } from 'react-dnd';
import flow from 'lodash/flow';
import classNames from 'classnames';
import _ from 'lodash';

import Types from './itemTypes.js';

/** HELPERS */
function checkIfFilterDropIsAllowed (args) {
  const {
    allowedGroups, type, value, returnConfig,
  } = args;
  const config = _.get(allowedGroups, `${type}_${value}`);
  // return config object or bool (config is present == true, else == false)
  return returnConfig ? config : !!config;
}

// DragSource logic
const filterSource = {
  beginDrag (props, monitor, component) {
    return {
      ...props.filter,
      index: props.index,
      group: props.group.name,
      groupType: props.group.type,
      dropAllowedIn: props.group.dropAllowedIn,
      parentFilterValue: props.parentFilter && props.parentFilter.value,
    };
  },

  canDrag (props, monitor) {
    return props.group.dragAndDrop;
  },
};

function collectSource (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    itemType: monitor.getItemType(),
    canDrag: monitor.canDrag(),
  };
}

// DropTarget logic
const filterTarget = {
  hover (props, monitor, component) {
    const itemType = monitor.getItemType();
    const group = monitor.getItem().group;
    if (itemType === Types.FILTER && props.group.name === group) {
      const dragIndex = monitor.getItem().index;
      const hoverIndex = props.index;

      if (dragIndex === hoverIndex) {
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
      } else if (hoverMiddleY > hoverClientY) {
        return component.setState({ insert: 'above' });
      }
    }
  },

  drop (props, monitor, component) {
    // invoke callback responsible for issue update
    function handleIssueDrop () {
      // react dnd doesn't provide stop propagation, hence we need to check and stop it manually
      if (monitor.didDrop()) {
        return;
      }
      callbacks.dropOn({
        ...item,
        value: filter.value,
        text: filter.text,
        group: group.type,
        parent: props.parentFilter,
      });
    }

    // invoke callback responsible for filter change/update (i.e. suspend project/close milestone/etc)
    function handleFilterDrop () {
      const item = monitor.getItem();
      const { filter, group } = props;
      props.callbacks.update({
        filter: {
          id: item.id,
          group: item.groupType,
          value: item.value,
        },
        config: checkIfFilterDropIsAllowed({
          allowedGroups: item.dropAllowedIn,
          type: group.type,
          value: filter.value,
          returnConfig: true,
        }),
      });
    }

    // handle changing filter position via drag-and-drop
    function moveFilter () {
      const dragIndex = monitor.getItem().index;
      const dragID = monitor.getItem().id;
      const hoverIndex = props.index;
      const hoverID = filter.id;

      // if we are hovering over the same item
      if (dragIndex === hoverIndex) {
        return;
      }

      // move card on client
      props.sortContainerCb({
        drag: {
          id: dragID,
          index: dragIndex,
        },
        hover: {
          id: hoverID,
          index: hoverIndex,
          direction: component.state.insert,
        },
      });
    }

    const { callbacks, filter, group } = props;
    const itemType = monitor.getItemType();
    const item = monitor.getItem();

    switch (itemType) {
      case Types.ITEM:
        handleIssueDrop();
        break;

      case Types.FILTER:
        if (item.group === group.name) {
          moveFilter();
        } else {
          handleFilterDrop();
        }
        break;
    }
  },

  canDrop (props, monitor) {
    const { group, filter, componentProps } = props; // props of the hovered filter
    const itemType = monitor.getItemType();

    if (itemType === Types.ITEM && !group.disableIssueDrop && !group.notActive) {
      const active = filter.value === componentProps.selected.value;
      return !active;
    } else if (itemType === Types.FILTER) {
      const dragItem = monitor.getItem(); // dragged filter

      // find if dragged filter is over allowed filter

      const allowedDrop = checkIfFilterDropIsAllowed({
        allowedGroups: dragItem.dropAllowedIn,
        type: group.type,
        value: filter.value,
      });
      if (allowedDrop) {
        return allowedDrop;
      }

      return dragItem.group === group.name;
    }
  },
};

function collectTarget (connect, monitor) {
  const canDrop = monitor.canDrop();
  const isOver = monitor.isOver({ shallow: true });
  const itemType = monitor.getItemType();
  const item = monitor.getItem();

  // TODO: check if we need isOver and canDrop passing inside component
  return {
    connectDropTarget: connect.dropTarget(),
    isOver,
    canDrop,
    item,
    // item (issue) is hovered over filter
    receiveReady: isOver && canDrop,
    // filter is hovered over another filter
    filterIsOver: isOver && itemType === Types.FILTER, // not used?
  };
}

const DndFilter = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      insert: null, // TODO: change to smth more meaningfull
    };
  }

  componentWillReceiveProps () {
    if (this.state.insert) {
      this.setState({ insert: null });
    }
  }

  render () {
    const {
      connectDropTarget,
      connectDragSource,
      isOver,
      canDrop,
      component,
      componentProps,
      filterIsOver,
      item,
      isDragging,
      canDrag, // not sure
      itemType,
      ...rest
    } = this.props;

    const { insert } = this.state;

    const componentToRender = React.createElement(component, {
      ...rest,
      ...componentProps,
      // mark filter if it is hovered over the items of the same group
      hoveredOverSameGroup: this.props.receiveReady && item.group === this.props.group.name,
    });

    // TODO: figure out if we should go with wrapper or single component
    return connectDragSource(connectDropTarget(<div
      className={classNames('list__dnd-item', {
        '-insert-above': insert === 'above',
        '-insert-below': insert === 'below',
        '-is-dragging': isDragging,
      })}
    >
      {componentToRender}
    </div>));
  }
};

// TODO: review, some of these are redundant
DndFilter.propTypes = {
  callbacks: PropTypes.object,
  canDrag: PropTypes.bool, // ns
  canDrop: PropTypes.bool,
  component: PropTypes.func,
  componentProps: PropTypes.object,
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  filter: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  filterIsOver: PropTypes.bool,
  group: PropTypes.object,
  index: PropTypes.number,
  isDragging: PropTypes.bool,
  isOver: PropTypes.bool,
  item: PropTypes.object,
  itemType: PropTypes.string,
  localIndexes: PropTypes.object,
  readyToDrop: PropTypes.bool,
  sortContainerCb: PropTypes.func,
};

export default flow(
  DropTarget([Types.ITEM, Types.FILTER], filterTarget, collectTarget),
  DragSource(Types.FILTER, filterSource, collectSource)
)(DndFilter);
