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
  componentDidMount() {
    const { fetchData, films } = this.props;
    fetchData();
  }

  render() {
    const { films } = this.props;
    return (
      <div className="FilmListTableHeader">
        <FilmsList films={films} />
      </div>
    );
  }
}

export default withTracker(() => ({
  films: Films.find({}).fetch(),
}))(FilmListWrapper);
