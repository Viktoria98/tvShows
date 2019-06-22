import React, { Component } from 'react';
import PropTypes from 'prop-types';
import flow from 'lodash/flow';
import { DragSource, DropTarget } from 'react-dnd';
import _ from 'lodash';

import Types from './itemTypes.js';
import List from '../kanbanList.jsx';

// const itemSource = {
//   beginDrag(props, monitor, component) {
//     console.log('begin drag');
//     return {}
//   }
// };
//
// function collectSource(connect, monitor) {
//   return {
//     connectDragSource: connect.dragSource(),
//   }
// }

const itemTarget = {
  drop (props, monitor, component) {
    const item = monitor.getItem();
    const category = _.get(props, 'componentProps.category.id');
    const field = _.get(props, 'componentProps.target.field');

    props.dropCb({
      id: item.id,
      newOverrides: {
        [field]: category,
      },
      oldOverrides: {
        [field]: item.category,
      },
    });
  },

  canDrop (props, monitor) {
    return !props.hasItems;
  },
};

function collectTarget (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

const DndKanbanList = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const {
      // connectDragSource,
      hasItems,
      connectDropTarget,
      isOver,
    } = this.props;
    let { componentProps } = this.props;

    const showPlaceholder = !hasItems && isOver;
    if (showPlaceholder) {
      componentProps = {
        ...componentProps,
        showPlaceholder,
      };
    }

    const style = {
      display: 'flex',
    };

    return connectDropTarget(<div style={style}>
      <List {...componentProps} />
    </div>);
    // return connectDragSource(
    //   connectDropTarget(
    //     <div>
    //        Component
    //     </div>
    //   )
    // );
  }
};

DndKanbanList.propTypes = {
  connectDropTarget: PropTypes.func,
  // connectDragSource: PropTypes.func,
  componentProps: PropTypes.object,
  dropCb: PropTypes.func,
  hasItems: PropTypes.bool,
  isOver: PropTypes.bool,
};

export default DropTarget(Types.CARD, itemTarget, collectTarget)(DndKanbanList);
// export default flow(
//   DropTarget(Types.ITEM, itemTarget, collectTarget),
//   DragSource(Types.ITEM, itemSource, collectSource),
// )(DndKanbanList);
