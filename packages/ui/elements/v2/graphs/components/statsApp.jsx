/* eslint-disable react/no-unused-prop-types */

import PropTypes from 'prop-types';
import React from 'react';
import _ from 'underscore';
import Stat from './stat';

function StatsApp (props) {
  const stats = _.map(
    props.data,
    (item, i) => <Stat key={i} name={item.name} info={item.info} />,
    this
  );

  return (
    <div className="statsApp">
      {stats}
    </div>
  );
}

StatsApp.displayName = 'StatsApp';

StatsApp.propTypes = {
  savedMetric: PropTypes.array,
  onChange: PropTypes.func,
  label: PropTypes.string,
  data: PropTypes.array,
};

export default StatsApp;
