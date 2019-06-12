/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { methods } from '../../api/methods';
import FilmListWrapper from './shows/FilmListWrapper';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }


  componentDidMount() {
    Meteor.call('getData');
  }

  render() {
    return(
    <div>
      <FilmListWrapper films={this.state.data} />
    </div>
    );
  }
}

export default App;
