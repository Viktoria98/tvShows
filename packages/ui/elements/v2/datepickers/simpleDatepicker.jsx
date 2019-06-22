import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import SelectDropdown from '../dropdowns/components/selectDropdown';

const SimpleDatepicker = class extends Component {

  constructor (props) {
    super(props);
    this.state = {
      chosenYear: '',
      chosenMonth: '',
      chosenDay: '',
    };
    this.setYear = this.setYear.bind(this);
    this.setMonth = this.setMonth.bind(this);
    this.setDay = this.setDay.bind(this);
    this.convertMonthToNumber = this.convertMonthToNumber.bind(this);
    this.convertNumberToMonth = this.convertNumberToMonth.bind(this);

    this.months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December',
    ];
  }

  convertMonthToNumber (string) { // eslint-disable-line
    if (string === undefined) {
      return undefined;
    }
    return this.months.indexOf(string) + 1;
  }

  convertNumberToMonth (number) {
    if (typeof number === 'number') {
      return this.months[number - 1];
    }
    return number;
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.preselected.year !== this.state.chosenYear ||
        nextProps.preselected.month !== this.state.chosenMonth ||
        nextProps.preselected.day !== this.state.chosenDay) {
      if (this.props.preselected !== nextProps.preselected) {
        this.setState({
          chosenYear: nextProps.preselected.year,
          chosenMonth: nextProps.preselected.month,
          chosenDay: nextProps.preselected.day,
        });
      }
    }
  }

  onChange () {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({
        year: this.state.chosenYear,
        month: this.convertMonthToNumber(this.state.chosenMonth),
        day: this.state.chosenDay,
      });
    }
  }

  setYear (year) {
    this.setState({ chosenYear: year }, () => {
      this.onChange();
    });
  }

  setMonth (month) {
    this.setState({ chosenMonth: month }, () => {
      this.onChange();
    });
  }

  setDay (day) {
    this.setState({ chosenDay: day }, () => {
      this.onChange();
    });
  }

  // TODO clear not used object props (cb, selected)
  getYears () {
    const currentYear = new Date()
                          .getFullYear();
    const range = currentYear - 1980; // starting year
    const years = Array.from({ length: range }, (v, k) => k + 1981)
                    .reverse();

    const yearsOptions = years.map((year) => ({
      text: year,
      value: year,
      cb: this.setYear.bind(null, year),
      selected: year === (this.state.chosenYear || this.props.preselected.year),
    }));
    return yearsOptions;
  }

  getMonths () {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December',
    ];

    const monthsOptions = months.map((month, n) => {
      const monthNum = n + 1;
      return {
        text: month,
        value: monthNum,
        cb: this.setMonth.bind(null, monthNum),
        selected: monthNum === (this.state.chosenMonth || this.props.preselected.month),
      };
    });
    return monthsOptions;
  }

  getDays () {
    let days;
    switch (this.state.chosenMonth) {
      case 'April':
      case 'June':
      case 'September':
      case 'November':
        days = Array.from({ length: 30 }, (v, k) => k + 1);
        break;
      case 'February':
        days = Array.from({ length: 29 }, (v, k) => k + 1);
        break;
      default:
        days = Array.from({ length: 31 }, (v, k) => k + 1);
    }
    const daysOptions = days.map((day) => ({
      text: day,
      value: day,
      cb: this.setDay.bind(null, day),
      selected: day === (this.state.chosenDay || this.props.preselected.day),
    }));
    return daysOptions;
  }

  render () {
    let label;
    let months;
    let years;
    let days;
    const monthsOptions = this.getMonths();
    const yearsOptions = this.getYears();
    const daysOptions = this.getDays();

    if (this.props.label) {
      label = (
        <label className="form__label">{this.props.label}</label>
      );
    }

    if (!this.props.noMonths) {
      const properMonth = this.convertNumberToMonth(this.state.chosenMonth);
      months = (
        <SelectDropdown
          ref="month"
          onSelect={this.setMonth}
          options={monthsOptions}
          className={classNames(
            'dropdown__month',
            { '-error': this.props.error }
          )}
          label="Month"
          selected={properMonth}
        />
      );
    }
    if (!this.props.noYears) {
      years = (
        <SelectDropdown
          ref="year"
          onSelect={this.setYear}
          options={yearsOptions}
          className={classNames(
            'dropdown__year',
            { '-error': this.props.error }
          )}
          label="Year"
          selected={this.state.chosenYear}
        />
      );
    }

    if (!this.props.noDays) {
      days = (
        <SelectDropdown
          ref="day"
          disabled={!this.state.chosenMonth}
          options={daysOptions}
          onSelect={this.setDay}
          className={classNames(
            'dropdown__day',
            { '-error': this.props.error }
          )}
          label="Day"
          selected={this.state.chosenDay}
        />
      );
    }

    return (
      <div className="form__group">
        {label}
        <div className="datepicker simple">
          {years}
          {months}
          {days}
        </div>
      </div>
    );
  }
};

SimpleDatepicker.displayName = 'SimpleDatepicker';

SimpleDatepicker.propTypes = {
  label: PropTypes.string,
  error: PropTypes.bool,
  onChange: PropTypes.func,
  preselected: PropTypes.object,
  noYears: PropTypes.bool,
  noMonths: PropTypes.bool,
  noDays: PropTypes.bool,
};

export default SimpleDatepicker;
