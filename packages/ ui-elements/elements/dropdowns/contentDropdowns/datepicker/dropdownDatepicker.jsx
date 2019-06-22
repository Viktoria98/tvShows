import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import DropdownBase from '../base/dropdownBase.jsx';
import { YearMonthForm } from './yearMonthForm.jsx';
import Icon from '../../../icons/icon.jsx';
import './datepicker.styl';

const DropdownDatepicker = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      month: props.date || new Date(),
    };

    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleYearMonthChange = this.handleYearMonthChange.bind(this);
    this.disableDays = this.disableDays.bind(this);
  }

  handleChangeDate (date, { disabled }) {
    const { data, multiedit } = this.props;
    if (disabled) {
      return;
    }
    this.props.cb(date, multiedit, data);
    this.base.close();
  }

  handleYearMonthChange (month) {
    this.setState({ month });
  }

  disableDays (day) {
    // check if the day from the current month
    if (
      day.getMonth() === new Date()
        .getMonth() &&
      day.getFullYear() === new Date()
        .getFullYear()
    ) {
      // and disable it if it goes before today's date
      return day.getDate() < new Date()
        .getDate();
    }
  }

  shouldStayOpen (el) {
    // prevent dropdown from closing if we clicked on daypicker nav button
    if (el.classList.contains('DayPicker-NavButton')) {
      return true;
    }
  }

  render () {
    const { dateConfig } = this.props;

    const { allowPastYears, fromMonth, toMonth } = dateConfig;
    const dropdownHeight = 260;

    let { date } = this.props;

    function Weekday ({
      weekday, className, localeUtils, locale,
    }) {
      const weekdayName = localeUtils.formatWeekdayLong(weekday, locale);
      return (
        <div className={className} title={weekdayName}>
          {weekdayName.slice(0, 1)}
        </div>
      );
    }

    function Navbar ({
      nextMonth,
      previousMonth,
      onPreviousClick,
      onNextClick,
      className,
      localeUtils,
    }) {
      const months = localeUtils.getMonths();
      const prev = months[previousMonth.getMonth()];
      const next = months[nextMonth.getMonth()];
      const styleLeft = {
        float: 'left',
      };
      const styleRight = {
        float: 'right',
      };
      return (
        <div className={className}>
          <button style={styleLeft} onClick={() => onPreviousClick()}>
            <Icon className="" type="chevronDatepicker" />
          </button>
          <button style={styleRight} onClick={() => onNextClick()}>
            <Icon className="" type="chevronDatepicker" />
          </button>
        </div>
      );
    }
    // bcs null causes fatal error
    if (!date) {
      date = new Date();
    } // check

    let datePicker;
    if (dateConfig.allowPastYears) {
      datePicker = (
        <DayPicker
          enableOutsideDays
          initialMonth={date}
          month={this.state.month}
          selectedDays={date}
          onDayClick={this.handleChangeDate}
          navbarElement={<Navbar />}
          captionElement={
            <YearMonthForm
              onChange={this.handleYearMonthChange}
              fromMonth={dateConfig.fromMonth}
              toMonth={dateConfig.toMonth}
            />
          }
        />
      );
    } else {
      datePicker = (
        <DayPicker
          enableOutsideDays
          initialMonth={date}
          selectedDays={date}
          onDayClick={this.handleChangeDate}
          fromMonth={dateConfig.fromMonth}
          toMonth={dateConfig.toMonth}
          navbarElement={<Navbar />}
        />
      );
    }

    return (
      <DropdownBase
        {...this.props}
        shouldStayOpen={this.shouldStayOpen}
        isDateDropdown
        dropdownHeight={dropdownHeight}
        ref={(base) => (this.base = base)}
      >
        {datePicker}
      </DropdownBase>
    );
  }
};

DropdownDatepicker.propTypes = {
  width: PropTypes.number,
  right: PropTypes.string,
  content: PropTypes.string,
  cellClass: PropTypes.string,
  name: PropTypes.string,
  date: PropTypes.object,
  data: PropTypes.object,
  cb: PropTypes.func,
  dateConfig: PropTypes.object,
  // multiedit: PropTypes.?
};

export default DropdownDatepicker;
