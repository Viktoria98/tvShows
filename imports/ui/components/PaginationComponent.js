/* eslint-disable react/jsx-filename-extension */
import React from 'react';

const PaginationComponent = ({ loadMore }) => (
  <div className="">
    <span onClick={ loadMore }>Load More</span>
  </div>
);

export default PaginationComponent;
