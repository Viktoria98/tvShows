/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import _ from 'lodash';
import { url, traktApiKey, tmdbUrl, tmdbApiKey, imgUrl } from '../startup/config.js';
import { Films } from './db/filmsdb.js';

const myHeaders = new Headers({
  'Content-Type': 'application/json',
  'trakt-api-version': '2',
  'trakt-api-key': traktApiKey,
});

Meteor.methods({
  getData() {
    try {
      fetch(url, {
        headers: myHeaders,
      })
        .then(response => response.json())
        .then((data) => {
          Meteor.call('getFromTMDB', data);
        });
    } catch (error) {
      throw new Meteor.Error('oops', 'something broke');
    }
  },
  getFromTMDB(filmsArray) {
    filmsArray.forEach((element) => {
      try {
        fetch(`${tmdbUrl}/${element.ids.tmdb}?api_key=${tmdbApiKey}`)
          .then(response => response.json())
          .then((data) => {
            element.poster_path = `${imgUrl}${data.poster_path}`;
            element.overview = data.overview;
            element.popularity = data.popularity;
            element.genres = data.genres;
            element.vote_average = data.vote_average;
            Films.insert(element);
          });
      } catch (error) {
        throw new Meteor.Error('oops', 'something broke');
      }
    });
    return filmsArray;
  },
  getPage(page) {
    try {
      fetch(`${url}?page=${page}`, {
        headers: myHeaders,
      })
        .then(response => response.json())
        .then((data) => {
          Meteor.call('getFromTMDB', data);
        });
    } catch (error) {
      throw new Meteor.Error('oops', 'something broke');
    }
  },
});
