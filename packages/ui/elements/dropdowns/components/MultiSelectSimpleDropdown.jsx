/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Checkbox from '../../checkboxes/components/Checkbox';
import Tooltip from '../../tooltips/components/Tooltip';

const MultiselectSimpleDropdown = class extends Component {
  constructor (props) {
    super(props);
    this.change = this.change.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.initialState = this.initialState.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.addListItem = this.addListItem.bind(this);
    this.ensureVisible = this.ensureVisible.bind(this);
    this.state = this.initialState();
    this.createDropdownBtn = this.createDropdownBtn.bind(this);
  }

  componentWillReceiveProps (props) {
    const selected = [];
    for (const item of props.options) { // eslint-disable-line
      if (item.selected) {
        selected.push(item.name);
      }
    }

    if (this.props.text !== props.text) {
      this.setState({ text: props.text, selected });
    } else {
      this.setState({ selected });
    }
  }

  componentDidUpdate () {
    this.ensureVisible();
  }

  onFocus () {
    this.toggleDropDown();
  }

  initialState () {
    return {
      open: false,
      text: this.props.text || this.props.placeholder,
      selected: [],
      chosenItem: -1,
      listItems: [],
    };
  }

  ensureVisible () {
    if (this.state.chosenItem !== -1 && this.state.listItems[this.state.chosenItem]) {
      const chosenItem = this.state.listItems[this.state.chosenItem];
      const list = this.refs.list;
      // offset from the top visible edge of the list to the top/bottom edge of the list item
      const offsetToTopEdge = chosenItem.offsetTop - list.scrollTop;
      const offsetToBottomEdge = offsetToTopEdge + chosenItem.offsetHeight;
      const listHeight = list.offsetHeight;
      // moving down
      if (offsetToBottomEdge > listHeight) {
        list.scrollTop += offsetToBottomEdge - listHeight;
      }
      // moving up
      if (offsetToTopEdge <= 0) {
        list.scrollTop += offsetToTopEdge;
      }
    }
  }

  keyDownHandler (event) {
    if (~[13, 27, 40, 38].indexOf(event.keyCode)) { // eslint-disable-line
      event.preventDefault();
    }

    if (this.state.open) {
      if (event.keyCode === 27) {
        this.toggleDropDown();
      }

      if (event.keyCode === 13) {
        const item = this.props.options[this.state.chosenItem];
        if (!item) {
          this.toggleDropDown();
        } else {
          this.change({ text: item.text, value: item.value, cb: item.cb });
        }
      }

      if (event.keyCode === 40 && this.state.chosenItem < this.props.options.length - 1) {
        let offset = 0;
        for (let i = this.state.chosenItem + 1; i <= this.state.listItems.length; i++) {
          offset += 1;
          if (this.state.listItems[i] != null) {
            this.setState({ chosenItem: this.state.chosenItem + offset });
            break;
          }
        }
      }

      if (event.keyCode === 38 && this.state.chosenItem > 0) {
        let offset = 0;
        for (let i = this.state.chosenItem - 1; i > -1; i--) {
          offset += 1;
          if (this.state.listItems[i] != null) {
            this.setState({ chosenItem: this.state.chosenItem - offset });
            break;
          }
        }
      }

      if (event.keyCode === 9) {
        this.toggleDropDown();
      }
    }
  }

  handleOpen (event) {
    event.preventDefault();
    this.toggleDropDown();
  }

  toggleDropDown () {
    if (!this.props.disabled) {
      this.setState({ open: !this.state.open });
    }
  }

  addListItem (option, item) {
    this.state.listItems.push(option.divider || option.disabled ? null : item);
  }

  change (arg, eventValue) {
    let newSelected = [];

    if (this.state.selected.indexOf(eventValue) >= 0) {
      newSelected = this.state.selected.filter((item) => {
        if (item === eventValue) {
          return false;
        }
        return true;
      });
    } else {
      newSelected = this.state.selected;
      newSelected.push(eventValue);
    }
    this.setState({
//      open: false,
      selected: newSelected,
    }, () => {
      const onChangeProp = this.props.onChange;
      if (typeof onChangeProp === 'function') {
        onChangeProp(this.state.selected, this.state.text);
      }
      return true;
    });
  }

  createDropdownBtn () {
    const btn = (
      <button
        className={
          classNames('dropdown__button',
          { '-disabled': this.props.disabled },
          this.props.optionalBtnClass,
          { '-open': this.state.open }
        )}
        type="button"
        onKeyDown={this.keyDownHandler}
        onFocus={this.onFocus}
        onClick={this.handleOpen}
      >
        {this.state.text}
      </button>
    );

    // wrap button in tooltip
    if (this.props.tooltip) {
      return (
        <Tooltip
          cloudClassName={this.props.tooltip.cloudClassName}
          visible={btn}
        >
          {this.props.tooltip.text}
        </Tooltip>
      );
    }
    return btn;
  }

  render () {
    const options = this.props.options.map((option, index) => {
      if (!option.id) {
        option.id = index; // eslint-disable-line no-param-reassign
      }
      const cb = (event) => {
        const currCb = option.cb;

        if (option.disabled) {
          return;
        }
        event.persist();
        this.change(event, option.name);

        if (typeof currCb === 'function') {
          currCb(event);
        }
      };

      if (option.divider) {
        return <hr key={index} ref={(item) => this.addListItem(option, item)} />;
      } else if (option.checkbox) {
        return (
          <li
            key={index}
            ref={(item) => this.addListItem(option, item)}
            className={
              classNames(
                'dropdown__list__item',
                '-checkboxItem',
                { '-focused': index === this.state.chosenItem }
              )
            }
            title={option.tooltip}
          >
            <Checkbox
              key={option.name}
              label={option.text}
              onKeyDown={this.keyDownHandler}
              checked={option.checked}
              onCheck={option.cb}
              name={option.name}
            />
          </li>
        );
      }
      const activeElement = this.state.selected.indexOf(option.name);
      return (
        // eslint-disable-next-line
        <li
          id={option.id}
          key={index}
          ref={(item) => this.addListItem(option, item)}
          className={classNames(
            'dropdown__list__item',
            { '-disabled': option.disabled },
            { '-focused': index === this.state.chosenItem },
            { '-active': activeElement >= 0 }
          )}
          onClick={cb}
          data-value={option.name}
          title={option.tooltip}
        >
          {option.text}
        </li>
      );
    });

    const alignment = this.props.align ? `-${this.props.align}` : '';
    const dropdownButton = this.createDropdownBtn();

    return (
      <div
        className={classNames('dropdown',
          this.props.className,
          { '-extended': this.props.extended },
          { '-error': this.props.error }
        )}
        id={this.props.id || ''}
      >
        {dropdownButton}
        <div className={classNames('dropdown__close', { '-visible': this.state.open })} onClick={this.handleOpen} />
        <div className={classNames('dropdown__arrow', { '-visible': this.state.open })} />
        <ul
          ref="list"
          className={classNames('dropdown__list', { '-visible': this.state.open }, alignment)}
          style={{ maxHeight: this.props.maxHeight || window.innerHeight - 170 }}
        >
          {options}
        </ul>
      </div>
    );
  }

};

MultiselectSimpleDropdown.displayName = 'MultiselectSimpleDropdown';

MultiselectSimpleDropdown.propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  maxHeight: PropTypes.number,
  placeholder: PropTypes.string,
  optionalBtnClass: PropTypes.string,
  tooltip: PropTypes.object,
  align: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  extended: PropTypes.bool,
  error: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.array,
};

export default MultiselectSimpleDropdown;
