import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Avatar from '../avatars/avatars.jsx';

const CalendarAssignee = (props) => {
  const name = _.get(props, 'data.name');
  const avatar = _.get(props, 'data.avatar');
  const bodyStyle = {
    fontSize: 45,
    lineHeight: '68px',
  };
  const containerStyle = {
    width: 80,
    height: 80,
  };

  return (
    <div className="assignee">
      <Avatar data={name} bodyStyle={bodyStyle} avatar={avatar} containerStyle={containerStyle} />
    </div>
  );
};

CalendarAssignee.propTypes = {
  data: PropTypes.object,
};

export default CalendarAssignee;
