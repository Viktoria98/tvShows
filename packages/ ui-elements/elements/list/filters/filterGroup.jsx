import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DndFilter from '../dnd/dndFilter.jsx';
import FilterExpandable from './filterExpandable.jsx';
import Filter from './filter.jsx';
import _ from 'lodash';

import { connectGroupItems } from '../helpers/filtersPanel.js';

const FilterGroup = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showAllFilters: false,
    };

    // how many filters we show in closed state (i.e. with more btn rendered)
    this.filtersLimit = 3;

    this.toggleShowAll = this.toggleShowAll.bind(this);
    this.activeFilterCb = this.activeFilterCb.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //   const selectedChanged = nextProps.selected.value !== this.props.selected.value;
  //   if (selectedChanged) {
  //     let selectedItemIndex = items.findIndex(item => item.id === id);
  //   }
  // }

  toggleShowAll () {
    this.setState({
      showAllFilters: !this.state.showAllFilters,
    });
  }

  activeFilterCb (id) {
    const { activeCb, items } = this.props;
    if (typeof activeCb === 'function') {
      activeCb(id);
    }

    if (!this.state.showAllFilters) {
      const selectedItemIndex = items.findIndex((item) => item.id === id);
      if (selectedItemIndex >= this.filtersLimit) {
        this.toggleShowAll();
      }
    }
  }

  render () {
    const renderMoreBtn = () => {
      const { showAllFilters } = this.state;
      const text = !showAllFilters ? 'More' : 'Less';
      return (
        <button className="filter-group__expand-btn" onClick={this.toggleShowAll}>
          {text}
        </button>
      );
    };

    const renderFilters = (shouldLimit) => {
      const {
        group,
        selected,
        callbacks,
        items,
        filtersConfig,
        saveIndexes,
        categoryName,
        ...rest
      } = this.props;
      const { showAllFilters } = this.state;

      // render items based on group state (expand true/false)
      // e.g. expand false - render only 6 items, expand true - render all items
      // let splicedItems = shouldLimit && !showAllFilters ?
      //   items.slice(0, this.filtersLimit): items;

      // TODO: be aware of this

      // return splicedItems.map((item = {}, i) => {
      return items.map((item = {}, i) => {
        const { dropOn, apply } = callbacks;

        const props = {
          ...rest,
          // passing index prop inside dndFilter item here IS CRUCIAL
          // without it dnd sorting won't work
          index: i,
          key: item.id || item.value,
          group,
          callbacks,
          filter: item,
        };

        const componentProps = {
          activeCb: this.activeFilterCb,
          selected,
          filtersConfig,
          outOfRenderRange: shouldLimit && !showAllFilters && i >= this.filtersLimit, // TODO: be aware
        };

        // if filter has nested group of filters inside
        // notice that we pass FilterExpandable as component props
        const subFilterGroup = item.subcategory
          ? connectGroupItems({
            group: filtersConfig.categories[item.subcategory],
            config: filtersConfig,
          })
          : null;
        if (_.get(subFilterGroup, 'items.length')) {
          return (
            <DndFilter
              {...props}
              component={FilterExpandable}
              componentProps={{
                saveIndexes,
                categoryName,
                subFilterGroup,
                ...componentProps,
              }}
            />
          );
        }

        return <DndFilter {...props} component={Filter} componentProps={componentProps} />;
      });
    };

    const { group, items } = this.props;
    let moreBtn = null;
    // we don't limit filters in groups without dnd
    // we also don't render moreBtn if group has less filters than limit allows
    const shouldHideItems = group.dragAndDrop && items.length > this.filtersLimit;

    if (shouldHideItems) {
      moreBtn = renderMoreBtn();
    }
    const filters = renderFilters(shouldHideItems);

    return (
      <div className="filter-group">
        {filters}
        {moreBtn}
      </div>
    );
  }
};

FilterGroup.propTypes = {
  callbacks: PropTypes.shape({
    apply: PropTypes.func.isRequired,
    dropOn: PropTypes.func.isRequired,
  }),
  filtersConfig: PropTypes.object.isRequired,
  localIndexes: PropTypes.object,
  selected: PropTypes.object,
  group: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  sortContainerCb: PropTypes.func,
};

export default FilterGroup;
