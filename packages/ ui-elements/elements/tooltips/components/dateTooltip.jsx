import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import CellTooltip from './cellTooltip';

const DateTooltip = ({ date, visible }) => {
  const formatDate = (zone) => {
    let d = moment(date);
    if (zone) {
      d = d.tz(zone);
    }
    return d.format('h:mma ddd MMM D, YYYY');
  };

  return (
    <CellTooltip visible={visible}>
      <div className="date-tooltip">
        <div className="date-zone">
          <b>Your time</b>
        </div>
        <div className="date-time">
          <b>{formatDate()}</b>
        </div>
        <div className="date-zone">UTC</div>
        <div className="date-time">{formatDate('UTC')}</div>
        <div className="date-zone">San Francisco</div>
        <div className="date-time">{formatDate('America/Los_Angeles')}</div>
        <div className="date-zone">Toronto, New York</div>
        <div className="date-time">{formatDate('America/Toronto')}</div>
        <div className="date-zone">London</div>
        <div className="date-time">{formatDate('Europe/London')}</div>
        <div className="date-zone">Amsterdam</div>
        <div className="date-time">{formatDate('Europe/Amsterdam')}</div>
        <div className="date-zone">Bucharest</div>
        <div className="date-time">{formatDate('Europe/Bucharest')}</div>
      </div>
    </CellTooltip>
  );
};

DateTooltip.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  visible: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
};

export default DateTooltip;
