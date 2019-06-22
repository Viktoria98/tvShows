import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { calculateUploading } from '../../helpers/general.js';

const UploadableBase = class extends Component {
  constructor (props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onError = this.onError.bind(this);
  }

  onError (e) {
    const { onError } = this.props;
    if (_.isFunction(onError)) {
      onError(e);
    }
  }

  onChange (e) {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.currentTarget.files[0];

    const { startCalculate, stopCalculate } = calculateUploading(file.size, (progress) => {
      if (_.isFunction(this.props.onProgress)) {
        this.props.onProgress(progress);
      }
    });

    const success = (...args) => {
      stopCalculate(true, () => {
        this.props.onLoaded(...args);
      });
    };

    const error = (...args) => {
      stopCalculate();
      return this.onError(...args);
    };

    reader.onload = () => {
      this.props.callAction({
        name: file.name,
        size: file.size,
        type: file.type,
        data: reader.result,
        isAvatar: this.props.field === 'avatar',
        error,
        success,
      });
    };
    reader.onerror = () => {
      this.onError(new Error('Error during file upload'));
    };
    reader.onloadstart = () => {
      _.isFunction(this.props.onUploadStart) && this.props.onUploadStart();
      startCalculate();
    };
    reader.onabort = () => {
      _.isFunction(this.props.onUploadAbort) && this.props.onUploadAbort();
    };
    reader.readAsBinaryString(file);
  }

  render () {
    const {
      className, data, href, id, onError,
    } = this.props;
    return (
      <input
        className={className}
        data={data}
        href={href}
        id={id}
        onError={onError}
        ref={(file) => (this.file = file)}
        name="file-upload"
        method="post"
        onChange={this.onChange}
        type="file"
      />
    );
  }
};

UploadableBase.defaultProps = {
  className: 'file-upload-input',
  onLoaded () {
    console.error('Please implement default "onLoaded" action');
  },
  onError () {
    console.error('Please implement default "onError" action');
  },
  callAction () {
    console.error('Please implement default "callAction" action');
  },
};

UploadableBase.propTypes = {
  className: PropTypes.string,
  onLoaded: PropTypes.func,
  onError: PropTypes.func,
  onProgress: PropTypes.func,
  callAction: PropTypes.func,
};

export default UploadableBase;
