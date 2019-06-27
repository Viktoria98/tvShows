import React from 'react';
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
