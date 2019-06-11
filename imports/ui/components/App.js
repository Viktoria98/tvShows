/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { methods } from '../../api/methods';
import FilmsList from './shows/FilmsList';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      films: [],
    };
  }

  render() {
    return(
    <div>
      <h1></h1>
    </div>
    );
  }
}

export default App;
