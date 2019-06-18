/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import ReduxWrapper from '../containers/ReduxWrapper';
import PaginationContainer from '../containers/PaginationContainer';

class App extends React.Component {
  render() {
    return (
      <div>
        <ReduxWrapper />
        <PaginationContainer />
      </div>
    );
  }
}

export default App;
