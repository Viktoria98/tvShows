/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { methods } from '../../api/methods';
import FilmListWrapper from './shows/FilmListWrapper';
import { Films } from '../../api/db/filmsdb';
import VisibleShowsList from '../containers/VisibleShowsList';
import { displayShowsFromDB } from '../../actions';

class App extends React.Component {
  constructor(props) {
    super(props)

  }

  componentDidMount() {
    const { dispatch, films } = this.props;
    Meteor.call('getData');
    dispatch(displayShowsFromDB(films));
  }

  render() {
    return (
      <div>
        <VisibleShowsList />
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    films: Films.find({}).fetch(),
  };
})(App);
