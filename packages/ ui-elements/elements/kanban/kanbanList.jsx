import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from '../icons/icon.jsx';
import DndSortContainer from '../helperComponents/dndSortContainer.jsx';
import CardsContainer from './kanbanCardsContainer.jsx';

const KanbanList = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.addIssue = this.addIssue.bind(this);
  }

  addIssue () {
    const { callbacks, category, target } = this.props;
    // n/a means issue has empty field, so we shouldn't build any query
    const query = category.id === 'n/a' ? {} : { [target.field]: category.id };

    callbacks.addCb(query);
  }

  saveIndexes (args) {
    const { callbacks } = this.props;
    callbacks.saveIndexes(args);
  }

  render () {
    const constructHeader = () => {
      const {
        category, target, callbacks, helpers,
      } = this.props;
      let content = null;

      if (typeof target.category.renderHeader === 'function') {
        content = target.category.renderHeader({
          category,
          target,
          callbacks,
          helpers,
        });
      } else {
        content = category.title;
      }

      return <div className="kanban-list__header">{content}</div>;
    };

    const {
      category,
      callbacks,
      data,
      groupIndexes,
      selected,
      showPlaceholder,
      helpers,
      target,
    } = this.props;
    const header = constructHeader();

    return (
      <div className="kanban-list">
        <div className="kanban-list__body">
          {header}
          <DndSortContainer
            component={CardsContainer}
            componentProps={{
              callbacks,
              category,
              selected,
              showPlaceholder,
              helpers,
              target,
            }}
            items={data}
            saveIndexes={callbacks.saveIndexes}
            categoryName={category.id}
            groupIndexes={groupIndexes}
          />
          <div className="kanban-list__footer">
            <button className="kanban-list__add-btn" onClick={this.addIssue}>
              <Icon type="plus" />
              Add issue
            </button>
          </div>
        </div>
        <div className="kanban-list__fake-expander" />
      </div>
    );
  }
};

KanbanList.propTypes = {
  callbacks: PropTypes.object,
  category: PropTypes.object,
  data: PropTypes.array,
  helpers: PropTypes.object,
  selected: PropTypes.string,
  target: PropTypes.object,
};

export default KanbanList;
