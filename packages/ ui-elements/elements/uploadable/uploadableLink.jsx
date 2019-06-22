import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Icon from '../icons/icon.jsx';
import Spinner from '../spinner/spinnerBase.jsx';

import UploadableBase from './uploadableBase.jsx';
import Link from '../links/link.jsx';
import './uploadable.styl';
import SimpleProgressBar from '../progress/simpleProgressBar';

const UploadableLink = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      progress: 0,
    };
    this.id = _.uniqueId('uploader_');
    this.onChange = this.onChange.bind(this);
    this.onUploadStart = this.onUploadStart.bind(this);
    this.onUploadAbort = this.onUploadAbort.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onError = this.onError.bind(this);
  }

  onChange (res) {
    const { data } = this.props;
    this.setState({ loading: false, progress: 0 });
    return this.props.cb(res, false, data);
  }

  onUploadStart () {
    this.setState({ loading: true });
  }

  onUploadAbort () {
    this.setState({ loading: false });
  }

  onProgress (progress) {
    this.setState({ progress });
  }

  onError (e) {
    this.setState({ loading: false });
  }

  render () {
    let {
      data, href, text, callAction, urlPrefix,
    } = this.props;
    href = get(data, href);
    text = get(data, text);
    let link;
    if (href || text) {
      link = <Link className="upload-file__link" {...this.props} />;
    }

    if (this.state.loading) {
      return (
        <div className="upload-file__progress">
          <SimpleProgressBar progress={this.state.progress} />
        </div>
      );
    }

    return (
      <div className="upload-file">
        <UploadableBase
          {...this.props}
          id={this.id}
          onLoaded={this.onChange}
          onUploadStart={this.onUploadStart}
          onUploadAbort={this.onUploadAbort}
          onProgress={this.onProgress}
          callAction={callAction}
          onError={this.onError}
          className="upload-file__button"
        />
        <label className="upload-file__label" htmlFor={this.id}>
          <Icon type="upload" className="upload-file__icon" />
        </label>
        {link}
      </div>
    );
  }
};

UploadableLink.propTypes = {
  data: PropTypes.object,
  href: PropTypes.string,
  urlPrefix: PropTypes.string,
  text: PropTypes.string,
  callAction: PropTypes.func,
};

export default UploadableLink;
