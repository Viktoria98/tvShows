/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import PropTypes from 'prop-types';
import Film from './Film';

const FilmsList = ({ films }) => (
  <div>
    {films.map(film => (
      <Film key={film.id} title={film.title} year={film.year} />
    ))}
  </div>
);

FilmsList.propTypes = {
  films: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

export default FilmsList;
