import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import CustomDragLayer from './dnd/dragLayer.jsx';
import classNames from 'classnames';

import momentHelper from './helpers/moment.js';
import config from './configs/calendarConfig.js';

import Row from './row.jsx';
import Assignee from './assignee.jsx';
import Dropdown from '../dropdowns/contentDropdowns/dropdown.jsx';

import './calendar.styl';

const Calendar = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      scrollLeft: 0,
      clientWidth: 0,
      scrollTop: 0,
      clientHeight: 0,
      dates: [],
    };

    this.defaultJumpTo = 0;
    this.dateRangeProps = {
      pastBorder: 150,
      futureBorder: 150,
    };
    this.readyToInteract = false;
    this.today = moment();
    this.headerDateFormatStr = 'MMM D';

    this.calculateContainerHeight = this.calculateContainerHeight.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentWillMount () {
    this.updateDates(this.props.period);
  }

  componentDidMount () {
    this.calculateContainerHeight();
    window.addEventListener('resize', this.calculateContainerHeight);
    this.setState({
      clientWidth: this.calendarBody.clientWidth,
      clientHeight: this.calendarBody.clientHeight,
      scrollLeft: this.defaultJumpTo,
    });
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.calculateContainerHeight);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.period !== this.props.period) {
      this.updateDates(nextProps.period);
    }
  }

  componentDidUpdate () {
    if (
      !this.readyToInteract &&
      this.calendarBody.scrollWidth === this.state.dates.length * this.props.blockSize.width
    ) {
      this.readyToInteract = true;
      this.calendarBody.scrollLeft = this.defaultJumpTo;
      this.calendarHeader.scrollLeft = this.defaultJumpTo;
    }
  }

  calculateWholeRange (period) {
    return momentHelper.calculateDateRange({
      start: moment()
        .subtract(this.dateRangeProps.pastBorder, period),
      end: moment()
        .add(this.dateRangeProps.futureBorder, period),
      period,
      config,
    });
  }

  calculateDefaultJumpProps (dates) {
    const { blockSize, period } = this.props;
    const defaultJumpIndex = dates.findIndex((date) => date.isSame(this.today, period));
    return (defaultJumpIndex - 1) * blockSize.width;
  }

  updateDates (period) {
    const dates = this.calculateWholeRange(period);
    this.defaultJumpTo = this.calculateDefaultJumpProps(dates);
    this.setState({
      dates,
    });
  }

  calculateContainerHeight () {
    // const bottomMargin = 95;
    const bottomMargin = 65;
    const height = window.innerHeight - this.calendarBody.offsetTop - bottomMargin;

    this.calendarBody.style.maxHeight = `${height}px`;
    this.calendarBody.style.minHeight = `${height}px`;
  }

  onScroll (e) {
    const { scrollLeft, scrollTop } = this.state;

    // header horizontal movement
    const left = e.target.scrollLeft;
    if (scrollLeft !== left) {
      this.calendarHeader.scrollLeft = left;

      this.setState({
        scrollLeft: left,
        clientWidth: this.calendarBody.clientWidth,
      });
    }

    // assignees bar vertical movement
    const top = e.target.scrollTop;
    if (scrollTop !== top) {
      this.assigneesBar.style.top = `-${top}px`;

      this.setState({
        scrollTop: top,
        clientHeight: this.calendarBody.clientHeight,
      });
    }

    // TODO: check why scrollTop doesn't work
    // old code with scrollTop assignment
    // const top = e.target.scrollTop;
    // if (scrollTop !== top) {
    //   // this.assigneesBar.style.top = `-${top}px`;
    //   // this.scrollTop = top;
    //   this.assigneesBar.scrollTop = top;
    //   this.setState({
    //     scrollTop: top,
    //     clientHeight: this.calendarBody.clientHeight,
    //   });
    // }
  }

  calculateRange (args) {
    let {
      offset, size, sizeProp, overRender,
    } = args;
    overRender = overRender || 1;
    const { blockSize } = this.props;
    const blocksInViewport = Math.floor(size / blockSize[sizeProp]);

    const first = Math.floor(offset / blockSize[sizeProp]);
    const last = blocksInViewport + first + overRender;
    return {
      first,
      last,
    };
  }

  render () {
    const renderDates = (args) => {
      const { first, last, coords } = args;
      const { period } = this.props;
      const { dates } = this.state;

      const datesToRender = dates.slice(first, last)
        .map((date) => {
          const isToday = this.today.isSame(date, period);
          const dateStr = isToday ? config[period].isNowStr : date.format(this.headerDateFormatStr);
          return (
            <div
              className={classNames('date', {
                '-past': date.isBefore(this.today),
                '-today': isToday,
                '-future': date.isAfter(this.today),
              })}
              key={`${dateStr}_date`}
            >
              {dateStr}
            </div>
          );
        });

      return (
        <div
          style={{
            ...coords,
            boxSizing: 'border-box',
            display: 'flex',
          }}
        >
          {datesToRender}
        </div>
      );
    };

    const renderAssigneesList = (args) => {
      const { first, last, coords } = args;
      const { assignees } = this.props;

      const assigneesList = Object.values(assignees)
        .slice(first, last)
        .map((assignee) => <Assignee key={`${assignee.id}_assignee`} data={assignee} />);

      return (
        <div
          ref={(assigneesBar) => (this.assigneesBar = assigneesBar)}
          className="timeline__assignees-list"
          style={{
            ...coords,
            boxSizing: 'border-box',
          }}
        >
          {assigneesList}
        </div>
      );
    };

    const renderTimeline = (args) => {
      const { x, y } = args;
      const {
        assignees, period, data, callbacks, customTaskStylesConfig,
      } = this.props;
      const { dates } = this.state;

      const startDate = dates[x.first];
      const endDate = dates[x.last - 1];

      const rows = Object.values(assignees)
        .slice(y.first, y.last)
        .map((assignee) => {
          const filteredData = _.isArray(data[assignee.id])
            ? data[assignee.id].filter((item) => {
              const itemEndDate = item.startDate.clone()
                .add(...item.duration);
              const taskIsInRenderRange =
                  item.startDate.isBetween(startDate, endDate) ||
                  itemEndDate.isBetween(startDate, endDate);
              const taskOverlapsRenderRange =
                  item.startDate.isBefore(startDate) && itemEndDate.isAfter(endDate);

              return taskIsInRenderRange || taskOverlapsRenderRange;
            })
            : [];

          return (
            <Row
              key={`${assignee.id}_timeline`}
              customTaskStylesConfig={customTaskStylesConfig}
              rowId={assignee.id}
              data={filteredData}
              callbacks={callbacks}
              assignee={assignee}
              dates={dates.slice(x.first, x.last)}
              period={period}
            />
          );
        });

      return (
        <div
          style={{
            ...x.coords,
            ...y.coords,
          }}
          className="timeline__rows-list"
        >
          {rows}
          <CustomDragLayer scrollLeft={this.state.scrollLeft} />
        </div>
      );
    };

    const {
      period, changePeriod, blockSize, assignees,
    } = this.props;
    const { dates } = this.state;

    const horizontalRange = this.calculateRange({
      offset: this.state.scrollLeft,
      size: this.state.clientWidth, // can be replaced with ref
      sizeProp: 'width',
    });
    const horizontalContainerArgs = {
      ...horizontalRange,
      coords: {
        width: dates.length * blockSize.width,
        paddingLeft: horizontalRange.first * blockSize.width,
      },
    };

    const verticalRange = this.calculateRange({
      offset: this.state.scrollTop,
      size: this.state.clientHeight,
      sizeProp: 'height',
      overRender: 2,
    });
    const verticalContainerArgs = {
      ...verticalRange,
      coords: {
        height: Object.keys(assignees).length * blockSize.height,
        paddingTop: verticalRange.first * blockSize.height,
      },
    };

    const datesList = renderDates(horizontalContainerArgs);
    const assigneesList = renderAssigneesList(verticalContainerArgs);
    const timeline = renderTimeline({
      x: horizontalContainerArgs,
      y: verticalContainerArgs,
    });

    return (
      <div className="calendar">
        <div className="calendar__header" ref={(header) => (this.calendarHeader = header)}>
          {datesList}
        </div>
        <div
          className="calendar__body --helpers-custom-scrollbar"
          ref={(body) => (this.calendarBody = body)}
          onScroll={this.onScroll}
        >
          {assigneesList}
          {timeline}
        </div>
        <div className="calendar__corner">
          <Dropdown
            options={[{ text: 'Day', value: 'day' }, { text: 'Week', value: 'week' }]}
            btnText={period}
            cb={changePeriod}
          />
        </div>
      </div>
    );
  }
};

Calendar.propTypes = {
  data: PropTypes.object,
  assignees: PropTypes.object,
  period: PropTypes.string,
  blockSize: PropTypes.object,
};

Calendar.defaultProps = {
  assignees: {},
  data: {},
  blockSize: {},
};

export default DragDropContext(HTML5Backend)(Calendar);
