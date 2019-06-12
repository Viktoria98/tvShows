/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { methods } from '../../api/methods';
import FilmListWrapper from './shows/FilmListWrapper';

let filmList = [];

let myHeaders = new Headers({
  'Content-Type': 'application/json',
  'trakt-api-version': '2',
  'trakt-api-key': '9ac61bf7e1b7fff10d7fdb05559dbbeaa671b5bc1d14cc8e69a385b422dcdf4d',
});

url = 'https://api.trakt.tv/movies/popular';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }


  componentDidMount() {
    fetch(url, {
      headers: myHeaders
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      this.setState({data})
    }
    )
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
