/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import PropTypes from 'prop-types';
import FilmsList from './FilmsList';
import '../../styles/films.css';

const FilmListWrapper = ({ films }) => (
  <div className='FilmListTableHeader'>
    <span className='headerTitle'><b>Title</b></span>
    <span className='headerYear'><b>Year</b></span>
    <FilmsList films={films} />
  </div>
);

export default FilmListWrapper;
