/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Icon from '../../icons/icon';

export default class DropdownSubmenu extends Component {
  constructor (props) {
    super(props);
    this.state = {
      itemsStyles: {},
      expanded: false,
    };
  }

  expand (event) {
    const target = event.target.id !== this.props.id ? event.target.parentElement : event.target;
    if (!this.props.disabled) {
      const submenuCoords = target.getBoundingClientRect();
      const itemsCoords = this.refs.items.getBoundingClientRect();
      const state = {
        itemsStyles: {
          left: submenuCoords.left + submenuCoords.width,
        },
        expanded: true,
      };

       // Check if bottom of the items will out of window
      if ((submenuCoords.top + itemsCoords.height) >= window.innerHeight) {
        // then setting expanding in top direction
        state.itemsStyles.top = submenuCoords.bottom - itemsCoords.height;
        // Check if expanding in upper direction will set top of the items will overflow window
        if (((submenuCoords.bottom - itemsCoords.height) <= 0) ||
          (submenuCoords.bottom >= window.innerHeight)) {
          state.itemsStyles.top = 10;
        }
      } else {
        state.itemsStyles.top = submenuCoords.top; // expand as usual
      }

      // Check if right of the items will out of window with scrollbar considering
      const scrollBarWidth = 20;
      if ((submenuCoords.right + itemsCoords.width) >= window.innerWidth - scrollBarWidth) {
        state.itemsStyles.width = window.innerWidth - scrollBarWidth - submenuCoords.right;
      } else {
        state.itemsStyles.width = '';
      }


      this.setState(state);
    }
  }

  collapse () {
    this.setState({
      itemsStyles: {},
      expanded: false,
    });
  }

  render () {
    return (
      <li
        id={this.props.id}
        className={classNames('dropdown__submenu', 'dropdown__list__item', {
          '-expanded': this.state.expanded,
          '-disabled': this.props.disabled,
        })}
        onMouseEnter={this.expand.bind(this)}
        onMouseLeave={this.collapse.bind(this)}
      >
        <span className="submenu__title">{this.props.label}</span>
        <span className="submenu__checkeditems">{this.props.checked.replace(/&quot;/g, '"')}</span>
        <div
          id={'submenuReset'}
          className={classNames('submenu__reset', this.props.resetButton ? '-active' : '')}
          onClick={this.props.resetCallback ? this.props.resetCallback.bind(this) : null}
        >
          <Icon type="reset" />
        </div>
        <ul
          ref="items"
          className="dropdown__submenu__items"
          style={this.state.itemsStyles}
        >
          {this.props.children}
        </ul>
      </li>
    );
  }
}

DropdownSubmenu.displayName = 'DropdownSubmenu';

DropdownSubmenu.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  label: PropTypes.string,
  checked: PropTypes.string,
  resetCallback: PropTypes.func,
  // buttonIcon: React.PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};
