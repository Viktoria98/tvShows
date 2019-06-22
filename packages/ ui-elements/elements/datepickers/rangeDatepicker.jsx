import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import ReactDatepicker from 'ff-react-daterange-picker';
import 'ff-react-daterange-picker/dist/css/react-calendar.css';
import Moment from 'moment-timezone';
import { extendMoment } from 'moment-range';
import _ from 'lodash';
import './datepickers.styl';

const moment = extendMoment(Moment);

/*
  eslint class-methods-use-this: ["error", { "exceptMethods": ["rangeToObject", "computeText"] }]
*/

const RangeDatepicker = class extends Component {
  constructor (props) {
    super(props);

    let selectedTab = 'custom';

    if (props.tabs && props.tabs.length) {
      props.tabs.map((tab) => {
        if (
          moment(props.startDate)
            .isSame(tab.startDate) &&
          moment(props.endDate)
            .isSame(tab.endDate)
        ) {
          selectedTab = tab.label;
        }
        return true;
      });
    }

    this.state = {
      selectedTab,
      startDateOnly: false,
    };

    this.handleSelectStart = this.handleSelectStart.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  // prevent useless re-rendering which may cause problems with selecting date range
  shouldComponentUpdate (nextProps, nextState) {
    if (
      moment(nextProps.startDate)
        .isSame(this.props.startDate) &&
      moment(nextProps.endDate)
        .isSame(this.props.endDate) &&
      moment(nextProps.maximumDate)
        .isSame(this.props.maximumDate) &&
      moment(nextProps.minimumDate)
        .isSame(this.props.minimumDate) &&
      _.isEqual(nextProps.tabs, this.props.tabs) &&
      _.isEqual(nextState, this.state)
    ) {
      return false;
    }
    return true;
  }

  computeText (range) {
    const { startDate, endDate } = range;
    const dateFormat = 'MMM D, Y';
    const formattedStartDate = moment(startDate)
      .format(dateFormat);
    const formattedEndDate = moment(endDate)
      .format(dateFormat);

    return `${formattedStartDate} – ${formattedEndDate}`;
  }

  rangeToObject (range) {
    const datesArr = range.toDate();
    return { startDate: datesArr[0], endDate: datesArr[1] };
  }

  handleSelect (range) {
    const dateRange = this.rangeToObject(range);

    this.setState({ selectedTab: 'custom' });
    this.props.updateText(this.computeText(dateRange));
    this.props.onChange(dateRange);
  }

  handleSelectStart (date) {
    if (this.state.startDateOnly) {
      this.props.onChange({ startDate: date, endDate: this.props.endDate });
    }
  }

  handleTabClick (tab) {
    const { startDate, endDate, onChange } = this.props;

    if (tab.label === 'custom') {
      this.props.updateText(this.computeText({ startDate, endDate }));
    } else {
      this.props.updateText(tab.label);
    }

    this.setState(() => ({
      selectedTab: tab.label,
      startDateOnly: tab.startDateOnly,
    }));

    if (tab.label === 'custom') {
      return;
    }

    if ((tab.startDate || tab.startDate === null) && (tab.endDate || tab.endDate === null)) {
      onChange({ startDate: tab.startDate, endDate: tab.endDate });
    } else {
      onChange({ startDate, endDate });
    }
  }

  render () {
    const {
      startDate, endDate, maximumDate, minimumDate, singleCalendar,
    } = this.props;

    let fixedRanges;
    if (!_.isEmpty(this.props.tabs)) {
      const tabs = _.map(this.props.tabs, (tab, index) => (
        <li
          key={index}
          id={_.camelCase(tab.label)}
          className={classNames('rangeDatepicker__range', {
            '-active': this.state.selectedTab === tab.label,
          })}
          onClick={() => this.handleTabClick(tab)}
          onKeyPress={() => null}
          role="menuitem"
        >
          {tab.label}
        </li>
      ));

      fixedRanges = (
        <ul className="rangeDatepicker__ranges" role="menu">
          {tabs}
          <li
            className={classNames('rangeDatepicker__range -custom', {
              '-active': this.state.selectedTab === 'custom',
            })}
            onClick={() => this.handleTabClick({ label: 'custom' })}
            onKeyPress={() => null}
            role="menuitem"
          >
            Custom
          </li>
        </ul>
      );
    }

    return (
      <div
        id={this.props.id}
        className={classNames(
          'rangeDatepicker',
          { '-dual': !singleCalendar },
          { '-single': singleCalendar },
          this.props.className
        )}
      >
        {fixedRanges}
        <div className="rangeDatepicker__calendars">
          <ReactDatepicker
            ref={(ref) => {
              this.datepicker = ref;
            }}
            firstOfWeek={0}
            numberOfCalendars={singleCalendar ? 1 : 2}
            selectionType="range"
            singleDateRange
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            showLegend={false}
            value={moment.range(startDate, endDate)}
            onSelect={this.handleSelect}
            onSelectStart={this.handleSelectStart}
            showOtherMonthDays={false}
          />
        </div>
      </div>
    );
  }
};

RangeDatepicker.displayName = 'Datepicker';

RangeDatepicker.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  maximumDate: PropTypes.instanceOf(Date),
  minimumDate: PropTypes.instanceOf(Date),
  tabs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
  })),
  onChange: PropTypes.func,
  updateText: PropTypes.func,
  singleCalendar: PropTypes.bool,
};

RangeDatepicker.defaultProps = {
  id: 'datepicker-default-id',
  className: 'datepicker-default-className',
  startDate: new Date(),
  endDate: new Date(),
  maximumDate: null,
  minimumDate: null,
  tabs: [],
  onChange: () => null,
  updateText: () => null,
  singleCalendar: false,
};

export default RangeDatepicker;
