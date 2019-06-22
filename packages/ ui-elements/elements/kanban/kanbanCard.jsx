import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Avatar from '../avatars/avatars.jsx';
import Checkbox from '../checkboxes/checkbox.jsx';

// TODO: card should be universal, no data from strait field
const KanbanCard = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.checkboxCallback = this.checkboxCallback.bind(this);
    this.openIssueInDetailsPanel = this.openIssueInDetailsPanel.bind(this);
  }

  checkboxCallback () {
    const { checkCb, item, helpers } = this.props;
    const checked = helpers.checkboxShouldBeChecked(item.status);
    return checkCb(checked, item.id);
  }

  openIssueInDetailsPanel () {
    const { openDetails, item } = this.props;
    openDetails(item.id);
  }

  render () {
    const renderAvatar = (person) => {
      if (!person) {
        return null;
      }
      return <Avatar data={person.name} avatar={person.avatar} />;
    };

    const { item, selected, helpers } = this.props;
    const avatar = renderAvatar(item.assignee);
    const checked = helpers.checkboxShouldBeChecked(item.status);
    const closed = item.status === 'Closed';

    return (
      <div
        className={classNames('kanban-card', { '-closed': closed })}
        onClick={this.openIssueInDetailsPanel}
      >
        <div
          className={classNames('kanban-card__wrapper', {
            '-selected': selected === item.id,
          })}
        >
          <Checkbox
            name="issue_checkbox"
            checked={checked}
            onCheck={this.checkboxCallback}
            view="list"
          />
          <div className="kanban-card__title">{item.title}</div>
          {avatar}
        </div>
      </div>
    );
  }
};
KanbanCard.propTypes = {
  item: PropTypes.object,
  checkCb: PropTypes.func,
  selected: PropTypes.string,
  helpers: PropTypes.object,
  openDetails: PropTypes.func,
};

export default KanbanCard;
