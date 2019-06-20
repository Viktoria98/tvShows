/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
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

  componentDidMount() {
    const { fetchData } = this.props;
    fetchData();
  }

  onSort(e) {
    const { sortData } = this.props;
    sortData(e.target.id);
  }

  onSearch(e) {
    console.log('onsearch');
    const { searchData } = this.props;
    searchData(e.target.value);
  }

  render() {
    const { films } = this.props;
    return (
      <div className="FilmListTableHeader">
        <span className="sort">Sort by: </span>
        <span className="sort" id="year" onClick={this.onSort}>Year</span>
        <span className="sort" id="popularity" onClick={this.onSort}>Popularity</span>
        <span className="sort" id="vote_average" onClick={this.onSort}>Vote average</span>
        <input type="text" placeholder="search.." onChange={this.onSearch} />
        <FilmsList films={films} />
      </div>
    );
  }
}

export default withTracker((state) => {
  const sortfilms = _.orderBy(Films.find({}).fetch(), state.showsPage.sortFilter, 'desc');
  const films = sortfilms.filter(item => item.title.toLowerCase().includes(state.showsPage.serchText));
  return {
    films,
  };
})(FilmListWrapper);
