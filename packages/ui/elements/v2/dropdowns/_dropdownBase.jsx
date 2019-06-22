import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Button from '../buttons/button';

const DropdownBase = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
  }

  toggleDropDown (ev) {
    ev.preventDefault();
    if (!this.props.disabled) {
      this.setState({ open: !this.state.open });
    }
  }

  closeDropdown () {
    this.setState({ open: false });
  }

  render () {
    const alignment = this.props.align ? `-${this.props.align}` : '';
    return (
      <div id={this.props.id} className={classNames('dropdown', this.props.className)}>
        <Button
          className={
            classNames('dropdown__button',
              { '-disabled': this.props.disabled },
              { '-opened': this.state.open },
              { '-has-active-filter': this.props.hasActiveFilter },
              this.props.buttonClassName
            )}
          icon={this.props.buttonIcon}
          tooltip={this.props.buttonTooltip}
          text={this.props.buttonText}
          type="button"
          onClick={this.toggleDropDown}
        >
          {this.props.buttonText}
        </Button>
        <div
          className={
            classNames('dropdown__close',
            { '-visible': this.state.open }
          )}
          onClick={this.toggleDropDown}
        />
        <div
          className={
            classNames('dropdown__container',
            { '-visible': this.state.open },
            alignment
          )}
        >
          {this.props.children}
        </div>
        <input
          className="dropdown__input"
          type="checkbox"
          onFocus={this.toggleDropDown}
          onBlur={this.toggleDropDown}
        />
      </div>
    );
  }
};

DropdownBase.displayName = 'DropdownBase';

DropdownBase.propTypes = {
  disabled: PropTypes.bool,
  hasActiveFilter: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  buttonIcon: PropTypes.string,
  buttonClassName: PropTypes.string,
  buttonText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  buttonTooltip: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  align: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default DropdownBase;
