import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Tooltip from '../tooltips/components/dateTooltip.jsx';

// Set new thresholds
moment.relativeTimeThreshold('ss', 45);
moment.relativeTimeThreshold('s', 60);
moment.relativeTimeThreshold('m', 60);
moment.relativeTimeThreshold('h', 24);
moment.relativeTimeThreshold('d', 30);
moment.relativeTimeThreshold('M', 12);

moment.updateLocale('en', {
  relativeTime: {
    future: (str) => (parseFloat(str) ? 'in ' : '') + str,
    past: (str) => str + (parseFloat(str) ? ' ago' : ''),
    s: 'Right now',
    ss: 'Right now',
    m: (number, withoutSuffix, key, isFuture) => (isFuture ? 'Today' : '1m'),
    mm: (number, withoutSuffix, key, isFuture) => (isFuture ? 'Today' : `${number}m`),
    h: (number, withoutSuffix, key, isFuture) => (isFuture ? 'Today' : '1h'),
    hh: (number, withoutSuffix, key, isFuture) => (isFuture ? 'Today' : `${number}h`),
    d: (number, withoutSuffix, key, isFuture) => (isFuture ? 'Tomorrow' : 'Yesterday'),
    dd: (number, withoutSuffix, key, isFuture) =>
      (!isFuture && number < 7
        ? moment()
          .subtract(number, 'days')
          .format('ddd')
        : `${number}d`),
    M: '1mo',
    MM: '%dmo',
    y: '1y',
    yy: '%dy',
  },
});

const RelativeTime = ({ value, showTimeTooltip }) => {
  if (!(value && moment(value)
    .isValid())) {
    // eslint-disable-line
    return null;
  }

  const convertedTime = moment()
    .to(value);

  let element = <div className="relative-time">{convertedTime}</div>;

  if (showTimeTooltip) {
    element = <Tooltip visible={element} date={value} />;
  }

  return element;
};

RelativeTime.propTypes = {
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string, PropTypes.number]),
  showTimeTooltip: PropTypes.bool,
};

RelativeTime.defaultProps = {
  value: 0,
  showTimeTooltip: false,
};

export default RelativeTime;
