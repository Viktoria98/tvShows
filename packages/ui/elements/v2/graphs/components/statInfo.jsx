import PropTypes from 'prop-types';
import React from 'react';

function StatInfo (props) {
  return (
    <div className="statApp__info">
      <div className="statApp__info__name">{props.name}</div>
      <div className="statApp__info__value">{props.value}</div>
    </div>
  );
}

StatInfo.displayName = 'StatInfo';

StatInfo.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
};

export default StatInfo;
