import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Card from './dnd/dndCard.jsx';
import SmartInfiniteScroll from '../helperComponents/smartInfiniteScroll.jsx';

const KanbanCardsContainer = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  renderInfiniteScroller () {
    const renderCards = ({ first, last }) => {
      const {
        items, sortContainerCb, category, callbacks, selected, helpers, target,
      } = this.props;
      const els = [];

      for (let i = first; i < last; i++) {
        if (i > items.length) {
          break;
        }

        const item = items[i];
        if (!item) {
          continue;
        }
        els.push(<Card
          key={item.id}
          index={i}
          componentProps={{
            item,
            checkCb: callbacks.checkCb,
            openDetails: callbacks.openDetails,
            selected,
            helpers,
          }}
          target={target}
          category={category.id}
          sortContainerCb={sortContainerCb}
          editCb={callbacks.editIssue}
        />);
      }
      return els;
    };

    const { items } = this.props;

    return (
      <SmartInfiniteScroll
        containerProps={{
          className: 'kanban-list__cards-container --helpers-custom-scrollbar-light',
        }}
        items={items}
        axis="y"
        itemSize={65}
      >
        {(args) => renderCards(args)}
      </SmartInfiniteScroll>
    );
  }

  renderSimpleContainer (showPlaceholder) {
    const cards = [];

    if (showPlaceholder) {
      cards.push(<div className="dnd-kanban-card__placeholder" key="kanban-kard-placeholder" />);
    }

    return (
      <div className="kanban-list__cards-container --helpers-custom-scrollbar-light">{cards}</div>
    );
  }

  render () {
    const { items, showPlaceholder } = this.props;

    const content =
      items.length === 0
        ? this.renderSimpleContainer(showPlaceholder)
        : this.renderInfiniteScroller();
    return content;
  }
};

KanbanCardsContainer.propTypes = {
  callbacks: PropTypes.object,
  category: PropTypes.object,
  categoryName: PropTypes.string,
  helpers: PropTypes.object,
  items: PropTypes.array,
  saveIndexes: PropTypes.func,
  selected: PropTypes.string,
  sortContainerCb: PropTypes.func,
  target: PropTypes.object,
};

export default KanbanCardsContainer;
