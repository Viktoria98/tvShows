/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';


MyCollection = new Mongo.Collection('films');

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
