import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

const LinkDropdown = class extends Component { // eslint-disable-line
  constructor (props) {
    super(props);
    this.handleOpen = this.handleOpen.bind(this);
    this.state = {
      open: false,
    };
  }

  handleOpen (event) {
    const callbackOnOpenProp = this.props.callbackOnOpen;

    if (event) {
      event.preventDefault();
    }
    if (!this.props.disabled) {
      this.setState({
        open: !this.state.open,
      });
    }
    if (typeof callbackOnOpenProp === 'function') {
      callbackOnOpenProp();
    }
  }

  render () {
    return (
      <div className={classNames('dropdown -link', this.props.className)}>
        <a className="dropdown__link" onClick={this.handleOpen}>{this.props.name}</a>
        <div className={classNames('dropdown__close', { '-visible': this.state.open })} onClick={this.handleOpen} />
        <ul className={classNames('dropdown__list', this.props.alignment, { '-visible': this.state.open })}>
          {this.props.children}
        </ul>
      </div>
    );
  }

};

LinkDropdown.propTypes = {
  callbackOnOpen: PropTypes.func,
  className: PropTypes.string,
  name: PropTypes.string,
  alignment: PropTypes.string,
  open: PropTypes.bool, // eslint-disable-line
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default LinkDropdown;
