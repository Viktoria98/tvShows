/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { connect } from 'react-redux';
import { loadMore } from '../../actions/index';
import PaginationComponent from '../components/PaginationComponent';

const mapStateToProps = state => ({
  currentPage: state.pagination.currentPage,
});

const mapDispatchToProps = dispatch => ({
  loadMore: (currentPage) => {
    dispatch(loadMore(currentPage));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaginationComponent);
