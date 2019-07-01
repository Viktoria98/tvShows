/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Films } from './db/filmsdb';

// const { settings } = Meteor;
// const {
//   url, traktApiKey, tmdbUrl, tmdbApiKey, imgUrl,
// } = settings;

const url = 'https://api.trakt.tv/movies/popular';
const traktApiKey = '9ac61bf7e1b7fff10d7fdb05559dbbeaa671b5bc1d14cc8e69a385b422dcdf4d';
const tmdbApiKey = '2ed8048b26045f118396d8a886f19401';
const tmdbUrl = 'https://api.themoviedb.org/3/movie';
const imgUrl = 'https://image.tmdb.org/t/p/w200';


const myHeaders = {
  'Content-Type': 'application/json',
  'trakt-api-version': '2',
  'trakt-api-key': traktApiKey,
};

export const getData = () => {
  try {
    const data = HTTP.call('GET', url, {
      headers: myHeaders,
    });
    getFromTMDB(data.data);
    return data.data;
  } catch (error) {
    throw new Meteor.Error('oops', 'something broke');
  }
};

const getFromTMDB = (filmsArray) => {
  filmsArray.forEach((element) => {
    try {
      const posterUrl = `${tmdbUrl}/${element.ids.tmdb}?api_key=${tmdbApiKey}`;
      const film = HTTP.call('GET', posterUrl);
      const { data } = film;
      element.posterPath = `${imgUrl}${data.poster_path}`;
      element.popularity = data.popularity;
      element.voteAverage = data.vote_average;
      Films.insert(element);
    } catch (error) {
      throw new Meteor.Error('oops', 'something broke');
    }
  });
};

const getPage = (page) => {
  if (Films.find({}).count() / 10 < page) {
    try {
      const pageUrl = `${url}?page=${page}`;
      const film = HTTP.call('GET', pageUrl, {
        headers: myHeaders,
      });
      const { data } = film;
      getFromTMDB(data);
    } catch (error) {
      throw new Meteor.Error('oops', 'something broke');
    }
  }
};

Meteor.methods({
  'getData' : () => getData(),
  'getFromTMDB' : (filmsArray) => getFromTMDB(filmsArray),
  'getPage' : (page) => getPage(page),
});
