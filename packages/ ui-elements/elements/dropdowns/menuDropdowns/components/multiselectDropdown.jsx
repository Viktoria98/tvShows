import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Base from '../_dropdownBase.jsx';
import DropdownItem from './dropdownItem.jsx';
import Button from '../../../buttons/button.jsx';

const MultiselectDropdown = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.removeAll = this.removeAll.bind(this);
    this.removeOpposing = this.removeOpposing.bind(this);
  }

  handleClick (active, group, item) {
    if (item.cb) {
      item.cb();
    }
    if (active) {
      this.remove(item.value, item.label, group);
    } else {
      this.add(item.value, item.label, group);
      this.removeOpposing(item.value, item.label, group);
    }
    return item;
  }

  add (value, label, group) {
    const selected = Object.assign({}, this.props.selected);
    selected[group] = selected[group] || [];
    selected[group].push(value);
    if (typeof this.props.add === 'function') {
      this.props.add(group, value, selected);
    }
  }

  remove (value, label, group) {
    const selected = Object.assign({}, this.props.selected);
    selected[group].splice(selected[group].indexOf(value), 1);
    if (selected[group].length === 0) {
      delete selected[group];
    }
    if (typeof this.props.remove === 'function') {
      this.props.remove(group, value, selected);
    }
  }

  /**
   * Removes (unselects) opposing filter items in FIFO order
   * @param {String} value
   * @param {String} label
   * @param {String} group
   */
  removeOpposing (value, label, group) {
    this.props.options.forEach((option) => {
      option.items.forEach((item) => {
        if (item.selected && item.oppositeValue && item.oppositeValue === value) {
          this.remove(item.value, label, group);
        }
      });
    });
  }

  removeAll (group) {
    const selected = Object.assign({}, this.props.selected);
    delete selected[group];
    if (typeof this.props.removeAll === 'function') {
      this.props.removeAll(group, null, selected);
    }
  }

  render () {
    const options = [];
    let all;
    const label = [];
    let items;

    const props = this.props;
    if (this.props.options && this.props.selected) {
      for (const group of this.props.options) {
        all = null;
        if (group.all) {
          const ifAllSelected = props.selected[group.name]
            ? !props.selected[group.name].length > 0
            : true;
          const counter = (
            <span className="dropdown__list__item__counter">
              <span className="fake">{group.counts}</span>
              <span className="real">{group.counts}</span>
            </span>
          );
          all = (
            <DropdownItem
              onItemClick={this.removeAll}
              param={group.name}
              active={ifAllSelected}
              text={group.all}
              counter={counter}
            />
          );
        }
        if (group.items) {
          items = group.items.map((item, i) => {
            const ifSelected = props.selected[group.name]
              ? props.selected[group.name].indexOf(item.value) !== -1
              : false;
            if (ifSelected && item.label) {
              label.push(item.label);
            }
            let counter;
            if (item.count >= 0) {
              counter = (
                <span className="dropdown__list__item__counter">
                  <span className="fake">{item.count}</span>
                  <span className="real">{item.count}</span>
                </span>
              );
            }
            const param = {
              value: item.value,
              label: item.label,
              group: group.name,
              active: ifSelected,
            };
            return (
              <DropdownItem
                key={item.value || i}
                onItemClick={this.handleClick.bind(this, ifSelected, group.name, item)}
                param={param}
                active={ifSelected}
                text={item.label}
                counter={counter}
              />
            );
          });
        }
        options.push(<div key={group.name} className="dropdown__list__group">
          {all}
          {items}
        </div>);
      }
    }
    const className = props.className || '';
    const { disabled } = this.props;
    if (disabled) {
      return (
        <div className={classNames('dropdown', this.props.className)}>
          <Button
            className={classNames('dropdown__button -disabled', {
              '-active': this.state.open,
            })}
            icon="reload"
            text="Disabled"
          />
        </div>
      );
    }
    return (
      <Base
        {...this.props}
        className={classNames('multiselect', {
          [className]: className,
          disabled,
        })}
        buttonIcon={this.props.icon}
        buttonText={this.props.label}
      >
        <div className="dropdown__scroll" style={{ maxHeight: window.innerHeight - 170 }}>
          {options}
        </div>
      </Base>
    );
  }
};

MultiselectDropdown.propTypes = {
  add: PropTypes.func,
  remove: PropTypes.func,
  removeAll: PropTypes.func,
  label: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  selected: PropTypes.object,
  className: PropTypes.string,
};

export default MultiselectDropdown;
