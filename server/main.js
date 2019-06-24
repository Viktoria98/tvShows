import { Meteor } from 'meteor/meteor';
import '../imports/api/methods';
import { Films } from '../imports/api/db/filmsdb';

Meteor.startup(() => {
  Films.remove({});
  Meteor.call('getData');

  if (Meteor.isServer) {
    Meteor.publish('films',
      () => Films.find());
  }
});
