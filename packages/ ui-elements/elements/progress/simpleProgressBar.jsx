import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './progress.styl';

const SimpleProgressBar = (props) => {
  const { progress, className } = props;

  const style = {
    width: `${progress}%`,
  };

  return (
    <div className={classNames('simple-progress__wrapper', className)}>
      <div className="simple-progress__fill" style={style} />
    </div>
  );
};

SimpleProgressBar.propTypes = {
  progress: PropTypes.number,
};

export default SimpleProgressBar;
