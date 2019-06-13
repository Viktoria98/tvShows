/* eslint-disable import/no-unresolved */
import { connect } from 'react-redux';
import { getDataAction } from '../../actions/getDataAction';
import FilmListWrapper from '../components/shows/FilmListWrapper';

const mapDispatchToProps = dispatch => ({
  fetchData: () => {
    dispatch(getDataAction());
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(FilmListWrapper);
