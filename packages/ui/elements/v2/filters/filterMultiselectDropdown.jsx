import PropTypes from 'prop-types';
import React from 'react';
import { Dispatch as dispatch } from 'meteor/meteorflux:meteorflux';
import MultiselectDropdown from '../dropdowns/components/multiselectDropdown';

const FilterMultiselectDropdown = (props) => {
  const updateFilter = (name, value, selected) => {
    dispatch('ADD_FILTER', {
      filter_by: name,
      value: selected[name],
    });
  };

  const removeAll = (name) => {
    if (typeof props.overall === 'function') {
      props.overall();
    } else {
      dispatch('ADD_FILTER', {
        filter_by: name,
        value: null,
      });
    }
  };
  return (
    <MultiselectDropdown
      id={props.id}
      label={props.label}
      buttonIcon={props.buttonIcon}
      options={props.options}
      selected={props.selected}
      add={updateFilter}
      remove={updateFilter}
      removeAll={removeAll}
      className="filter"
    />
  );
};

FilterMultiselectDropdown.displayName = 'FilterMultiselectDropdown';

FilterMultiselectDropdown.propTypes = {
  overall: PropTypes.func,
  selected: PropTypes.shape({}),
  label: PropTypes.string,
  buttonIcon: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  options: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default FilterMultiselectDropdown;
