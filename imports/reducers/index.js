/* eslint-disable import/no-unresolved */
import { combineReducers } from 'redux';
import { _ } from 'lodash';

function sortShows(state = [], action) {
  switch (action.type) {
    case 'SET_INITIAL_STATE':
      return [
        ...action.list,
      ];
    case 'SORT_ACTION':
      return _.orderBy(state, action.column, 'desc');
    case 'SEARCH_ACTION':
      return state.filter((elem) => {
        return elem.title.toLowerCase().includes(action.text.toLowerCase());
      });
    default:
      return state;
  }
}

const reducer = combineReducers({
  sortShows,
});

export default reducer;
