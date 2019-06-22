import ReactDOM from 'react-dom';
import React from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
import classNames from 'classnames';

/* eslint-disable react/prop-types */

export default class DropdownBase extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false,
      style: {},
    };

    this.keyCodes = {
      ENTER: 13,
    };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  open (event) { // eslint-disable-line
    this.updateDropdownWidth();

    this.setState({
      open: true,
    });

    document.addEventListener('click', this.handleClick);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  close (event) { // eslint-disable-line
    this.setState({
      open: false,
    });

    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleClick () {
    this.close();
  }

  handleKeyDown (event) {
    switch (event.keyCode) {
      case this.keyCodes.ESC:
        event.preventDefault();
        event.stopPropagation();
        this.close();
        break;
      default:
        break;
    }
  }

  updateDropdownWidth () {
    const container = ReactDOM.findDOMNode(this).offsetParent;

    this.setState({
      style: {
        width: container.offsetWidth - 10,
      },
    });
  }

  render () {
    const renderBtn = () => (
      <div className="dropdown-base__btn" onClick={this.open}>
        <div className="dropdown-base__btn-text">
          {this.props.btnComponent}
        </div>
      </div>
      );

    const renderDropdownBody = () => (
      <div className="dropdown-base__body">
        <div className="dropdown-base__options-container" style={this.state.style}>
          <ul className="dropdown-base__options">
            {this.props.children}
          </ul>
        </div>
      </div>
      );

    const { open } = this.state;

    const dropdownBody = open ? renderDropdownBody() : false;
    const dropdownBtn = renderBtn();

    return (
      <div className={classNames('dropdown-base', { '-open': open })}>
        {dropdownBtn}
        {dropdownBody}
      </div>
    );
  }
}

DropdownBase.displayName = 'DropdownBase';

DropdownBase.propTypes = {
};
