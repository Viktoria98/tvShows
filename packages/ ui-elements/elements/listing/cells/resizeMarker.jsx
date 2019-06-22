import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ResizeMarker = class extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      resize: false,
    };

    this.position = 0;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.doDrag = this.doDrag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  doDrag (e) {
    const { clientX } = e;
    const offset = clientX - this.position;

    this.position = clientX;
    if (offset !== 0 && typeof this.props.onResize === 'function') {
      this.props.onResize(offset);
    }
  }

  stopDrag () {
    document.documentElement.removeEventListener('mousemove', this.doDrag);
    document.documentElement.removeEventListener('mouseup', this.stopDrag);
  }

  onMouseDown (e) {
    this.position = e.clientX;
    document.documentElement.addEventListener('mousemove', this.doDrag);
    document.documentElement.addEventListener('mouseup', this.stopDrag);
  }

  onClick (e) {
    e.stopPropagation();
    e.preventDefault();
  }

  render () {
    return (
      <div
        className={classNames('resize_marker', this.props.className)}
        onClick={this.onClick}
        onMouseDown={this.onMouseDown}
      />
    );
  }
};

ResizeMarker.propTypes = {
  className: PropTypes.string,
  onResize: PropTypes.func,
};

export default ResizeMarker;
