/* eslint-disable import/no-unresolved */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'lodash';
import PropTypes from 'prop-types';
import FilmsList from '../components/shows/FilmsList';
import { Films } from '../../api/db/filmsdb';
import '../styles/films.css';

class FilmListWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.onSort = this.onSort.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  onSort(e) {
    const { sortData } = this.props;
    sortData(e.target.id);
  }

  onSearch(e) {
    const { searchData } = this.props;
    searchData(e.target.value);
  }

  render() {
    const { films } = this.props;
    return (
      <div className="FilmListTable">
        <input className="search" type="text" placeholder="search.." onChange={this.onSearch} />
        <span className="number"><b>№</b></span>
        <span className="poster"><b>Poster</b></span>
        <span className="title"><b>Title</b></span>
        <button className="sort" type="button" onClick={this.onSort}><b id="year">Year</b></button>
        <button className="sort" type="button" onClick={this.onSort}><b id="popularity">Popularity</b></button>
        <button className="sort" type="button" onClick={this.onSort}><b id="vote_average">Vote average</b></button>
        <FilmsList films={films} />
      </div>
    );
  }
}

export default withTracker((state) => {
  Meteor.subscribe('films');
  const sortfilms = _.orderBy(Films.find({}, { limit: state.pagination.limit }).fetch(), state.showsPage.sortFilter, 'desc');
  const films = sortfilms.filter(
    item => item.title.toLowerCase()
      .includes(state.showsPage.serchText
        .toLowerCase()),
  );
  return {
    films,
  };
})(FilmListWrapper);

FilmListWrapper.propTypes = {
  sortData: PropTypes.func.isRequired,
  searchData: PropTypes.func.isRequired,
  films: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
      posterPath: PropTypes.string.isRequired,
      popularity: PropTypes.number.isRequired,
      voteAverage: PropTypes.number.isRequired,
    }).isRequired,
  ).isRequired,
};
