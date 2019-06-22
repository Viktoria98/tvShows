import PropTypes from 'prop-types';
import React from 'react';
import _ from 'underscore';
import StatInfo from './statInfo';

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
