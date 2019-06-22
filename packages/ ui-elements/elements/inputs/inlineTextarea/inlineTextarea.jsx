import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import InlineBase from '../base/inlineBase.jsx';
import Textarea from '../textarea/textarea.jsx';
import './inlineTextarea.styl';

export default class InlineTextarea extends Component {
  constructor (props) {
    super(props);

    this.state = {
      style: {},
    };

    this.calculatePosition = this.calculatePosition.bind(this);
    this.openCb = this.openCb.bind(this);
    this.overlayCb = this.overlayCb.bind(this);
  }

  componentDidMount () {
    this.calculatePosition();
  }

  calculatePosition () {
    const elem = ReactDOM.findDOMNode(this);
    const position = {
      top: elem.offsetTop,
      left: elem.offsetLeft,
    };

    this.setState({
      style: {
        top: position.top - 2,
        left: position.left,
        maxWidth: window.innerWidth - position.left + 10 * 2,
        minWidth: elem.offsetWidth,
      },
    });
    this.focus();
  }

  focus () {
    if (this.textarea && this.textarea.editor) {
      setTimeout(() => {
        this.textarea.editor.focus();
      });
    }
  }

  openCb (dropdownState) {
    this.calculatePosition();
  }

  overlayCb () {
    return this.textarea && this.textarea.saveValue();
  }

  render () {
    const {
      placeholder,
      markdown,
      showToolbar,
      convertOptions,
      content,
      cb,
      field,
      data,
      type,
      multiedit,
      disallowNewline,
      validationRegExp,
      validationErrMessage,
    } = this.props;

    // It needs to convert any type of variable to string because Draft JS can work only with that
    const contentEx = (content && content.toString()) || '';

    return (
      <InlineBase
        {...this.props}
        style={this.state.style}
        onOpenCb={this.openCb}
        focus={this.focus.bind(this)}
        overlayCb={this.overlayCb}
      >
        <Textarea
          validationRegExp={validationRegExp}
          validationErrMessage={validationErrMessage}
          data={data}
          placeholder={placeholder}
          markdown={markdown}
          showToolbar={showToolbar}
          convertOptions={convertOptions}
          type={type}
          content={contentEx}
          cb={cb}
          field={field}
          multiedit={multiedit}
          disallowNewline={disallowNewline}
          mentions={this.props.mentions}
          ref={(textarea) => (this.textarea = textarea)}
        />
      </InlineBase>
    );
  }
}

InlineTextarea.propTypes = {
  cb: PropTypes.func,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  data: PropTypes.object,
  multiedit: PropTypes.boolean,
  dropdownWidth: PropTypes.number,
  field: PropTypes.string,
  markdown: PropTypes.bool,
  placeholder: PropTypes.string,
  showToolbar: PropTypes.bool,
  type: PropTypes.string,
  disallowNewline: PropTypes.bool,
};
