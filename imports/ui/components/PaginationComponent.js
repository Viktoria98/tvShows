/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
// import UI from 'meteor/ff:ui-elements';
// import UI from '../../../packages/ui-elements';

// const { Icon } = UI;
// console.log(Icon);

const PaginationComponent = ({ loadMore, currentPage }) => (
  <div className="">
    <button className="loadMoreBtn" onClick={() => { loadMore(currentPage); }}>Load More </button>
  </div>
);

export default PaginationComponent;
