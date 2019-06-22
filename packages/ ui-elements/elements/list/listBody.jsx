import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import RenderItem from './render/renderItem.jsx';
import ListBodyGroup from './body/group.jsx';

const ListBody = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedItems: [],
    };

    // issues selection
    this.renderedItems = [];
    this.issueCategoriesRegistry = {};
    this.counter = 0;

    // infinite scroll
    this.timeoutID = null;
    this.infiniteScrollTimeout = 20;

    // arrow keydown
    this.keyDownTimeoutID = null;
    this.keyDownTimeout = 20;

    this.onScroll = this.onScroll.bind(this);
    this.debouncedContainerKeyDown = this.debouncedContainerKeyDown.bind(this);
    this.handleContainerKeyDown = this.handleContainerKeyDown.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.updateSelectedItems = this.updateSelectedItems.bind(this);
    this.liftItems = this.liftItems.bind(this);
    this.onBodyClick = this.onBodyClick.bind(this);
  }

  // update indexes for selected items
  componentWillReceiveProps (nextProps) {
    this.resetCategoriesRegistry(); // this is very important for issues selection

    if (nextProps.activeFilter.value !== this.props.activeFilter.value) {
      this.saveAndSyncSelectedItems([]);
    }
  }

  resetCategoriesRegistry () {
    this.issueCategoriesRegistry = {};
    this.renderedItems = [];
    this.counter = 0;
  }

  buildRenderedItemsRegistry () {
    return this.renderedItems.reduce((a, b) => a.concat(b), []);
  }

  liftItems (groupName, data) {
    if (typeof this.issueCategoriesRegistry[groupName] !== 'number') {
      this.issueCategoriesRegistry[groupName] = this.counter;
      this.counter++;
    }
    this.renderedItems[this.issueCategoriesRegistry[groupName]] = data;
  }

  saveAndSyncSelectedItems (selectedItems, additionalData = {}) {
    const { saveSelectedItems, callbacks } = this.props;
    this.setState({
      selectedItems,
      ...additionalData,
    });
    if (typeof callbacks.saveSelectedItems === 'function') {
      const items = selectedItems.map((item) => item.id);
      callbacks.saveSelectedItems(items);
    }
  }

  // infinite scroll with debonce
  onScroll (e) {
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => this.infiniteScroll(), this.infiniteScrollTimeout);
  }

  infiniteScroll () {
    const { loading, infiniteScroll, rootGroup } = this.props;
    const { cb, limit } = infiniteScroll;
    const { listBody } = this;

    if (infiniteScroll && typeof infiniteScroll.cb === 'function') {
      if (loading) {
        return false;
      }

      // return if user haven't scrolled to bottom
      const scrolledToBottom =
        listBody.scrollTop + listBody.clientHeight > listBody.scrollHeight - 25;
      if (!scrolledToBottom) {
        return false;
      }
      // load items if there are any
      const { items } = rootGroup;
      if (items.length > limit) {
        cb(rootGroup.itemType);
      }
    }
  }

  // issues selection with arrows
  debouncedContainerKeyDown (event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
    }
    event.persist();

    clearTimeout(this.keyDownTimeoutID);
    this.keyDownTimeoutID = setTimeout(
      () => this.handleContainerKeyDown(event),
      this.keyDownTimeout
    );
  }

  // handle keydown for list container (arrow up/down)
  handleContainerKeyDown (event) {
    const { selectedItems } = this.state;
    const { callbacks } = this.props;
    const inTarget = event.target === this.listContainer;

    switch (event.key) {
      case 'ArrowDown':
        return this.selectNextItem('down', event.shiftKey);

      case 'ArrowUp':
        return this.selectNextItem('up', event.shiftKey);

      case 'Enter':
        return inTarget && selectedItems.length === 1
          ? callbacks.openDetails(selectedItems[0].id)
          : false;

      case 'Backspace':
      case 'Delete':
        return inTarget && selectedItems.length
          ? callbacks.deleteItems(selectedItems.map((item) => item.id))
          : false;

      case 'Escape':
        return inTarget && selectedItems.length ? this.saveAndSyncSelectedItems([]) : false;

      default:
    }
  }

  updateSelectedItems (items, mode) {
    const set = (items) => {
      this.saveAndSyncSelectedItems(items, {
        lastSelectedItem: items[items.length - 1],
      });
    };
    const { selectedItems } = this.state;

    switch (mode) {
      case 'reset':
        return set(items);

      case 'delete':
        return set(selectedItems.filter((item) => item.id !== items[0].id));

      default:
        return set(selectedItems.concat(items));
    }
  }

  // select next item based on pressed arrow key + autoscroll
  selectNextItem (direction, pressedShift) {
    // autoscroll to selected item
    function scrollToVisible (args = {}) {
      const {
        node, container, cursorDirection, firstItem, lastItem,
      } = args;
      // if user didn't pressed arrow
      if (!cursorDirection) {
        return;
      }
      // if user selected first item or last item
      if (firstItem || lastItem) {
        return (container.scrollTop = node.offsetTop);
      }

      const nodeBottom = node.offsetTop + node.offsetHeight;
      const containerScroll = container.clientHeight + container.scrollTop;

      // if user moved down, and element is positioned out of sight
      if (cursorDirection === 'down' && nodeBottom > containerScroll) {
        return (container.scrollTop += nodeBottom - containerScroll);
        // if used moved up and element is positioned out of sight
      } else if (cursorDirection === 'up' && container.scrollTop > node.offsetTop) {
        return (container.scrollTop = node.offsetTop);
      }
    }

    const items = this.buildRenderedItemsRegistry();
    const { selectedItems } = this.state;
    const { itemsRegistry } = this.props;
    let nextItemIndex;

    const lastSelectedItem = selectedItems[selectedItems.length - 1];
    if (!lastSelectedItem) {
      return;
    }
    const lastSelectedItemIndex = items.findIndex((item) => item === lastSelectedItem.id);

    switch (direction) {
      case 'up':
        nextItemIndex = lastSelectedItemIndex - 1;
        // nextItemIndex = lastSelectedItem.index - 1;
        // i've disabled this since it is conflicting with infinit scroll
        if (nextItemIndex < 0) {
          return;
          // nextItemIndex = items.length - 1;
          // lastItem = true;
        }
        break;

      case 'down':
        nextItemIndex = lastSelectedItemIndex + 1;
        // i've disabled this since it is conflicting with infinite scroll
        if (nextItemIndex >= items.length) {
          return;
          // nextItemIndex = 0;
          // firstItem = true;
        }
        break;

      default:
        nextItemIndex = 0;
        break;
    }

    let nextItem = items[nextItemIndex];
    nextItem = itemsRegistry[nextItem];
    const selectedDONNode = this.listContainer.querySelector(`[data-id="${nextItem.id}"]`);
    // const selectedDONNode = this.listContainer.querySelector(`[data-id="${nextItem.itemData.id}"]`);

    scrollToVisible({
      node: selectedDONNode,
      container: this.listBody,
      cursorDirection: direction,
      // firstItem,
      // lastItem,
    });

    const item = { id: nextItem.id };

    if (pressedShift) {
      // find if we are going to unselect item
      for (const el of selectedItems) {
        if (el.id === item.id) {
          return this.updateSelectedItems([lastSelectedItem], 'delete');
        }
      }

      return this.updateSelectedItems([item]);
    }
    return this.updateSelectedItems([item], 'reset');
  }

  // issues selection using mouse/ctrl/shift
  selectItem (args) {
    const selectOneItem = (item) => this.updateSelectedItems([item], 'reset');
    const addItemToSelected = (item) => this.updateSelectedItems([item]);
    const deleteSelectedItem = (item) => this.updateSelectedItems([item], 'delete');

    const selectItemsRange = (startItem, endItem) => {
      const { selectedItems } = this.state;

      const startItemIndex = items.findIndex((item) => item === startItem.id);
      const endItemIndex = items.findIndex((item) => item === endItem.id);
      const indexes = [startItemIndex, endItemIndex];

      const normalizedIndexes = [Math.min(...indexes), Math.max(...indexes) + 1];
      const indexesRange = _.range(...normalizedIndexes);

      const range = items
        .slice(...normalizedIndexes)
        .map((item, i) => ({
          id: item,
        }))
        .filter((item) => item.id !== startItem.id);

      return this.updateSelectedItems(range);
    };

    const {
      item, ctrlKey, shiftKey, metaKey,
    } = args;
    const { selectedItems, lastSelectedItem } = this.state;
    const items = this.buildRenderedItemsRegistry();

    // ctrl or cmd
    if (ctrlKey || metaKey) {
      const hasItem = selectedItems.some((el) => el.id === item.id);

      if (hasItem) {
        return deleteSelectedItem(item);
      }
      return addItemToSelected(item);
    } else if (shiftKey) {
      if (lastSelectedItem) {
        return selectItemsRange(lastSelectedItem, item);
      }
      return selectOneItem(item);
    }

    return selectOneItem(item);
  }

  onBodyClick (event) {
    if (event.target === this.listBody) {
      this.saveAndSyncSelectedItems([]);
    }
  }

  render () {
    const {
      data,
      callbacks,
      itemsRegistry,
      propsPackage,
      infiniteScroll,
      openedInDetails,
    } = this.props;
    const { rootGroup } = this.props;
    const { selectedItems } = this.state;

    let items = [];
    if (rootGroup.items) {
      items = rootGroup.items.slice(0, infiniteScroll.limit);
    }

    return (
      <div
        className="list__body --helpers-custom-scrollbar"
        ref={(listBody) => (this.listBody = listBody)}
        onScroll={this.onScroll}
        onClick={this.onBodyClick}
      >
        <div
          className="list__container"
          tabIndex={0}
          onKeyDown={this.debouncedContainerKeyDown}
          ref={(listContainer) => (this.listContainer = listContainer)}
        >
          <ListBodyGroup
            key={rootGroup.id}
            group={{
              ...rootGroup,
              items,
            }}
            data={data}
            callbacks={callbacks}
            propsPackage={{
              ...propsPackage,
              liftItems: this.liftItems,
              itemProps: {
                openDetails: callbacks.openDetails,
                openedItemId: openedInDetails,
                selectItem: this.selectItem,
                selectedItems,
              },
            }}
          />
        </div>
      </div>
    );
  }
};

ListBody.propTypes = {
  callbacks: PropTypes.object,
  infiniteScroll: PropTypes.object,
  itemsRegistry: PropTypes.object,
  propsPackage: PropTypes.object,
  rootGroup: PropTypes.object,
  items: PropTypes.array,
  loading: PropTypes.bool,
  data: PropTypes.object,
  activeFilter: PropTypes.object,
  openedInDetails: PropTypes.string,
};

ListBody.defaultProps = {
  data: {},
  itemsRegistry: {},
  activeFilter: {},
};

export default ListBody;
