import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListBodyGroup from './group.jsx';

const ListGroupsContainer = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const {
      items, callbacks, propsPackage, data,
    } = this.props;

    const itemsToRender = items.map((item, i) => (
      <ListBodyGroup
        key={item.id}
        group={item}
        data={data}
        callbacks={callbacks}
        propsPackage={propsPackage}
      />
    ));

    return <div>{itemsToRender}</div>;
  }
};

ListGroupsContainer.propTypes = {
  callbacks: PropTypes.object,
  categoryName: PropTypes.string,
  data: PropTypes.object,
  group: PropTypes.object,
  items: PropTypes.array,
  loading: PropTypes.bool,
  localIndexes: PropTypes.object,
  propsPackage: PropTypes.object,
  saveIndexes: PropTypes.func,
  sortContainerCb: PropTypes.func,
};

export default ListGroupsContainer;
