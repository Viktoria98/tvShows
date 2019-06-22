import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import MultiSelectDropdownItem from './MultiSelectDropdownItem';
import Format from '../../formatters/Format';

const MultiselectDropdownGroup = class extends Component {
  constructor (props) {
    super(props);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.clickAll = this.clickAll.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  clickAll () {
    const unchecked = [];
    const clickAll = this.props.clickAll;

    for (const item of this.props.items) { // eslint-disable-line
      if (item.selected) {
        unchecked.push({
          name: this.props.name,
          value: item.value,
        });
      }
    }

    if (typeof clickAll === 'function') {
      clickAll(unchecked);
    }
  }

  add (name, value, label) {
    return this.props.add(name, value, label);
  }

  remove (name, value, label) {
    return this.props.remove(name, value, label);
  }

  deleteItem (index) {
    // TODO: implement deleting items?
    return index;
  }

  render () {
    let index = 0;
    let selected = 0;
    let all = '';
    const items = this.props.items.map((item) => {
      let count;
      if (item.count) {
        count = Format.number(item.count) || 0;
      }
      if (item.selected) {
        selected += 1;
      }
      name = item.name || this.props.name; // eslint-disable-line
      return (
        <MultiSelectDropdownItem
          key={`${name}.${item.value}`}
          label={item.label}
          name={name}
          index={index++} // eslint-disable-line
          value={item.value}
          count={count}
          add={this.add}
          remove={this.remove}
          selected={item.selected}
          removable={item.removable}
          deleteItem={this.deleteItem}
          button={item.button}
          disabled={item.disabled}
          cb={item.cb}
        />
      );
    });

    if (this.props.all) {
      // eslint-disable-next-line
      all = (<li className={classNames('dropdown__list__item', { '-active': selected === 0 })} onClick={this.clickAll}>
        {this.props.all}
      </li>);
    }

    return (
      <div className="dropdown__list__group">
        {all}
        {items}
      </div>
    );
  }

};

MultiselectDropdownGroup.displayName = 'MultiselectDropdownGroup';

MultiselectDropdownGroup.propTypes = {
  value: PropTypes.oneOfType([ // eslint-disable-line
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  label: PropTypes.string, // eslint-disable-line
  all: PropTypes.string,
  name: PropTypes.string,
  add: PropTypes.func,
  remove: PropTypes.func,
  clickAll: PropTypes.func,
  items: PropTypes.array,
};

export default MultiselectDropdownGroup;
