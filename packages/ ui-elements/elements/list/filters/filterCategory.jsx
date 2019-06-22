import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DndSortContainer from '../../helperComponents/dndSortContainer.jsx';
import FilterGroup from './filterGroup.jsx';

const FilterCategory = class extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const renderGroup = (group) => {
      const { localIndexes, callbacks, ...rest } = this.props;
      const { saveIndexes, ...restCallbacks } = callbacks;

      if (group.dragAndDrop) {
        const componentProps = {
          ...rest, // filters, selected, group
          callbacks: restCallbacks,
        };

        return (
          <DndSortContainer
            items={group.items}
            localIndexes={localIndexes}
            groupIndexes={localIndexes[group.name]}
            saveIndexes={saveIndexes}
            categoryName={group.name}
            // component to render and its props
            component={FilterGroup}
            componentProps={componentProps}
          />
        );
        // groups without dnd functionality, such as unsorted/trash/etc don't need additional props or wrappers
      }
      return <FilterGroup {...this.props} items={group.items} />;
    };

    const { group } = this.props;
    const categoryName = <div className="filter-category__name">{group.displayName}</div>;
    const component = renderGroup(group);

    // we render sort container wrapper, and pass in FilterGroup as prop
    // sort container contains logic for dnd items sorting, while FilterGroup contains client logic
    return (
      <div className="filter-category">
        {categoryName}
        {component}
      </div>
    );
  }
};

FilterCategory.propTypes = {
  callbacks: PropTypes.shape({
    apply: PropTypes.func.isRequired,
    dropOn: PropTypes.func.isRequired,
    saveIndexes: PropTypes.func.isRequired,
  }),
  filtersConfig: PropTypes.object.isRequired,
  localIndexes: PropTypes.object,
  selected: PropTypes.object,
  group: PropTypes.object.isRequired,
};

export default FilterCategory;
