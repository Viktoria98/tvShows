import React from 'react';
import PropTypes from 'prop-types';

const CalendarTaskDragPreview = (props) => (
  <div className="calendar__task-preview" style={props.coords}>
    {props.text}
  </div>
);

CalendarTaskDragPreview.propTypes = {
  text: PropTypes.string,
  coords: PropTypes.object,
};

export default CalendarTaskDragPreview;
