import React from 'react';
import PropTypes from 'prop-types';
import Film from './Film';

class FilmsList extends React.Component {
  componentDidMount() {
  }

  render() {
    const { films } = this.props;
    return (
      <div>
        {films.map((film, i) => (
          <Film
            key={i}
            number={i}
            title={film.title}
            year={film.year}
            posterPath={film.posterPath}
            popularity={film.popularity}
            voteAverage={film.voteAverage}
          />
        ))}
      </div>
    );
  }
}

FilmsList.propTypes = {
  films: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
      posterPath: PropTypes.string.isRequired,
      popularity: PropTypes.number.isRequired,
      voteAverage: PropTypes.number.isRequired,
    }).isRequired,
  ).isRequired,
};

export default FilmsList;
