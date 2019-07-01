// import { setInitialState } from '../../actions/index';
import { connect } from 'react-redux';
import { sortByColumn, search } from '../../actions/index';
import FilmListWrapper from './FilmListWrapper';


const mapStateToProps = state => ({
  showsPage: state.showsPage,
  pagination: state.pagination,
});

const mapDispatchToProps = dispatch => ({
  // initialState: (list) => {
  //   dispatch(setInitialState(list));
  // },
  sortData: (filter) => {
    dispatch(sortByColumn(filter));
  },
  searchData: (text) => {
    dispatch(search(text));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilmListWrapper);
