import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dropzone from 'react-dropzone';
import DropzoneComponent from 'react-dropzone-component';

import './textarea.styl';

const TextareaDropzone = class extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { children, onDrop, isUpload } = this.props;

    if (isUpload) {
      return (
        <Dropzone
          disableClick
          onDrop={onDrop.bind(this)}
          style={{}}
          activeClassName="Draft-centerPos-isOver"
        >
          <div>
            <div className="Draft-centerPos-text">
              <span className="Draft-centerPos-textChild">Drop the file(s) here to attach it</span>
            </div>
            {children}
          </div>
        </Dropzone>
      );
    }
    return children;
  }
};

TextareaDropzone.propTypes = {
  children: PropTypes.node,
  onDrop: PropTypes.func,
  isUpload: PropTypes.bool,
};

TextareaDropzone.defaultProps = {};

export default TextareaDropzone;
