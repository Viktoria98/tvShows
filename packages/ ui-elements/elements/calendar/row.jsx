import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import Block from './block.jsx';
import Task from './task.jsx';

import DndTask from './dnd/dndTask.jsx';
import DndBlock from './dnd/dndBlock.jsx';

const CalendarRow = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};

    this.blocks = {};
    this.formatBlockId = 'MMM-D-YYYY';

    this.blockWidth = 150;
    this.updateBlockSlot = this.updateBlockSlot.bind(this);
    this.checkBlockAvalability = this.checkBlockAvalability.bind(this);
  }

  resetBlocks () {
    this.blocks = {};
  }

  checkBlockAvalability (key) {
    return Object.keys(this.blocks[key].slots).length < 4;
  }

  updateBlock (key, args) {
    this.blocks[key] = {
      ...this.blocks[key],
      ...args,
    };
  }

  updateBlockSlot (key, index, value) {
    this.updateBlock(key, {
      slots: {
        ...this.blocks[key].slots,
        [index]: value,
      },
    });
  }

  render () {
    const rendertasks = () => {
      const sortAsc = (a, b) => a.startDate.valueOf() > b.startDate.valueOf();
      const buildTaskStyles = (config, data) => {
        let styles = {};
        if (!config || !data) {
          return {};
        }

        Object.keys(config)
          .forEach((key) => {
            const propValue = data[key];

            if (propValue) {
              const stylesFromConfig = get(config, `${key}.${propValue}`) || {};

              styles = {
                ...styles,
                ...stylesFromConfig,
              };
            }
          });

        return styles;
      };

      const {
        data, dates, period, rowId, customTaskStylesConfig,
      } = this.props;

      return data.map((task) => {
        const customTaskStyles = buildTaskStyles(customTaskStylesConfig, task);
        return (
          <DndTask
            key={`${task.data.title}_task`}
            componentProps={{
              customTaskStyles,
              task,
              blocks: this.blocks,
              blockWidth: this.blockWidth,
              updateBlockSlot: this.updateBlockSlot,
              period,
              formatQuery: this.formatBlockId,
              rowId,
            }}
          />
        );
      });
    };

    const renderBlocks = () => {
      const {
        dates, assignee, callbacks, rowId, period,
      } = this.props;

      return dates.map((date, i) => {
        const formattedDate = date.format(this.formatBlockId);

        this.updateBlock(formattedDate, {
          start: i * this.blockWidth,
          index: i,
          slots: {},
        });

        return (
          <DndBlock
            key={`${formattedDate}_block`}
            id={formattedDate}
            dropCb={callbacks.updateTaskEntity}
            checkBlockAvalability={this.checkBlockAvalability}
            rowId={rowId}
            componentProps={{
              date,
              assignee,
              period,
            }}
          />
        );
      });
    };

    this.resetBlocks();
    const blocks = renderBlocks();
    const tasks = rendertasks();
    // global.console.log(this.blocks);

    return (
      <div className="row">
        {blocks}
        {tasks}
      </div>
    );
  }
};

CalendarRow.propTypes = {
  dates: PropTypes.array,
  assignee: PropTypes.object,
  data: PropTypes.array,
  period: PropTypes.string,
  rowId: PropTypes.string,
};

CalendarRow.defaultProps = {
  data: [],
};

export default CalendarRow;
