/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import '../api/methods';

export function sortByColumn(filter) {
  return {
    type: 'SORT_ACTION',
    filter,
  };
}

export function search(text) {
  return {
    type: 'SEARCH_ACTION',
    text,
  };
}

export function fetchFilmsByPage(page) {
  return () => {
    Meteor.call('getPage', page, (error) => {
      if (error) {
        alert(error, error.reason);
      }
    });
  };
}

export function setPage(page) {
  return {
    type: 'SET_PAGE',
    page,
  };
}

export function loadMore(page) {
  return (dispatch) => {
    dispatch(fetchFilmsByPage(page + 1));
    dispatch(setPage(page));
  };
}
