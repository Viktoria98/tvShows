import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

const CalendarBlock = (props) => (
  // const onClick = () => {
  //   global.console.warn(props.date, props.assignee);
  // }

  <div
    className={classNames('block', {
      '-highlight': props.highlight,
      '-today': props.date.isSame(moment(), props.period),
    })}
  />
);
CalendarBlock.propTypes = {
  date: PropTypes.object,
  assignee: PropTypes.object,
  highlight: PropTypes.bool,
};

export default CalendarBlock;
