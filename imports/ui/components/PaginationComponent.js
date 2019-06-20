/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';

const PaginationComponent = ({ loadMore, currentPage }) => (
  <div className="">
    <span className="loadMoreBtn" onClick={() => { loadMore(currentPage); }}>Load More</span>
  </div>
);

export default PaginationComponent;
