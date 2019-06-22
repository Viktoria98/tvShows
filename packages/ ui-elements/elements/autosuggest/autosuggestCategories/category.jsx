/* eslint no-underscore-dangle: ['error', {'allow': ['_debug']}] */
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Category = class extends Component {
  constructor (props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick () {
    const { onCheck, item } = this.props;

    if (typeof onCheck === 'function') {
      onCheck(item);
    }
  }

  render () {
    const {
      id, item, selected, chosen,
    } = this.props;

    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <li
        id={id}
        key={item.name}
        className={classNames({
          selected: selected === item.name,
          chosen: chosen.includes(item.name),
        })}
        onClick={this.onClick}
        onKeyDown={this.onClick}
      >
        <span className="category-item">{item.name}</span>
        <span id={`${id}Count`} className="category-item__count">
          {item.counter}
        </span>
      </li>
    );
  }
};

Category.propTypes = {
  id: PropTypes.string,
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  selected: PropTypes.string,
  onCheck: PropTypes.func,
  chosen: PropTypes.arrayOf(PropTypes.string),
};

Category.defaultProps = {
  id: '',
  selected: '',
  onCheck () {
    Meteor._debug('Need to implement "onCheck"');
  },
  chosen: [],
};

export default Category;
