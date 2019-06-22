import React, { Component } from 'react';
import CellTooltip from '../tooltips/components/cellTooltip.jsx';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './avatars.styl';

const Avatars = (props) => {
  const {
    data, avatar, className, containerStyle, size,
  } = props;
  let containerStyleEx = containerStyle;
  let personInitials;
  let content;

  if (size && size >= 1) {
    containerStyleEx = {
      ...containerStyleEx,
      width: size,
      height: size,
      lineHeight: `${size}px`,
      fontSize: `${size / 2}px`,
    };
  }

  if (avatar) {
    content = <img style={containerStyleEx} src={avatar} alt={data} className="cell-tooltip img" />;
  } else {
    if (data) {
      personInitials = data
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase();
    }
    content = personInitials ? (
      <CellTooltip
        visibleStyle={props.bodyStyle}
        visible={personInitials}
        containerStyle={containerStyleEx}
      >
        {data}
      </CellTooltip>
    ) : (
      ''
    );
  }

  return <div className={classNames('avatar', className)}>{content}</div>;
};

Avatars.propTypes = {
  data: PropTypes.string,
  bodyStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  size: PropTypes.number,
};

Avatars.defaultProps = {
  containerStyle: {},
};

export default Avatars;
