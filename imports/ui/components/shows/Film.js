import React from 'react';
import PropTypes from 'prop-types';

const Film = ({ number, title, year, img }) => (
  <div>
    <span className='number'>{number+1}</span>
    <span className='title'>{title}</span>
    <span className='year'>{year}</span>
  </div>
);

Film.propTypes = {
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
};

export default Film;
