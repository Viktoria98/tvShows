import React, { Component } from 'react';
import PropTypes from 'prop-types';

// this helper basically wraps component and ensures that wrapped component has height which is equaly to empty space on the page

const ComponentHeightResizer = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      minHeight: 0,
      maxHeight: 0,
    };

    this.calculateContainerHeight = this.calculateContainerHeight.bind(this);
  }

  componentDidMount () {
    this.calculateContainerHeight();
    window.addEventListener('resize', this.calculateContainerHeight);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.calculateContainerHeight);
  }

  calculateContainerHeight () {
    const { offset } = this.props;
    const height = window.innerHeight - this.resizerContainer.offsetTop - offset;

    this.setState({
      minHeight: height,
      maxHeight: height,
    });
  }

  render () {
    return (
      <div ref={(container) => (this.resizerContainer = container)}>
        {this.props.children(this.state)}
      </div>
    );
  }
};

ComponentHeightResizer.propTypes = {
  offset: PropTypes.number,
  children: PropTypes.func,
};

ComponentHeightResizer.defaultProps = {
  offset: 0,
};

export default ComponentHeightResizer;
