import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './labels.styl';

const Label = (props) => {
  const { onDisable, value, className } = props;

  const onClick = () => {
    onDisable(value);
  };

  const renderDisableBtn = () => (
    <button className="label__btn-close" onClick={onClick} onKeyPress={onClick} />
  );

  const disableBtn = onDisable ? renderDisableBtn() : null;
  return (
    <span className={classNames('label', className)}>
      {value}
      {disableBtn}
    </span>
  );
};

Label.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  onDisable: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
};

Label.defaultProps = {
  className: '',
  onDisable: false,
};

export default Label;
