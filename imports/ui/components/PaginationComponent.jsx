import React from 'react';
import PropTypes from 'prop-types';
// import UI from 'meteor/ff:ui-elements';
// import UI from '../../../packages/ui-elements';

// const { Icon } = UI;
// console.log(Icon);

const PaginationComponent = ({ loadMore, currentPage }) => (
  <div>
    <button className="loadMoreBtn" type="button" onClick={() => { loadMore(currentPage); }}>Load More </button>
  </div>
);

PaginationComponent.propTypes = {
  currentPage: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
};

export default PaginationComponent;
