import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames'; // eslint-disable-line
import moment from 'moment';
import ReactDatepicker from 'ff-react-daterange-picker';
import 'ff-react-daterange-picker/dist/css/react-calendar.css';
import SimpleDate, { MONTH } from '../../formatters/SimpleDate'; // eslint-disable-line

/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-prop-types */

const InputDatepicker = class extends Component {

  constructor (props) {
    super(props);
    this.state = {
      active: false,
      value: null,
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.showCalendar = this.showCalendar.bind(this);
    this.hideCalendar = this.hideCalendar.bind(this);
  }

  showCalendar () {
    this.setState({ active: true });
  }

  hideCalendar () {
    this.setState({ active: false });
  }

  handleSelect (value) {
    this.setState({
      value: value.format('MMM D, YYYY'),
      active: false,
    });
    this.props.onChange(value);
  }

  render () {
    let inputValue = '';
    let dropdown;
    let format = 'MMM D YYYY';
    if (this.props.noDay) {
      format = 'MMM YYYY';
    }
    let selectedDate = moment();
    if (this.props.preselected && this.props.preselected.isValid()) {
      inputValue = this.props.preselected.format(format);
      selectedDate = this.props.preselected;
    }
    if (this.state.active) {
      dropdown =
        (<div>
          <div className="closer" onClick={this.hideCalendar} />
          <div className="rangeDatepicker__calendar">
            <ReactDatepicker
              firstOfWeek={0}
              numberOfCalendars={1}
              selectionType="single"
              singleDateRange
              value={selectedDate}
              maximumDate={new Date()}
              onSelect={this.handleSelect}
            />
          </div>
        </div>);
    }
    return (
      <div className="rangeDatepicker -input">
        <input
          className="form__input rangeDatepicker__input"
          type="text"
          value={inputValue}
          onClick={this.showCalendar}
        />
        {dropdown}
      </div>
    );
  }
};

InputDatepicker.displayName = 'InputDatepicker';

InputDatepicker.propTypes = {
  preselected: PropTypes.object,
  selectors: PropTypes.array,
  onChange: PropTypes.func,
};

export default InputDatepicker;
