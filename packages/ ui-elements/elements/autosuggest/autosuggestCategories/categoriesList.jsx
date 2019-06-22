/* eslint no-underscore-dangle: ['error', {'allow': ['_debug']}] */
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Category from './category';

const CategoriesList = class extends Component {
  constructor (props) {
    super(props);
    this.onCheck = this.onCheck.bind(this);
  }

  onCheck (category) {
    const { onCheck } = this.props;

    if (typeof onCheck === 'function') {
      onCheck(category);
    }
  }

  render () {
    const {
      items, selected, chosen,
    } = this.props;
    const searches = items.filter((item) => item.isSearch);
    const filters = items.filter((item) => !item.isSearch);
    const renderSearches = searches.map((item) => (
      <Category
        id={_.camelCase(item.name)}
        key={item.name}
        onCheck={this.onCheck}
        item={item}
        selected={selected}
        chosen={chosen}
      />
    ));
    const renderFilters = filters.map((item) => (
      <Category
        id={_.camelCase(item.name)}
        key={item.name}
        onCheck={this.onCheck}
        item={item}
        selected={selected}
        chosen={chosen}
      />
    ));

    return (
      <div className="categories-wrap">
        <ul className="categories searches__categories">{renderSearches}</ul>
        <ul className="categories searches__filters">{renderFilters}</ul>
      </div>
    );
  }
};

CategoriesList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape).isRequired,
  selected: PropTypes.string,
  onCheck: PropTypes.func,
  chosen: PropTypes.arrayOf(PropTypes.string),
};

CategoriesList.defaultProps = {
  selected: '',
  onCheck () {
    Meteor._debug('Need to implement "onCheck"');
  },
  chosen: [],
};

export default CategoriesList;
