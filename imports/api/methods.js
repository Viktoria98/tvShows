/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';


MyCollection = new Mongo.Collection('films');

var request = new XMLHttpRequest();
var filmList = [];
request.open('GET', 'https://api.trakt.tv/movies/popular');

request.setRequestHeader('Content-Type', 'application/json');
request.setRequestHeader('trakt-api-version', '2');
request.setRequestHeader('trakt-api-key', '9ac61bf7e1b7fff10d7fdb05559dbbeaa671b5bc1d14cc8e69a385b422dcdf4d');

request.onreadystatechange = function () {
  if (this.readyState === 4) {
    console.log('Status:', this.status);
    filmList = this.responseText;
  }
};

request.send();

Meteor.methods({
  getData() {
    try {
      console.log(filmList);
      insertDB(filmList);
    } catch (error) {
      throw new Meteor.Error('oops', 'something broke');
    }
  },
  insertDB() {
    try {
      filmList.forEach(film => {
        Films.insert(film);
        console.log(Films);
      });
    } catch (error) {
      throw new Meteor.Error('oops', 'something broke');
    }
  },
});
