/* eslint-disable react/prop-types */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

class PopupBase extends Component {

  componentDidMount () {
    this.popupSection.addEventListener('keydown', (e) => this.closeByEsc(e));
  }

  closeByEsc (e) {
    if (e.keyCode === 27) {
      e.stopImmediatePropagation();
      this.props.onClose();
      this.removeEscHandler();
    }
  }

  removeEscHandler () {
    this.popupSection.removeEventListener('keydown', (e) => this.closeByEsc(e));
  }

  render () {
    return (
      <section
        // eslint-disable-next-line
        tabIndex={1}
        ref={(section) => {
          this.popupSection = section;
        }}
        id={this.props.id}
        className={classNames('popup', this.props.className, { 'popup--active': this.props.active })}
      >
        <div className="popup__overlay" onClick={this.props.onClose} />
        <div className="popup__body" style={{ width: this.props.width }}>
          <h2 className="popup__title">{this.props.title}</h2>
          <div id="close" className="popup__close-btn" onClick={this.props.onClose} />
          <div className="popup__content-box">
            {this.props.children}
          </div>
        </div>
      </section>
    );
  }
}

PopupBase.displayName = 'PopupBase';

PopupBase.propTypes = {
  active: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default PopupBase;
