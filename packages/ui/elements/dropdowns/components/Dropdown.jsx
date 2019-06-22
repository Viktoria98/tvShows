/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Checkbox from '../../checkboxes/components/Checkbox';
import Tooltip from '../../tooltips/components/Tooltip';

const Dropdown = class extends Component { // eslint-disable-line
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
    if (this.props.text !== props.text) {
      this.setState({ text: props.text });
    }
    if (this.state.selected && !props.resetState) { // eslint-disable-line
      let found = false;
      for (const item of props.options) { // eslint-disable-line
        const selected = this.state.selected.toString();
        const value = item.value;
        const text = item.text;
        if ((value && value.toString() === selected) || (text && text.toString() === selected)) {
          if (item.selected) {
            found = true;
          }
        }
      }
      if (!found) {
        this.setState(this.initialState());
      }
    } else {
      let text = '';
      for (const item of props.options) { // eslint-disable-line
        if ((props.value && item.value.toString() === props.value.toString()) || item.selected) { // eslint-disable-line
          text = item.text;
        }
      }
      if (!text) {
        text = props.value;
      }
      if (text) {
        this.setState({ text });
      } else {
        this.setState({
          text: props.text || props.placeholder || '',
        });
      }
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
      selected: '',
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

  change (arg) {
    let text;
    let value;
    let cb;
    if (arg.target) {
      text = arg.target.textContent;
      value = arg.target.dataset.value;
      cb = arg.target.dataset.cb;
    } else {
      text = arg.text;
      value = arg.value;
      cb = arg.cb;
    }
    this.setState({
      open: false,
      text: this.props.text ? this.props.text : text,
      selected: value == null ? text : value,
    }, () => {
      if ((typeof text === 'string') && (typeof this.state.text === 'string') && this.state.text !== text) {
        // NEED TO FIX!! this is just temporary solution
        // sometimes on first change of element,
        // it doesn't save updated state, so we need to redo it.
        return this.change(arg);
      }
      const onChangeProp = this.props.onChange;
      if (typeof cb === 'function') {
        cb(this.state.selected, this.state.text);
      }
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
      if (option.hide) {
        return null;
      }
      if (!option.id) {
        option.id = index; // eslint-disable-line no-param-reassign
      }
      const cb = (event) => {
        const currCb = option.cb;

        if (option.disabled) {
          return;
        }
        event.persist();
        this.change(event);

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
      let dropDownItem = (
        // eslint-disable-next-line
        <li
          id={option.id}
          key={index}
          ref={(item) => this.addListItem(option, item)}
          className={classNames(
            'dropdown__list__item',
            { '-disabled': option.disabled },
            { '-focused': index === this.state.chosenItem }
          )}
          onClick={cb}
          data-value={option.value || option.text}
          title={option.tooltip}
        >
          {option.text}
        </li>
      );
      if (option.tooltip) {
        dropDownItem = (
          <Tooltip
            cloudClassName={'-dropdown'}
            visible={dropDownItem}
          >
            {option.tooltip}
          </Tooltip>
        );
      }
      return dropDownItem;
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

Dropdown.propTypes = {
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

export default Dropdown;
