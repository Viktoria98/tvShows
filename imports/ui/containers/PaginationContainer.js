/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { connect } from 'react-redux';
import { loadMore } from '../../actions/index';
import PaginationComponent from '../components/PaginationComponent';


const mapDispatchToProps = dispatch => ({
  loadMore: () => {
    dispatch(loadMore());
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(PaginationComponent);
