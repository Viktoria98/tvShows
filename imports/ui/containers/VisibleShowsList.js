/* eslint-disable import/no-unresolved */

import { connect } from 'react-redux';
import FilmsList from '../components/shows/FilmsList';
import { VisibilityFilters } from '../../actions';

const getVisibleFilms = (films, filter) => {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return films;
    default:
      throw new Error(`Unknown filter: ${filter}`);
  }
};

const mapStateToProps = state => ({
  films: getVisibleFilms(state.films, state.visibilityFilter),
});

export default connect(
  mapStateToProps,
)(FilmsList);
