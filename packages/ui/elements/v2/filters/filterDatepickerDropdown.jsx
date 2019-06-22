import PropTypes from 'prop-types';
import React from 'react';
import { Dispatch as dispatch } from 'meteor/meteorflux:meteorflux';
import DatepickerDropdown from '../dropdowns/components/datepickerDropdown';
import SimpleDate from '../../formatters/SimpleDate';

export default function filterDatepickerDropdown (props) {
  const selectors = [];
  const dateRange = SimpleDate.getDateRange();
  Object.keys(dateRange)
    .forEach((key) => selectors.push(dateRange[key]));

  const updateFilter = (range) => {
    const { startDate, endDate, selectedTab } = range;
    if (typeof props.onChange === 'function') {
      props.onChange(startDate.toDate(), endDate.toDate(), selectedTab);
    } else {
      dispatch('ADD_FILTER', {
        filter_by: props.name,
        value: [startDate.toDate(), endDate.toDate()],
      });
    }
  };

  return (
    <DatepickerDropdown
      onChange={updateFilter}
      preselected={props.selectedRange}
      selectors={props.selectors || selectors}
    />
  );
}

filterDatepickerDropdown.displayName = 'FilterDatepickerDropdown';

filterDatepickerDropdown.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string,
  selectedRange: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]),
  selectors: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]),
};
