import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import ListFilterPanel from './filters/filterPanel.jsx';
import { DndSortContainer } from '../helperComponents/';
import ListBody from './listBody.jsx';
import CustomDragLayer from './dnd/dragLayer.jsx';

import './list.styl';

const List = class extends Component {
  constructor (props) {
    super(props);
    this.calculateContainerHeight = this.calculateContainerHeight.bind(this);
  }

  componentDidMount () {
    this.calculateContainerHeight();
    window.addEventListener('resize', this.calculateContainerHeight);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.calculateContainerHeight);
  }

  calculateContainerHeight () {
    const bottomMargin = 15;
    const height = window.innerHeight - this.container.offsetTop - bottomMargin;

    this.container.style.maxHeight = `${height}px`;
    this.container.style.minHeight = `${height}px`;
  }

  findRootGroup (data) {
    for (const group of Object.values(data)) {
      if (group.root) {
        return group;
      }
    }
    return {};
  }

  render () {
    const {
      filtersConfig,
      listFilters,
      saveIndexes,
      listPathToSelectedFilter,
      items,
      localIndexes,
      filterPanelCallbacks,
      loading,
      data,
      bodyCallbacks,
      detailsPanel,
      onInfiniteScroll,
      itemsRegistry,
      renderLimit,
      openedInDetailsIssueId,
    } = this.props;

    const sortContainerProps = {
      saveIndexes,
      loading,
      localIndexes,
    };

    const rootGroup = this.findRootGroup(data);

    return (
      <div className="list" ref={(container) => (this.container = container)}>
        <ListFilterPanel
          filtersConfig={filtersConfig}
          callbacks={{
            ...filterPanelCallbacks,
            saveIndexes,
          }}
          selected={listFilters}
          pathToSelectedFilter={listPathToSelectedFilter}
          localIndexes={localIndexes}
        />
        <ListBody
          data={data}
          rootGroup={rootGroup}
          callbacks={bodyCallbacks}
          // detailsPanel={detailsPanel}
          itemsRegistry={itemsRegistry}
          openedInDetails={openedInDetailsIssueId}
          infiniteScroll={{
            cb: onInfiniteScroll,
            limit: renderLimit[rootGroup.itemType],
          }}
          activeFilter={listFilters}
          propsPackage={{
            sortContainerProps,
          }}
        />
        <CustomDragLayer />
      </div>
    );
  }
};

List.propTypes = {
  bodyCallbacks: PropTypes.object,
  data: PropTypes.object,
  itemsRegistry: PropTypes.object,
  renderLimit: PropTypes.object,
  // filters
  filtersConfig: PropTypes.object,
  filterPanelCallbacks: PropTypes.object,
  listFilters: PropTypes.object,
  // data
  items: PropTypes.array,
  loading: PropTypes.bool,
  onInfiniteScroll: PropTypes.func,
  // dnd
  localIndexes: PropTypes.object,
  saveIndexes: PropTypes.func,
  // details
  // detailsPanel: PropTypes.node,
};

List.defaultProps = {
  items: [],
};

// drag and drop won't work without this
export default DragDropContext(HTML5Backend)(List);
