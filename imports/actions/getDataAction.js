/* eslint-disable import/no-unresolved */
// eslint-disable-next-line import/prefer-default-export
import { Meteor } from 'meteor/meteor';
import '../api/methods';

// eslint-disable-next-line import/prefer-default-export
export function getDataAction() {
  return () => {
    Meteor.call('getData');
    console.log('CALL');
  };
}
