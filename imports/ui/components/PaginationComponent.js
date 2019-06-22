/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import UI from 'meteor/ff:ui-elements';

const { Icon } = UI;

const PaginationComponent = ({ loadMore, currentPage }) => (
  <div className="">
    <span className="loadMoreBtn" onClick={() => { loadMore(currentPage); }}></span>
  </div>
);

export default PaginationComponent;
