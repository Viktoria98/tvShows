import React from 'react';
import PropTypes from 'prop-types';

const Film = ({
  number, title, year, posterPath, popularity, voteAverage,
}) => (
  <div className="filmItem">
    <span className="number">{number + 1}</span>
    <img src={posterPath} alt="poster" />
    <div className="infoSection">
      <div className="generalInfo">
        <span className="title">{title}</span>
        <span className="sort">{year}</span>
        <span className="sort">{popularity}</span>
        <span className="sort">{voteAverage}</span>
      </div>
    </div>
  </div>
);

Film.propTypes = {
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  posterPath: PropTypes.string.isRequired,
  popularity: PropTypes.number.isRequired,
  voteAverage: PropTypes.number.isRequired,
};

export default Film;
