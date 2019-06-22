/* eslint-disable react/prop-types */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import RangeDatepickerDual from '../datepickers/rangeDatepickerDual.jsx';
import SimpleDate from '../../formatters/SimpleDate'; // eslint-disable-line

const FormDatepicker = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false,
      value: props.value ? props.value.label : null,
      dateObj: this.createDateObj(props.value),
    };
    this.showDatepicker = this.showDatepicker.bind(this);
    this.hideDatepicker = this.hideDatepicker.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value ? nextProps.value.label : null,
        dateObj: this.createDateObj(nextProps.value),
      });
    }
  }

  createDateObj (value) {
    return value ? {
      startDate: value.startDate,
      endDate: value.endDate,
      selectedTab: value.selectedTab,
    } : null;
  }

  showDatepicker (e) {
    e.stopPropagation();
    this.setState({ open: true });
    document.addEventListener('click', this.hideDatepicker, false);
  }

  hideDatepicker () {
    const domNode = ReactDOM.findDOMNode(this);
    if ((!domNode || !domNode.contains(event.target))) {
      this.setState({ open: false });
      document.removeEventListener('click', this.hideDatepicker, false);
    }
  }

  handleChange (val, obj) {
    const value =
      `${obj.startDate.format('ddd MMM D, YYYY')
      } - ${
      obj.endDate.format('ddd MMM D, YYYY')}`;
    this.props.onChange(val, obj);
    this.setState({ open: true, value, dateObj: obj });
  }

  reset () {
    this.setState({ open: false, value: null, dateObj: null });
    this.props.onChange(this.props.name, undefined);
  }

  render () {
    let datepicker;

    if (this.state.open) {
      datepicker =
        (<RangeDatepickerDual
          ref="datepicker"
          onChange={this.handleChange}
          preselected={this.state.dateObj}
          noFutureLimit
          futureFixedRanges
        />);
    }
    return (
      <div
        id={this.props.id}
        className={
          classNames(
            'form__element form__autosuggest',
            this.props.className
          )
        }
      >
        <label>{this.props.label}</label>
        <div className="container">
          <input
            ref="input"
            type="text"
            placeholder={this.props.placeholder}
            value={this.state.value || ''}
            onClick={this.showDatepicker}
          />
          <span className="input__hint">{this.props.hint}</span>
          <div
            className={
              classNames(
                'input__reset',
                this.state.value ? '' : '--inactive'
              )
            }
            onClick={() => this.reset()}
          />
          {datepicker}
        </div>
      </div>
    );
  }
};

FormDatepicker.displayName = 'FormDatepicker';

FormDatepicker.propTypes = {

};

export default FormDatepicker;
