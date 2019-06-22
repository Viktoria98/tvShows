import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';

import IssuesContainer from './issuesContainer.jsx';
import GroupsContainer from './groupsContainer.jsx';
import DndSortContainer from '../../helperComponents/dndSortContainer.jsx';
import SimpleProgressBar from '../../progress/simpleProgressBar.jsx';

const ListBodyGroup = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.redirectToFilter = this.redirectToFilter.bind(this);
  }

  constructGroups () {
    const {
      group, data, callbacks, propsPackage,
    } = this.props;
    const { sortContainerProps } = propsPackage;

    const componentProps = {
      callbacks,
      propsPackage,
      data,
      group,
    };

    let items = group.items.map((link) => data[link]);
    const categoryName = group.name;

    let defaultItem = null;
    items = items.filter((item) => {
      const isDefault = _.get(item, 'props.default');
      if (isDefault) {
        defaultItem = item;
        return false;
      }
      return true;
    });

    let defaultGroup = null;
    if (defaultItem) {
      defaultGroup = <ListBodyGroup key={defaultItem.id} {...componentProps} group={defaultItem} />;
    }

    return (
      <div>
        {defaultGroup}
        <DndSortContainer
          {...sortContainerProps}
          categoryName={categoryName}
          groupIndexes={sortContainerProps.localIndexes[categoryName]}
          items={items}
          component={GroupsContainer}
          componentProps={componentProps}
        />
      </div>
    );
  }

  constructIssues () {
    const {
      group, data, callbacks, propsPackage,
    } = this.props;

    const { sortContainerProps, itemProps, liftItems } = propsPackage;
    const { openItemCb, prepareItems } = callbacks;

    const categoryName = group.name;
    return (
      <DndSortContainer
        {...sortContainerProps}
        groupIndexes={sortContainerProps.localIndexes[categoryName]}
        categoryName={categoryName}
        items={group.items}
        component={IssuesContainer}
        componentProps={{
          liftItems,
          prepareItems,
          itemProps,
          group,
        }}
      />
    );
  }

  redirectToFilter () {
    const { callbacks, group } = this.props;
    const filterData = _.get(group, 'header.filter');

    if (filterData) {
      const filter = {
        id: group.id,
        text: group.header.title,
        value: group.id,
        type: filterData.type,
        category: filterData.category,
        index: `${filterData.category}:${group.id}`,
      };
      callbacks.redirectToFilter({
        filter,
      });
    }
  }

  render () {
    const constructContainer = (group) => {
      switch (group.itemType) {
        case 'group':
          return this.constructGroups();

        case 'issue':
          return this.constructIssues();

        default:
      }
    };

    const renderHeader = (header, group) => {
      if (!header || _.isEmpty(header)) {
        return;
      }
      const parent = header.parent;

      let counter = null;
      // we can pass counter...
      if (typeof header.counter === 'number') {
        // as strict number to render
        counter = <span className="list-group__counter">{header.counter}</span>;
      } else if (typeof header.counter === 'boolean' && header.counter) {
        // as bool, i.e. render items array length as counter
        counter = <span className="list-group__counter">{group.items.length}</span>;
      }

      const progressBar =
        typeof header.progress === 'number' ? (
          <SimpleProgressBar progress={header.progress} />
        ) : null;

      return (
        <div
          className={classNames('list-group__header', {
            '-parent': parent,
          })}
        >
          <div>
            <b onClick={this.redirectToFilter}>{header.title}</b>
            {counter}
          </div>
          {progressBar}
        </div>
      );
    };

    const { group } = this.props;

    const header = renderHeader(group.header, group);
    const container = constructContainer(group);

    return (
      <div className="list-group">
        {header}
        {container}
      </div>
    );
  }
};

ListBodyGroup.propTypes = {
  callbacks: PropTypes.object,
  data: PropTypes.object,
  propsPackage: PropTypes.object,
  group: PropTypes.object,
};

ListBodyGroup.defaultProps = {
  group: {},
};

export default ListBodyGroup;
