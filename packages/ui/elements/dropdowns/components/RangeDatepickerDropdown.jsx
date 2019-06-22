import PropTypes from 'prop-types';
// TODO: finish ES6 conversion

import React, { Component } from 'react'; // eslint-disable-line
// import classNames from 'classnames';
import moment from 'moment-timezone';

const RangeDatepickerDropdown = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false,
      text: '',
      initialText: '',
      selectedRange: (() => {
        if (this.props.selectedRange) {
          return this.props.selectedRange;
        }
        return {
          startDate: moment()
            .subtract(30, 'days')
            .startOf('day'),
          endDate: moment()
            .endOf('day'),
          selectedTab: this.ranges.month,
        };
      })(),
    };
  }
};

RangeDatepickerDropdown.displayName = 'RangeDatepickerDropdown';

RangeDatepickerDropdown.propTypes = {
  selectedRange: PropTypes.obj,
};

export default RangeDatepickerDropdown;
