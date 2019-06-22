/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Base from '../_dropdownBase';
import Datepicker from '../../datepickers/rangeDatepickerDual';
import SimpleDate from '../../../formatters/SimpleDate';

function getInitialLabel (preselected, selectors) {
  if (preselected.selectedTab === 'custom') {
    const s = SimpleDate.format(preselected.startDate, 'MMM D, YYYY');
    const e = SimpleDate.format(preselected.endDate, 'MMM D, YYYY');
    return `${s} - ${e}`;
  }
  for (const selector of selectors) {
    if (selector.value === preselected.selectedTab) {
      return selector.label;
    }
  }
  return 'No label';
}

const DatepickerDropdown = class extends Component {

  constructor (props) {
    super(props);
    this.state = {
      label: getInitialLabel(props.preselected, props.selectors),
    };
    this.updateLabel = this.updateLabel.bind(this);
    this.onDatepickerChange = this.onDatepickerChange.bind(this);
  }

  componentWillReceiveProps (props) {
    if (props.fromReport) {
      this.setState({ label: getInitialLabel(props.preselected, props.selectors) });
    }
  }

  onDatepickerChange (label, range) {
    this.updateLabel(label);
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(range);
    }
  }

  updateLabel (newLabel) {
    this.setState({ label: newLabel });
  }

  render () {
    let label;

    if (this.props.label) {
      label = (
        <label className="form__label">{this.props.label}</label>
      );
    }

    return (
      <div onClick={this.props.onOpenClose}>
        {label}
        <Base
          className="datepicker"
          buttonText={this.state.label}
          align="right"
        >
          <Datepicker
            preselected={this.props.preselected}
            selectors={this.props.selectors}
            updateLabel={this.updateLabel}
            onChange={this.onDatepickerChange}
            label={this.state.label}
            fromReport={this.props.fromReport}
          />
        </Base>
      </div>
    );
  }
};

DatepickerDropdown.displayName = 'DatepickerDropdown';

DatepickerDropdown.propTypes = {
  label: PropTypes.string,
  onOpenClose: PropTypes.func,
  onChange: PropTypes.func,
  preselected: PropTypes.oneOfType([
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

export default DatepickerDropdown;
