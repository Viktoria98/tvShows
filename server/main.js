/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { getData } from '../imports/api/methods';
import { Films } from '../imports/api/db/filmsdb';

Meteor.startup(() => {
  Films.remove({});
  getData();

  if (Meteor.isServer) {
    Meteor.publish('films',
      () => Films.find());
  }
});
