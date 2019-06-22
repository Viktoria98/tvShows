/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import ReactDatepicker from 'ff-react-daterange-picker';
import 'ff-react-daterange-picker/dist/css/react-calendar.css';
import SimpleDate, { MONTH } from '../../formatters/SimpleDate';

const {
  ranges,
} = SimpleDate;

function getInitialRange (range) {
  let selectedRange;
  if (range) {
    selectedRange = {
      startDate: SimpleDate.getStartDate(range.startDate),
      endDate: SimpleDate.getEndDate(range.endDate),
      selectedTab: range.selectedTab,
    };
  } else {
    selectedRange = {
      startDate: SimpleDate.getSubtractStartDate(MONTH),
      endDate: SimpleDate.getEndDate(),
      selectedTab: ranges.month,
    };
  }
  return selectedRange;
}

function getDate (date) { // eslint-disable-line
  if (date) {
    return (
      <div>
        <div className="rangeDatepicker__dates__date__decimal">{SimpleDate.format(date, 'DD')}</div>
        <div className="rangeDatepicker__dates__date__text">
          <p className="rangeDatepicker__dates__date__month">{SimpleDate.format(date, 'MMMM YYYY')}</p>
          <p className="rangeDatepicker__dates__date__day">{SimpleDate.format(date, 'dddd')}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="rangeDatepicker__dates__date__reminder">Choose a date</div>
  );
}

const RangeDatepicker = class extends Component {

  constructor (props) {
    super(props);
    this.state = {
      selectedRange: getInitialRange(this.props.preselected),
      label: 'Choose a date',
    };
    this.handleSelectStart = this.handleSelectStart.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
  }

  handleSelectStart (date) {
    const selectedRange = {
      startDate: date,
      endDate: false,
      selectedTab: 'custom',
    };
    this.setState({ selectedRange });
  }

  handleSelect (range) {
    const selectedRange = {
      startDate: SimpleDate.getStartDate(range.start),
      endDate: SimpleDate.getEndDate(range.end),
      selectedTab: 'custom',
    };
    this.setState({ selectedRange });
    if (typeof this.props.onChange === 'function') {
      const label = `${SimpleDate.format(range.start, 'MMM D, YYYY')} - ${SimpleDate.format(range.end, 'MMM D, YYYY')}`;
      this.props.onChange(label, selectedRange);
    }
  }

  handleTabSelect (value, label, days) {
    const selectedRange = {
      startDate: SimpleDate.getSubtractStartDate(days),
      endDate: SimpleDate.getEndDate(),
      selectedTab: value,
    };
    this.setState({ selectedRange });
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(label, selectedRange);
    }
  }

  render () {
    const selected = this.state.selectedRange.selectedTab;
    // TODO fix this lint problem.
    // eslint-disable-next-line arrow-body-style
    const header = this.props.selectors.map((item) => {
      return (<li
        key={item.name}
        className={
          classNames(
            'rangeDatepicker__header__item',
            { '-active': selected === item.value }
          )
        }
        onClick={this.handleTabSelect.bind(null, item.value, item.label, item.days)}
      >
        {item.name}
      </li>);
    });
    const start = getDate(this.state.selectedRange.startDate);
    const end = getDate(this.state.selectedRange.endDate);
    const range = (this.state.selectedRange.startDate && this.state.selectedRange.endDate) ?
        SimpleDate.range(this.state.selectedRange.startDate, this.state.selectedRange.endDate)
        :
        null;
    return (
      <div className="rangeDatepicker">
        <div className="rangeDatepicker__header">
          {header}
        </div>
        <div className="rangeDatepicker__dates">
          <div className="rangeDatepicker__dates__date -start">
            <span className="rangeDatepicker__dates__date__heading">Start date</span>
            {start}
          </div>
          <div className="rangeDatepicker__dates__date -end">
            <span className="rangeDatepicker__dates__date__heading">End date</span>
            {end}
          </div>
        </div>
        <div className="rangeDatepicker__calendar">
          <ReactDatepicker
            firstOfWeek={0}
            numberOfCalendars={1}
            selectionType="range"
            singleDateRange
            maximumDate={new Date()}
            value={range}
            onSelect={this.handleSelect}
            onSelectStart={this.handleSelectStart}
          />
        </div>
      </div>
    );
  }
};

RangeDatepicker.displayName = 'RangeDatepicker';

RangeDatepicker.propTypes = {
  preselected: PropTypes.object,
  selectors: PropTypes.array,
  onChange: PropTypes.func,
};

export default RangeDatepicker;
