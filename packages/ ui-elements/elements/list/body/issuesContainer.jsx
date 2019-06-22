import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import RenderItem from '../render/renderItem.jsx';

const ListIssuesContainer = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showAll: false,
    };

    this.renderLimit = 3;

    this.toggleShowAll = this.toggleShowAll.bind(this);
  }

  toggleShowAll () {
    this.setState({
      showAll: !this.state.showAll,
    });
  }

  render () {
    const renderItems = (items, showAllByDefault) => {
      const { showAll } = this.state;
      const {
        itemProps, sortContainerCb, group, liftItems,
      } = this.props;
      const {
        openItemCb, openedItemId, selectItem, selectedItems, openDetails,
      } = itemProps;

      const itemsCopy = showAll || showAllByDefault ? items : items.slice(0, this.renderLimit);

      liftItems(group.name, itemsCopy.map((item) => item.itemData.id));

      return itemsCopy.map((item, i) => {
        const openedInDetails = item.itemData.id === openedItemId;
        const selected = selectedItems.some((el) => el.id === item.itemData.id);
        return (
          <RenderItem
            {...item} // data, callbacks, etc
            // details
            openDetails={openDetails}
            openItemCb={openItemCb}
            openedInDetails={openedInDetails}
            group={group}
            // select
            selectedItems={selectedItems}
            selectItem={selectItem}
            selected={selected}
            // dnd
            index={i}
            sortContainerCb={sortContainerCb}
          />
        );
      });
    };

    const renderShowAllBtn = (showAll, items, showAllByDefault) => {
      const text = showAll ? 'Collapse' : 'Show all issues';
      if (!showAllByDefault && items.length > this.renderLimit) {
        return (
          <div onClick={this.toggleShowAll} className="list-issues-container__show-btn">
            {text}
          </div>
        );
      }
      return null;
    };

    const renderLoadIssuesBtn = (props = {}) => {
      const { loadCb, filter, loadBtn } = props;
      const fetchIssuesForCategory = () => {
        loadCb(filter);
      };

      if (loadBtn) {
        return (
          <div onClick={fetchIssuesForCategory} className="list-issues-container__show-btn">
            Load issues...
          </div>
        );
      }
      return null;
    };

    const { items, group } = this.props;
    const { showAll } = this.state;

    const showAllByDefault = _.get(group, 'props.showAll');
    const dynamic = _.get(group, 'props.dynamic');

    const populatedItems = this.props.prepareItems(items);
    const itemsToRender = renderItems(populatedItems, showAllByDefault);
    const showAllBtn = renderShowAllBtn(showAll, items, showAllByDefault);
    const loadIssuesBtn = renderLoadIssuesBtn(dynamic);

    return (
      <div>
        {itemsToRender}
        {showAllBtn}
        {loadIssuesBtn}
      </div>
    );
  }
};

ListIssuesContainer.propTypes = {
  categoryName: PropTypes.string,
  group: PropTypes.object,
  items: PropTypes.array,
  loading: PropTypes.bool,
  localIndexes: PropTypes.object,
  saveIndexes: PropTypes.func,
  sortContainerCb: PropTypes.func,
  itemProps: PropTypes.object,
  liftItems: PropTypes.func,
  prepareItems: PropTypes.func,
};

export default ListIssuesContainer;
