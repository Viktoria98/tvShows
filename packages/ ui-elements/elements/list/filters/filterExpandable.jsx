import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Filter from './filter.jsx';
import FilterGroup from './filterGroup.jsx';
import DndSortContainer from '../../helperComponents/dndSortContainer.jsx';
import Icon from '../../icons/icon.jsx';

const FilterExpandable = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      expand: false,
    };

    this.toggleExpand = this.toggleExpand.bind(this);
    this.hasActiveFilter = this.hasActiveFilter.bind(this);
  }

  toggleExpand (event) {
    this.setState({
      expand: !this.state.expand,
    });
  }

  hasActiveFilter (id) {
    // fire signal in chain to the rop
    const { activeCb, filter } = this.props;
    if (typeof activeCb === 'function') {
      activeCb(filter.value);
    }
    // expand filter only if it wasn't expanded, and active filter is not a core one
    // i.e. active filter is either one of childrens, or just placed way down the chain
    if (!this.state.expand && filter.value !== id) {
      this.toggleExpand();
    }
  }

  render () {
    const renderFilter = () => {
      const {
        filter, group, isDragging, ...rest
      } = this.props;
      return <Filter {...rest} activeCb={this.hasActiveFilter} filter={filter} group={group} />;
    };

    const renderSubfilters = () => {
      const {
        filter, localIndexes, saveIndexes, callbacks, subFilterGroup, ...rest
      } = this.props;
      const { expand } = this.state;

      const componentProps = {
        ...rest,
        activeCb: this.hasActiveFilter,
        group: subFilterGroup,
        callbacks,
        parentFilter: filter,
      };

      if (subFilterGroup.dragAndDrop) {
        return (
          <DndSortContainer
            items={subFilterGroup.items}
            groupIndexes={localIndexes[filter.subcategory]}
            saveIndexes={saveIndexes}
            categoryName={filter.subcategory}
            // component and its props
            component={FilterGroup}
            componentProps={componentProps}
          />
        );
      }
      return (
        <FilterGroup
          {...this.props}
          activeCb={this.hasActiveFilter}
          items={subFilterGroup.items}
          group={subFilterGroup}
          parentFilter={filter}
        />
      );
    };

    const { expand } = this.state;
    const singleFilter = renderFilter();
    const subfilters = renderSubfilters();

    return (
      <div
        style={{
          display: this.props.outOfRenderRange ? 'none' : null,
        }}
        className={classNames('filter__expand-container', {
          '-expand': expand,
        })}
      >
        <button className="filter__expand-btn" onClick={this.toggleExpand}>
          <Icon
            type="delta"
            className={classNames('filter__expand-arrow', {
              '-expand': expand,
            })}
          />
        </button>
        {singleFilter}
        <div
          className={classNames('filter__subfilters-container', {
            '-expand': expand,
          })}
        >
          {subfilters}
        </div>
      </div>
    );
  }
};

FilterExpandable.propTypes = {
  callbacks: PropTypes.object,
  categoryName: PropTypes.string,
  filter: PropTypes.object,
  filters: PropTypes.object,
  group: PropTypes.object,
  index: PropTypes.number,
  localIndexes: PropTypes.object,
  readyToDrop: PropTypes.bool,
  saveIndexes: PropTypes.func, // ns
  selected: PropTypes.object,
  sortContainerCb: PropTypes.func, // ns
};
FilterExpandable.defaultProps = {
  filter: [],
  localIndexes: {},
};

export default FilterExpandable;
