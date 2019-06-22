import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import StatInfo from './statInfo.jsx';

function Stat (props) {
  const info = _.map(
    props.info,
    (item, i) => <StatInfo key={i} name={item.name} value={item.value} />,
    this
  );

  return (
    <div className="statApp">
      <div className="statApp__name">{props.name}</div>
      {info}
    </div>
  );
}

Stat.displayName = 'Stat';

Stat.propTypes = {
  info: PropTypes.any,
  name: PropTypes.string,
};

export default Stat;
