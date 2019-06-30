/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Films } from './db/filmsdb';

const { settings } = Meteor;
const {
  url, traktApiKey, tmdbUrl, tmdbApiKey, imgUrl,
} = settings;

const myHeaders = {
  'Content-Type': 'application/json',
  'trakt-api-version': '2',
  'trakt-api-key': traktApiKey,
};

Meteor.methods({
  getData() {
    try {
      const data = HTTP.call('GET', url, {
        headers: myHeaders,
      });
      Meteor.call('getFromTMDB', data.data);
      return data.data;
    } catch (error) {
      throw new Meteor.Error('oops', 'something broke');
    }
  },
  getFromTMDB(filmsArray) {
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
  },
  getPage(page) {
    try {
      const pageUrl = `${url}?page=${page}`;
      const film = HTTP.call('GET', pageUrl, {
        headers: myHeaders,
      });
      const { data } = film;
      Meteor.call('getFromTMDB', data);
    } catch (error) {
      throw new Meteor.Error('oops', 'something broke');
    }
  },
});
