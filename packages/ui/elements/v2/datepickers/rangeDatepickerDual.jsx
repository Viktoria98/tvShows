/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import ReactDatepicker from 'ff-react-daterange-picker';
import 'ff-react-daterange-picker/dist/css/react-calendar.css';
import SimpleDate, { WEEK, TWO_WEEK, MONTH, THREE_MONTHS } from '../../formatters/SimpleDate';

const ranges = SimpleDate.ranges;

function getInitialRange (range) {
  let selectedRange = {};
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

const RangeDatepickerDual = class extends Component {

  constructor (props) {
    super(props);

    this.state = {
      selectedRange: getInitialRange(this.props.preselected),
    };

    this.tabChanged = this.tabChanged.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.updateDatepicker = this.updateDatepicker.bind(this);
  }

  componentDidMount () {
    this.updateDatepicker(this.state.selectedRange, false);
  }

  componentWillReceiveProps (props) {
    if (props.fromReport) {
      this.setState({ selectedRange: getInitialRange(props.preselected) });
      this.updateDatepicker(getInitialRange(props.preselected), false);
    }
  }

  tabChanged (selectedTab) {
    const startDate = this.state.selectedRange.startDate;
    const endDate = this.state.selectedRange.endDate;
    const selectedRange = {
      startDate,
      endDate,
      selectedTab,
    };
    this.updateDatepicker(selectedRange);
  }

  handleSelect (range) {
    this.updateDatepicker({
      startDate: range.start,
      endDate: range.end,
      selectedTab: 'custom',
    });
  }

  updateDatepicker (selectedRange, triggerChange = true) {
    let text = '';
    let periodPrefix;
    let startDateFunc = () => SimpleDate.getStartDate();
    let endDateFunc = () => SimpleDate.getEndDate();
    if (this.props.futureFixedRanges) {
      periodPrefix = 'Next ';
      endDateFunc = SimpleDate.getAddEndDate;
    } else {
      startDateFunc = SimpleDate.getSubtractStartDate;
      periodPrefix = 'Last ';
    }

    const newSelectedRange = selectedRange;
    switch (selectedRange.selectedTab) {
      case ranges.week: {
        newSelectedRange.startDate = startDateFunc(WEEK);
        text = `${periodPrefix} 7 days`;
        newSelectedRange.endDate = endDateFunc(WEEK);
        break;
      }
      case ranges.twoWeeks: {
        newSelectedRange.startDate = startDateFunc(TWO_WEEK);
        text = `${periodPrefix} 14 days`;
        newSelectedRange.endDate = endDateFunc(TWO_WEEK);
        break;
      }
      case ranges.month: {
        newSelectedRange.startDate = startDateFunc(MONTH);
        text = `${periodPrefix} 30 days`;
        newSelectedRange.endDate = endDateFunc(MONTH);
        break;
      }
      case ranges.threeMonths: {
        newSelectedRange.startDate = startDateFunc(THREE_MONTHS);
        text = `${periodPrefix} 90 days`;
        newSelectedRange.endDate = endDateFunc(THREE_MONTHS);
        break;
      }
      default: {
        newSelectedRange.endDate = selectedRange.endDate.endOf('day');
        text = [
          SimpleDate.format(selectedRange.startDate, 'MMMM D, YYYY'),
          ' - ',
          SimpleDate.format(selectedRange.endDate, 'MMMM D, YYYY'),
        ].join(' ');
      }
    }
    this.setState({ selectedRange: newSelectedRange }, () => {
      if (triggerChange && this.props.onChange) {
        this.props.onChange(text, {
          startDate: newSelectedRange.startDate,
          endDate: newSelectedRange.endDate,
          selectedTab: newSelectedRange.selectedTab,
        });
      }
    });
  }

  render () {
    const { startDate, endDate, selectedTab } = this.state.selectedRange;
    const maximumDate = (this.props.noFutureLimit) ? null : new Date();
    let periodPrefix = 'Last';
    if (this.props.futureFixedRanges) {
      periodPrefix = 'Next';
    }

    return (<div className="rangeDatepicker -dual">
      <div className="rangeDatepicker__ranges">
        <li
          className={classNames('dropdown__header__item days_7',
                               { '-active': selectedTab === ranges.week })}
          onClick={this.tabChanged.bind(null, ranges.week)}
        >{`${periodPrefix} 7 days`}</li>
        <li
          className={classNames('dropdown__header__item days_14',
                               { '-active': selectedTab === ranges.twoWeeks })}
          onClick={this.tabChanged.bind(null, ranges.twoWeeks)}
        >{`${periodPrefix} 14 days`}</li>
        <li
          className={classNames('dropdown__header__item days_30',
                               { '-active': selectedTab === ranges.month })}
          onClick={this.tabChanged.bind(null, ranges.month)}
        >{`${periodPrefix} 30 days`}</li>
        <li
          className={classNames('dropdown__header__item days_90',
                               { '-active': selectedTab === ranges.threeMonths })}
          onClick={this.tabChanged.bind(null, ranges.threeMonths)}
        >{`${periodPrefix} 90 days`}</li>
        <li
          className={classNames('dropdown__header__item days_custom',
                               { '-active': selectedTab === ranges.custom })}
          onClick={this.tabChanged.bind(null, ranges.custom)}
        >Custom</li>
      </div>
      <div className="rangeDatepicker__calendars">
        <ReactDatepicker
          firstOfWeek={0}
          numberOfCalendars={2}
          selectionType="range"
          singleDateRange
          maximumDate={maximumDate}
          stateDefinitions={this.stateDefinitions}
          showLegend={false}
          value={SimpleDate.range(startDate, endDate)}
          onSelect={this.handleSelect}
          showOtherMonthDays={false}
        />
      </div>
    </div>);
  }
};

RangeDatepickerDual.displayName = 'RangeDatepickerDual';

RangeDatepickerDual.propTypes = {
  preselected: PropTypes.object,
  onChange: PropTypes.func,
};

export default RangeDatepickerDual;
