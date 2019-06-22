import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FilterCategory from './filterCategory.jsx';
import { connectGroupItems } from '../helpers/filtersPanel.js';

const FilterPanel = (props) => {
  const renderFilterCategories = () => {
    const { filtersConfig } = props;
    // filters is an object, which values we should filter and sort
    return (
      Object.values(filtersConfig.categories)
        // pass only filter groups with prop root === true (i.e. group is root of the category)
        .filter((item) => item.root)
        // sort by index, allows to render root groups in specific order
        .sort((a, b) => a.root.index - b.root.index)
        .map((filterGroup, i) => (
          <FilterCategory
            {...props}
            key={i}
            group={connectGroupItems({
              group: filterGroup,
              config: filtersConfig,
            })}
          />
        ))
    );
  };

  const filterCategories = renderFilterCategories();

  return <ul className="list__filter-panel --helpers-custom-scrollbar">{filterCategories}</ul>;
};

FilterPanel.propTypes = {
  callbacks: PropTypes.shape({
    apply: PropTypes.func.isRequired,
    dropOn: PropTypes.func.isRequired,
    saveIndexes: PropTypes.func.isRequired,
  }),
  filtersConfig: PropTypes.object.isRequired,
  localIndexes: PropTypes.object,
  selected: PropTypes.object,
};

export default FilterPanel;
