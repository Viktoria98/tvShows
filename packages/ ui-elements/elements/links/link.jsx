import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';

import Textarea from '../inputs/textarea/textarea.jsx';
import InlineBase from '../inputs/base/inlineBase.jsx';
import InlineTextarea from '../inputs/inlineTextarea/inlineTextarea.jsx';

const Link = class extends Component {
  constructor (props) {
    super(props);

    this.state = {
      placeholder: props.text,
      url: props.href,
    };

    this.updateState = this.updateState.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    this.updateState(nextProps);
  }

  componentDidMount () {
    this.updateState(this.props);
  }

  updateState (props) {
    const {
      data, className, href: url, text: placeholder, urlPrefix, static: isStatic,
    } = props;

    // static props means we've already passed valid link and text, we don't need to get them from obj,
    if (isStatic) {
      this.setState({
        placeholder,
        url,
      });
      // otherwise we'll need to find props in object manually
    } else {
      this.setState({
        placeholder: get(data, placeholder),
        url: `${urlPrefix || ''}${get(data, url)}`,
      });
    }
  }

  onClick (e) {
    if (e.altKey) {
      e.preventDefault();
    }
  }

  render () {
    const { placeholder, url } = this.state;
    const { className } = this.props;

    // render link only of we have url to follow
    if (url) {
      return (
        <a
          className={classNames('link-container', '-link', className)}
          target="_blank"
          rel="noopener"
          href={url}
          onClick={this.onClick}
        >
          {placeholder}
        </a>
      );
      // otherwise render simple text
    }
    return (
      <div className={classNames('link-container', className)} onClick={this.onClick}>
        {placeholder}
      </div>
    );
  }
};

Link.propTypes = {
  data: PropTypes.object,
  href: PropTypes.string,
  urlPrefix: PropTypes.string,
  text: PropTypes.string.isRequired,
  static: PropTypes.bool,
};

export default Link;
