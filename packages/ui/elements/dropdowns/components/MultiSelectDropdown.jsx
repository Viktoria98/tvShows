import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import MultiSelectDropdownGroup from './MultiSelectDropdownGroup';

const MultiselectDropdown = class extends Component { // eslint-disable-line
  constructor (props) {
    super(props);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.clickAll = this.clickAll.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.state = {
      open: false,
    };
  }

  handleOpen (event) {
    event.preventDefault();
    return this.setState({
      open: !this.state.open,
    });
  }

  add (name, value, label) {
    return this.props.add(name, value, label);
  }

  remove (name, value, label) {
    return this.props.remove(name, value, label);
  }

  clickAll (unchecked) {
    const clickAll = this.props.clickAll;

    if (typeof clickAll === 'function') {
      clickAll(unchecked);
    }
  }

  render () {
    const selected = [];
    if (this.props.options) {
      for (const group of this.props.options) { // eslint-disable-line
        let isSelected = false;
        for (const option of group.items) { // eslint-disable-line
          if (!~selected.indexOf(option.label)) { // eslint-disable-line
            if (option.selected) {
              selected.push(option.label);
              isSelected = true;
            }
          }
        }
        if (!isSelected && group.all) {
          if (!~selected.indexOf(group.all)) { // eslint-disable-line
            selected.push(group.all);
          }
        }
      }
    }

    const label = selected.join(', ');
    let options;
    if (this.props.options) {
      options = this.props.options.map((group) => (
        <MultiSelectDropdownGroup
          key={group.name}
          name={group.name}
          all={group.all}
          items={group.items}
          clickAll={this.clickAll}
          add={this.add}
          remove={this.remove}
        />
      ));
    }

    return (
      <div
        className={classNames('dropdown', { '-extended': this.props.extended }, { '-error': this.props.error },
       { '-hidden': !(this.props.options) })}
      >
        <button
          className="dropdown__button"
          onClick={this.handleOpen}
        >
          {label || this.props.label}
        </button>
        <div className={classNames('dropdown__close', { '-visible': this.state.open })} onClick={this.handleOpen} />
        <ul
          className={classNames('dropdown__list', { '-visible': this.state.open })}
          style={{ maxHeight: window.innerHeight - 170 }}
        >
          {options}
        </ul>
      </div>
    );
  }
};

MultiselectDropdown.propTypes = {
  options: PropTypes.array.isRequired,
  add: PropTypes.func,
  remove: PropTypes.func,
  clickAll: PropTypes.func,
  extended: PropTypes.bool,
  label: PropTypes.string,
  error: PropTypes.string,
};

export default MultiselectDropdown;
