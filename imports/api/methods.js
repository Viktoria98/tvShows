/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import _ from 'lodash';
import { url, traktApiKey, tmdbUrl, tmdbApiKey, imgUrl } from '../startup/config.js';
import { Films } from './db/filmsdb.js';

Meteor.methods({
  getData() {
    try {
      const data = HTTP.call('GET', url, {
        headers: {
          'Content-Type': 'application/json',
          'trakt-api-version': '2',
          'trakt-api-key': traktApiKey,
        },
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
        const {data} = film;
        element.poster_path = `${imgUrl}${data.poster_path}`;
        element.popularity = data.popularity;
        element.vote_average = data.vote_average;
        Films.insert(element);
      } catch (error) {
        throw new Meteor.Error('oops', 'something broke');
      }
    });
  },
  getPage(page) {
    try {
      pageUrl = `${url}?page=${page}`;
      const film = HTTP.call('GET', pageUrl, {
        headers: {
          'Content-Type': 'application/json',
          'trakt-api-version': '2',
          'trakt-api-key': traktApiKey,
        },
      });
      const { data } = film;
      Meteor.call('getFromTMDB', data);
    } catch (error) {
      throw new Meteor.Error('oops', 'something broke');
    }
  },
});
