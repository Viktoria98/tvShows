/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'lodash';
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
        <button className="sort" onClick={this.onSort}><b id="year">Year</b></button>
        <button className="sort" onClick={this.onSort}><b id="popularity">Popularity</b></button>
        <button className="sort" onClick={this.onSort}><b id="vote_average">Vote average</b></button>
        <FilmsList films={films} />
      </div>
    );
  }
}

export default withTracker((state) => {
  Meteor.subscribe('films');
  const sortfilms = _.orderBy(Films.find({}).fetch(), state.showsPage.sortFilter, 'desc');
  const films = sortfilms.filter(
    item => item.title.toLowerCase()
      .includes(state.showsPage.serchText
        .toLowerCase()),
  );
  return {
    films,
  };
})(FilmListWrapper);
