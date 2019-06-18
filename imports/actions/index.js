/* eslint-disable import/no-unresolved */
// eslint-disable-next-line import/prefer-default-export
import { Meteor } from 'meteor/meteor';
import '../api/methods';

// eslint-disable-next-line import/prefer-default-export
export function getDataAction() {
  return () => {
    Meteor.call('getData');
  };
}

export function setInitialState(list) {
  return {
    type: 'SET_INITIAL_STATE',
    list,
  };
}

export function sortByColumn(column) {
  return {
    type: 'SORT_ACTION',
    column,
  };
}

export function search(text) {
  return {
    type: 'SEARCH_ACTION',
    text,
  };
}

export function loadMore() {
  console.log('LOAD');
  return {
    type: 'LOAD_MORE_ACTION',
  };
}
