/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */

import { Dispatch as dispatch } from 'meteor/meteorflux:meteorflux';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Cell from './cell'; // eslint-disable-line

export default class SelectableCellWrapper extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      selectableText: false,
    };

    this.copyVerticalCopyBufferToClipboard = this.copyVerticalCopyBufferToClipboard.bind(this);
  }

  getDataForCopy () {
    const htmlCell = ReactDOM.findDOMNode(this);
    return { id: htmlCell.id, text: htmlCell.innerText };
  }

  setSelected () {
    const htmlCell = ReactDOM.findDOMNode(this);
    this.selected = true;
    htmlCell.classList.add('-selected-cell');
  }

  unsetSelected (withTransition) { // eslint-disable-line
    const htmlCell = ReactDOM.findDOMNode(this);
    this.selected = false;
    if (withTransition) {
      htmlCell.classList.add('off-transition');
    }
    htmlCell.classList.remove('-selected-cell');
    if (withTransition) {
      setTimeout(() => htmlCell.classList.remove('off-transition'), 1000);
    }
  }

  unsetSelectableText () {
    this.setState({
      selectableText: false,
    });
  }

  setSelectableText () {
    this.setState({
      selectableText: true,
    });
  }

  handleBeginningVCopying (e) { // eslint-disable-line
    this.context.vCopyBufferSetBeggining(this.props.xPos, this.props.yPos); // eslint-disable-line
  }

  handleContinuingVCopying (e) {
    if (this.context.canStartVCopying()) {
      document.addEventListener('copy', this.copyVerticalCopyBufferToClipboard, false);
      this.context.setOngoingCopying(true);
      this.context.setCanStartVCopying(false);
    }
    if (this.context.isOngoingVCopying()) {
      e.preventDefault();
      this.context.vCopyBufferGetRectangle(this.props.xPos, this.props.yPos);
    }
  }

  handleEndVCopying (e) { // eslint-disable-line
    if (this.context.canStartVCopying()) {
      this.context.vCopyBufferClean({ dontTouchDOM: true });
    } else if (this.context.isOngoingVCopying()) {
      this.context.setOngoingCopying(false);
      document.execCommand('copy');
      document.execCommand('unselect');
    }
  }

  copyVerticalCopyBufferToClipboard (e) {
    e.preventDefault();
    e.clipboardData.setData('text/plain', this.context.vCopyBufferGetFormatted('\t', '\n', true));
    const notificationText = this.notificationText || 'Cell range copied to clipboard';
    dispatch('NOTIFICATION', { message: notificationText });
    this.context.vCopyBufferClean({});
    document.removeEventListener('copy', this.copyVerticalCopyBufferToClipboard, false);
  }

  componentWillUnmount () {
    document.removeEventListener('copy', this.copyVerticalCopyBufferToClipboard, false);
  }

  onClick (e) { // eslint-disable-line
    if (e.shiftKey && !this.context.isOngoingVCopying()) {
      e.preventDefault();
      document.addEventListener('copy', this.copyVerticalCopyBufferToClipboard, false);
      this.notificationText = 'Column contents copied to clipboard';
      this.context.getColumnOfValues(this.props.xPos);
      document.execCommand('copy');
    }
  }

  onMouseDown (e) {
    if (e.button === 0 && !e.shiftKey) {
      this.handleBeginningVCopying(e);
    }
  }

  onMouseUp (e) {
    if (e.button === 0 && !e.shiftKey) {
      this.handleEndVCopying(e);
    }
  }

  onMouseEnter (e) {
    if (e.button === 0 && !e.shiftKey) {
      e.preventDefault();
      this.handleContinuingVCopying(e);
    }
    // if(e.button === 0 && !this.context.isOngoingVCopying()){
    //   this.setSelectableText();
    // }
  }

  onMouseLeave (e) { // eslint-disable-line
    // if(e.button === 0 && !this.context.isOngoingVCopying()){
    //   this.unsetSelectableText();
    // }
  }

  render () {
    return (
      <div
        id={this.props.id}
        onMouseDown={this.onMouseDown.bind(this)}
        onMouseUp={this.onMouseUp.bind(this)}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
        onClick={this.onClick.bind(this)}
        className={classNames({ '-selectable-text': this.state.selectableText })}
      >
        {this.props.children}
      </div>
    );
  }
}

SelectableCellWrapper.displayName = 'SelectableCellWrapper';

SelectableCellWrapper.contextTypes = {
  vCopyBufferSetBeggining: PropTypes.func,
  vCopyBufferGetFormatted: PropTypes.func,
  vCopyBufferClean: PropTypes.func,
  vCopyBufferGetRectangle: PropTypes.func,
  isOngoingVCopying: PropTypes.func,
  getColumnOfValues: PropTypes.func,
  canStartVCopying: PropTypes.func,
  setOngoingCopying: PropTypes.func,
  setCanStartVCopying: PropTypes.func,
};
