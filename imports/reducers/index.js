/* eslint-disable import/no-unresolved */
import { combineReducers } from 'redux';
import { _ } from 'lodash';

const initialState = {
  sortFilter: '',
  serchText: '',
};


function showsPage(state = initialState, action) {
  switch (action.type) {
    case 'SORT_ACTION':
      return {
        ...state,
        sortFilter: action.filter,
      };
    case 'SEARCH_ACTION':
      console.log('search_reducer ' + action.text);
      return {
        ...state,
        serchText: action.text,
      };
    default:
      return state;
  }
}

function pagination(state = { currentPage: 1 }, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return {
        currentPage: action.page + 1,
      };
    default:
      return state;
  }
}

const reducer = combineReducers({
  showsPage,
  pagination,
});

export default reducer;
