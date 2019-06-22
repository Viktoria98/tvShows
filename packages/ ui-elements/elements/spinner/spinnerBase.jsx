import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './spinner.styl';

const Spinner = (props) => {
  let { type } = props;
  const types = [
    'sk-rotating-plane',
    'sk-fading-circle',
    'sk-folding-cube',
    'sk-double-bounce',
    'sk-wave',
    'sk-wandering-cubes',
    'sk-spinner-pulse',
    'sk-chasing-dots',
    'sk-three-bounce',
    'sk-circle',
    'sk-cube-grid',
  ];
  if (types.indexOf(type) === -1) {
    type = types[0];
  }

  switch (type) {
    case 'sk-rotating-plane':
      return <div className={classNames(props.className, 'sk-rotating-plane')} />;
    case 'sk-fading-circle':
      return (
        <div className={classNames(props.className, 'sk-fading-circle')}>
          <div className="sk-circle1 sk-circle" />
          <div className="sk-circle2 sk-circle" />
          <div className="sk-circle3 sk-circle" />
          <div className="sk-circle4 sk-circle" />
          <div className="sk-circle5 sk-circle" />
          <div className="sk-circle6 sk-circle" />
          <div className="sk-circle7 sk-circle" />
          <div className="sk-circle8 sk-circle" />
          <div className="sk-circle9 sk-circle" />
          <div className="sk-circle10 sk-circle" />
          <div className="sk-circle11 sk-circle" />
          <div className="sk-circle12 sk-circle" />
        </div>
      );
    case 'sk-folding-cube':
      return (
        <div className={classNames(props.className, 'sk-folding-cube')}>
          <div className="sk-cube1 sk-cube" />
          <div className="sk-cube2 sk-cube" />
          <div className="sk-cube4 sk-cube" />
          <div className="sk-cube3 sk-cube" />
        </div>
      );
    case 'sk-double-bounce':
      return (
        <div className={classNames(props.className, 'sk-double-bounce')}>
          <div className="sk-child sk-double-bounce1" />
          <div className="sk-child sk-double-bounce2" />
        </div>
      );
    case 'sk-wave':
      return (
        <div className={classNames(props.className, 'sk-wave')}>
          <div className="sk-rect sk-rect1" />
          <div className="sk-rect sk-rect2" />
          <div className="sk-rect sk-rect3" />
          <div className="sk-rect sk-rect4" />
          <div className="sk-rect sk-rect5" />
        </div>
      );
    case 'sk-wandering-cubes':
      return (
        <div className={classNames(props.className, 'sk-wandering-cubes')}>
          <div className="sk-cube sk-cube1" />
          <div className="sk-cube sk-cube2" />
        </div>
      );
    case 'sk-spinner-pulse':
      return <div className={classNames(props.className, 'sk-spinner sk-spinner-pulse')} />;
    case 'sk-chasing-dots':
      return (
        <div className={classNames(props.className, 'sk-chasing-dots')}>
          <div className="sk-child sk-dot1" />
          <div className="sk-child sk-dot2" />
        </div>
      );
    case 'sk-three-bounce':
      return (
        <div className={classNames(props.className, 'sk-three-bounce')}>
          <div className="sk-child sk-bounce1" />
          <div className="sk-child sk-bounce2" />
          <div className="sk-child sk-bounce3" />
        </div>
      );
    case 'sk-circle':
      return (
        <div className={classNames(props.className, 'sk-circle')}>
          <div className="sk-circle1 sk-child" />
          <div className="sk-circle2 sk-child" />
          <div className="sk-circle3 sk-child" />
          <div className="sk-circle4 sk-child" />
          <div className="sk-circle5 sk-child" />
          <div className="sk-circle6 sk-child" />
          <div className="sk-circle7 sk-child" />
          <div className="sk-circle8 sk-child" />
          <div className="sk-circle9 sk-child" />
          <div className="sk-circle10 sk-child" />
          <div className="sk-circle11 sk-child" />
          <div className="sk-circle12 sk-child" />
        </div>
      );
    case 'sk-cube-grid':
      return (
        <div className={classNames(props.className, 'sk-cube-grid')}>
          <div className="sk-cube sk-cube1" />
          <div className="sk-cube sk-cube2" />
          <div className="sk-cube sk-cube3" />
          <div className="sk-cube sk-cube4" />
          <div className="sk-cube sk-cube5" />
          <div className="sk-cube sk-cube6" />
          <div className="sk-cube sk-cube7" />
          <div className="sk-cube sk-cube8" />
          <div className="sk-cube sk-cube9" />
        </div>
      );
  }
};

Spinner.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
};

export default Spinner;
