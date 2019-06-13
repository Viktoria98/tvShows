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
    <div className='descriptionSection'>
      <div>
        <span className="title">{title}</span>
      </div>
      <div>
        <label><b>Year: </b></label>
        <span className="year">{year}</span>
      </div>
      <div>
        <label><b>Genres: </b></label>
        {genres.map((genre, i) => <span key={i}>{genre.name} </span>)}
      </div>
      <div>
        <span className="">{overview}</span>
      </div>
      <div>
        <label><b>Popularity: </b></label>
        <span className="">{popularity}</span>
      </div>
      <div>
        <label><b>Vote average: </b></label>
        <span className="">{vote_average}</span>
      </div>
    </div>
  </div>
);

Film.propTypes = {
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
};

export default Film;
