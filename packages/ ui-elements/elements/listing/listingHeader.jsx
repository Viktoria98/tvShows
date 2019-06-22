import React from 'react';
import PropTypes from 'prop-types';

const ListingHeader = (props) => <div className="listing__header">{props.content}</div>;

ListingHeader.propTypes = {
  content: PropTypes.array,
};

export default ListingHeader;
