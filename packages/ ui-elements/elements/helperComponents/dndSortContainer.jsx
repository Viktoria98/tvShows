import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import _ from 'lodash';

const DndSortContainer = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      items: [],
    };

    this.moveItem = this.moveItem.bind(this);
  }

  // resort items on mount
  componentWillMount () {
    const { groupIndexes, items } = this.props;

    if (_.isEmpty(groupIndexes)) {
      return this.setState({ items });
    }

    this.setState({
      items: this.resortItems(items, groupIndexes),
    });
  }

  componentWillReceiveProps (nextProps) {
    // don't resort items if component is loading new data
    if (nextProps.loading) {
      return;
    }

    this.setState({
      items: this.resortItems(nextProps.items, nextProps.groupIndexes),
    });
  }

  resortItems (items, indexes) {
    function buildFixedIndexes (indexes) {
      // split indexes array into different arrays, each represents indexes in sequence
      function buildSeq (arr, startIndex = 0) {
        const firstArrSequence = [arr[startIndex]]; // first array with first element
        const sequence = [firstArrSequence];

        let lastIndex = startIndex;
        let nextIndexToCheck = startIndex + 1;
        let currentSequence = 0;

        // while nextIndex is real and we didn't reach arrays end yet
        while (typeof nextIndexToCheck === 'number' && nextIndexToCheck !== arr.length) {
          if (!(arr[nextIndexToCheck][1] === arr[lastIndex][1] + 1)) {
            currentSequence += 1;
            sequence[currentSequence] = [];
          }

          sequence[currentSequence].push(arr[nextIndexToCheck]);
          lastIndex = nextIndexToCheck;
          nextIndexToCheck += 1;
        }

        return sequence;
      }
      // since main unit is object entry [id, index], [1] represents index
      const sortAsc = (a, b) => a[1] - b[1];
      const sortDesc = (a, b) => b[1] - a[1];

      const sortedIndexes = Object.entries(indexes)
        .sort(sortAsc);

      const sequence = buildSeq(sortedIndexes);
      sequence.forEach((chain) => {
        // we should resort only if sequence has more than one element and its not first sequence
        // i.e its not sequence that starts with index 0
        if (chain.length > 1 && chain[0][1] !== 0) {
          chain.sort(sortDesc);
        }
      });

      return sequence.reduce((a, b) => a.concat(b), []);
    }

    if (_.isEmpty(indexes) || _.isEmpty(items)) {
      return items;
    }

    const { pathToId } = this.props;

    const fixedIndexes = buildFixedIndexes(indexes);
    let resortedItems = items.slice();

    fixedIndexes.forEach(([id, index]) => {
      const itemCurrentIndex = resortedItems.findIndex((item) => _.get(item, pathToId) === id);

      // findIndex returns -1 if element not found
      if (itemCurrentIndex < 0) {
        return;
      }

      const replacedItem = resortedItems[itemCurrentIndex];
      resortedItems = update(resortedItems, {
        $splice: [[itemCurrentIndex, 1], [index, 0, replacedItem]],
      });
    });

    return resortedItems;
  }

  // normalize indexes, so that drag items have updated indexes without duplicates
  updateIndexes (items, dragItemId) {
    const { groupIndexes, pathToId } = this.props;

    const newIndexes = {};

    let savedItemsIds = [...Object.keys(groupIndexes)];
    if (typeof dragItemId === 'object') {
      savedItemsIds = [...savedItemsIds, ...dragItemId];
    } else {
      savedItemsIds = [...savedItemsIds, dragItemId];
    }

    items.forEach((item, i) => {
      const id = _.get(item, pathToId);
      if (savedItemsIds.includes(id)) {
        newIndexes[id] = i;
      }
    });

    return newIndexes;
  }

  moveItem (args) {
    // TODO: make it universal, a lots of duplicates
    const moveSingleItem = (drag, hover) => {
      const { itemIntruder } = args;
      const { pathToId } = this.props;
      const { items } = this.state;

      const dragItem = itemIntruder || items[drag.index];

      const filteredItems = items.filter((item) => {
        const id = _.get(item, pathToId);
        if (id === drag.id) {
          return false;
        }
        return true;
      });

      let newHoverIndex = filteredItems.findIndex((item) => _.get(item, pathToId) === hover.id);
      newHoverIndex = newHoverIndex >= 0 ? newHoverIndex : hover.index;
      newHoverIndex = hover.direction === 'below' ? newHoverIndex + 1 : newHoverIndex;

      return update(filteredItems, {
        $splice: [[newHoverIndex, 0, dragItem]],
      });
    };

    const moveMultipleItems = (drag, hover) => {
      const { items } = this.state;
      const itemsToInsert = [];

      const filteredItems = items.filter((item) => {
        if (drag.id.some((id) => id === item.id)) {
          itemsToInsert.push(item);
          return false;
        }
        return true;
      });

      let newHoverIndex = filteredItems.findIndex((item) => item.id === hover.id);
      newHoverIndex = newHoverIndex >= 0 ? newHoverIndex : hover.index;
      newHoverIndex = hover.direction === 'below' ? newHoverIndex + 1 : newHoverIndex;

      return update(filteredItems, {
        $splice: [[newHoverIndex, 0, ...itemsToInsert]],
      });
    };

    const { drag, hover } = args;
    const { saveIndexes, categoryName } = this.props;
    let items;

    if (typeof drag.index === 'object') {
      items = moveMultipleItems(drag, hover);
    } else {
      items = moveSingleItem(drag, hover);
    }

    const indexes = this.updateIndexes(items, drag.id);
    saveIndexes({ indexes, categoryName });

    this.setState({ items });
  }

  render () {
    // extract all props that are related only to dndSortContainer, save everything else in rest
    const {
      groupIndexes, pathToId, component, componentProps, ...rest
    } = this.props;
    const { items } = this.state;

    // render component element, and populate its props with specific fields (e.g. items and moveItem cb)
    return React.createElement(component, {
      ...rest,
      ...componentProps,
      items,
      sortContainerCb: this.moveItem,
    });
  }
};

DndSortContainer.propTypes = {
  categoryName: PropTypes.string,
  component: PropTypes.func.isRequired,
  componentProps: PropTypes.object.isRequired,
  groupIndexes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  pathToId: PropTypes.string,
  localIndexes: PropTypes.object, // not sure, its link to overall local indexes for all groups, but its not used
  saveIndexes: PropTypes.func,
};

DndSortContainer.defaultProps = {
  pathToId: 'id', // be aware
  groupIndexes: {},
};

export default DndSortContainer;
