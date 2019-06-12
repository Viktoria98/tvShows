/* eslint-disable import/no-unresolved */
import { combineReducers } from 'redux';

function shows(state = [], action) {
  switch (action.type) {
    case 'DISPLAY_SHOWS':
      return [
        ...state,
        {
          shows: action.filmsArray,
        },
      ];
    default:
      return state;
  }
}


const reducer = combineReducers({
  shows,
});

export default reducer;
