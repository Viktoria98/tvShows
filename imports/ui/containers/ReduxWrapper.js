/* eslint-disable import/no-unresolved */
import { connect } from 'react-redux';
import { getDataAction } from '../../actions/index';
import { sortByColumn } from '../../actions/index';
import { setInitialState } from '../../actions/index';
import { search } from '../../actions/index';
import FilmListWrapper from '../components/shows/FilmListWrapper';

const mapStateToProps = state => ({
  sortedlist: state.sortShows,
});

const mapDispatchToProps = dispatch => ({
  fetchData: () => {
    dispatch(getDataAction());
  },
  initialState: (list) => {
    dispatch(setInitialState(list));
  },
  sortData: (column, filmlist) => {
    dispatch(sortByColumn(column, filmlist));
  },
  searchData: (text) => {
    dispatch(search(text));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilmListWrapper);
