/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import PropTypes from 'prop-types';
import Film from './Film';

const FilmsList = ({ films }) => (
  <div>
    {films.map((film, i) => (
      <Film key={i} number={i} title={film.title} year={film.year} />
    ))}
  </div>
);

FilmsList.propTypes = {
  films: PropTypes.arrayOf(
    PropTypes.shape({
      ids: PropTypes.object.isRequired,
      title: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
    }).isRequired,
  ).isRequired,
};

export default FilmsList;
