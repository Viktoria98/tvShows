/* eslint-disable camelcase */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';

const Film = ({
 number, title, year, poster_path, overview, popularity, genres, vote_average 
}) => (
  <div className='filmItem'>
    <span className="number">{number + 1}</span>
    <img src={poster_path} alt="poster" />
    <div className='infoSection'>
      <div className='generalInfo'>
        <span className="title">{title}</span>
        <span className="sort">{year}</span>
        <span className="sort">{popularity}</span>
        <span className="sort">{vote_average}</span>
      </div>
      
    </div>
  </div>
);

Film.propTypes = {
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
};

export default Film;
