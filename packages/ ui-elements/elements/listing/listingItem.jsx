import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ListingItem = (props) => {
  const {
    content, isSelected, highlightRow, onClick, onDoubleClick, bold,
  } = props;

  let expiredClass = '';
  const style = {};
  if (highlightRow) {
    style.backgroundColor = highlightRow.bg;
    expiredClass = highlightRow.class;
  }

  return (
    <div
      id={props.id}
      className={classNames('listing__item', expiredClass, {
        '-selected': isSelected,
        '-bold': bold,
      })}
      style={style}
    >
      {content}
    </div>
  );
};

ListingItem.propTypes = {
  content: PropTypes.array,
  isSelected: PropTypes.bool,
  highlightRow: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default ListingItem;
