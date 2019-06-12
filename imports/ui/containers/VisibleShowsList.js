/* eslint-disable import/no-unresolved */

import { connect } from 'react-redux';
import FilmListWrapper from '../components/shows/FilmListWrapper';
import { displayShowsFromDB } from '../../actions';


const mapStateToProps = state => ({
  films: state.films,
});

const mapDispatchToProps = dispatch => {
  return {
    films: films => {
      dispatch(displayShowsFromDB(films));
    }
  }
}

export default connect(
  mapStateToProps,
)(FilmListWrapper);
