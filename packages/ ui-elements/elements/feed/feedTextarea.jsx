import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Textarea from '../inputs/textarea/textarea.jsx';

const FeedTextarea = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.saveValue = this.saveValue.bind(this);
  }

  saveValue (value) {
    const { cb, data } = this.props;
    if (value) {
      cb(value, data);
      this.textarea.revertChanges();
    }
  }

  render () {
    const {
      markdown, showToolbar, mentions, convertOptions,
    } = this.props;

    return (
      <Textarea
        mentions={mentions}
        convertOptions={convertOptions}
        placeholder="Type a message..."
        markdown={markdown}
        showToolbar={showToolbar}
        cb={this.saveValue}
        saveOnEnter
        ref={(textarea) => (this.textarea = textarea)}
      />
    );
  }
};

FeedTextarea.propTypes = {
  cb: PropTypes.func,
  data: PropTypes.object,
  markdown: PropTypes.bool,
  showToolbar: PropTypes.bool,
};

export default FeedTextarea;
