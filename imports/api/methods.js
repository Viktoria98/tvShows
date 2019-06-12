/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import {url, traktApiKey} from '../startup/config.js';
import { Films } from './db/filmsdb.js'

let myHeaders = new Headers({
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
          console.log(data);
          Meteor.call('insertToDB', data);
        });
    } catch (error) {
      throw new Meteor.Error('oops', 'something broke');
    }
  },
  insertToDB(array) {
    try {
      array.forEach((film) => {
        Films.insert(film);
      });
    } catch (error) {
      throw new Meteor.Error('oops', 'something broke');
    }
  },
});
