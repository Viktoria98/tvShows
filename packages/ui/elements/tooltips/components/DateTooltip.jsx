/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-prop-types */

import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment-timezone'; // eslint-disable-line
import Format from '../../formatters/Format';
import Tooltip from './Tooltip';

const DateTooltip = (props) =>
  (<Tooltip
    visible={Format.date(props.date, props.userTimezone)}
    direction={props.direction || 'left'}
  >
    <dl>
      <dt className="bolded">{props.userCity || 'Your time'}</dt>
      <dd className="bolded">{Format.date(props.date, props.userTimezone)}</dd>
      <dt>San Francisco</dt><dd>{Format.date(props.date, 'America/Los_Angeles')}</dd>
      <dt>Toronto, New York</dt><dd>{Format.date(props.date, 'America/Toronto')}</dd>
      <dt>London</dt><dd>{Format.date(props.date, 'Europe/London')}</dd>
      <dt>Amsterdam</dt><dd>{Format.date(props.date, 'Europe/Amsterdam')}</dd>
      <dt>Bucharest</dt><dd>{Format.date(props.date, 'Europe/Bucharest')}</dd>
    </dl>
  </Tooltip>);

DateTooltip.displayName = 'DateTooltip';

DateTooltip.propTypes = {
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  displayFormat: PropTypes.string,
  direction: PropTypes.string,
};

export default DateTooltip;
