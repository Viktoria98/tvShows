/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import FilmsList from './FilmsList';
import { Films } from '../../../api/db/filmsdb';
import { url } from '../../../startup/config';

import '../../styles/films.css';

class FilmListWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.onSort = this.onSort.bind(this);
  }

  componentDidMount() {
    const { fetchData } = this.props;
    fetchData();
  }

  onSort(e) {
    const { films, sortData } = this.props;
    sortData(e.target.id, films);
  }

  render() {
    const { films, sortedlist } = this.props;
    return (
      <div className="FilmListTableHeader">
        <span className="sort">Sort by: </span>
        <span className="sort" id='year' onClick={this.onSort}>Year</span>
        <span className="sort" id='popularity' onClick={this.onSort}>Popularity</span>
        <span className="sort" id='vote_average' onClick={this.onSort}>Vote average</span>
        { sortedlist[0] != undefined ? (
          <FilmsList films={sortedlist} />
        ) : (
          <FilmsList films={films} />
        )
        }
      </div>
    );
  }
}

export default withTracker(() => ({
  films: Films.find({}).fetch(),
}))(FilmListWrapper);
