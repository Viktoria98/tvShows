import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import momentHelper from './helpers/moment.js';
import config from './configs/calendarConfig.js';

import DndTaskResizer from './dnd/dndTaskResizer.jsx';

const CalendarTask = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  buildBlockKey (date) {
    const { period, formatQuery } = this.props;
    return period === 'day'
      ? date.format(formatQuery)
      : date
        .clone()
        .day(1)
        .format(formatQuery);
  }

  // TODO: probably move invocation to lifecycle
  findEmptySlot (blocks, dateRange, id, slot = 1) {
    for (const date of dateRange) {
      const key = this.buildBlockKey(date);
      const currentSlot = blocks[key] ? blocks[key].slots[slot] : null;

      if (currentSlot && currentSlot !== id) {
        return slot < 4 ? this.findEmptySlot(blocks, dateRange, id, slot + 1) : false;
      }
    }

    return slot;
  }

  render () {
    const {
      task, period, blocks, blockWidth, fade, rowId, customTaskStyles,
    } = this.props;

    const taskEndDate = task.startDate.clone()
      .add(...task.duration);
    const startDateKey = this.buildBlockKey(task.startDate);
    const endDateKey = this.buildBlockKey(taskEndDate);
    // const endDateKey = this.buildBlockKey(task.endDate);

    const taskDates = momentHelper.calculateDateRange({
      start: task.startDate,
      end: taskEndDate,
      // end: task.endDate,
      period,
      config,
    });

    const slot = this.findEmptySlot(blocks, taskDates, task.id);

    if (typeof slot === 'boolean' && slot == false) {
      console.warn('ERROR -- tried to render issue in 5th slot', task);
      return null;
    }

    taskDates.forEach((date) => {
      const key = this.buildBlockKey(date);
      if (blocks[key]) {
        this.props.updateBlockSlot(key, slot, task.id);
      }
    });

    let startBlock = blocks[startDateKey];
    let startOutOfRange = false;
    if (!startBlock) {
      startBlock = {
        start: 0,
        index: 0,
      };
      startOutOfRange = true;
    }

    let endBlock = blocks[endDateKey];
    let endOutOfRange = false;
    if (!endBlock) {
      endBlock = {
        index: Object.keys(blocks).length - 1,
      };
      endOutOfRange = true;
    }

    const halfBlockWidth = !endOutOfRange ? blockWidth / 2 : 0;
    const style = {
      top: slot * 27,
      left: startBlock.start,
      width: (endBlock.index - startBlock.index + 1) * blockWidth - halfBlockWidth,
      opacity: fade ? 0.5 : false,
      ...customTaskStyles,
    };

    return (
      <div
        key={task.id}
        style={style}
        className={classNames('calendar__task', {
          '-start-out-of-range': startOutOfRange,
          '-end-out-of-range': endOutOfRange,
        })}
        ref={(task) => (this.task = task)}
      >
        <b>#p{task.priority} </b>
        {task.data.title}
        <DndTaskResizer task={task} rowId={rowId} customTaskStyles={customTaskStyles} />
      </div>
    );
  }
};

CalendarTask.propTypes = {
  data: PropTypes.object,
  blocks: PropTypes.object,
  blockWidth: PropTypes.number,
  period: PropTypes.string,
  formatQuery: PropTypes.string,
  fade: PropTypes.bool,
  rowId: PropTypes.string,
  customTaskStyles: PropTypes.object,
};

export default CalendarTask;
