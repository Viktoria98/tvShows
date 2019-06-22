import React from 'react';
import PropTypes from 'prop-types';

import './indicator.styl';

const Indicator = (props) => {
  const { active, type, color } = props;
  let content = <span />;

  if (!active) {
    return content;
  }

  switch (type) {
    case 'fill':
      content = (
        <div
          className={`indicator --${type}-type`}
          style={{
            backgroundColor: `#${color}`,
          }}
        />
      );
      break;
  }

  return content;
};

Indicator.propTypes = {
  type: PropTypes.string,
  color: PropTypes.string,
  active: PropTypes.bool,
};

export default Indicator;
