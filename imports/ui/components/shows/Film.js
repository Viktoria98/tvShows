import React from 'react';
import PropTypes from 'prop-types';

const Film = ({ title, year, img }) => (
  <div>
    <span>{title}</span>
    <span>{year}</span>
  </div>
);

Film.propTypes = {
  title: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
};

export default Film;
