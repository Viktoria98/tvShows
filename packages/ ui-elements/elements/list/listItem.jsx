import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Checkbox from '../checkboxes/checkbox.jsx';

const ListItem = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};

    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount () {
    if (this.props.sharableMode) {
      this.onDoubleClick();
    }
  }

  onDoubleClick () {
    const { openDetails, data } = this.props;
    openDetails(data.id);
  }
  // onDoubleClick() {
  //   this.props.openItemCb(this.props.data.id);
  // }

  onClick (event) {
    const { ctrlKey, shiftKey, metaKey } = event;
    const { selectItem, data } = this.props;
    selectItem({
      item: {
        id: data.id,
      },
      ctrlKey,
      shiftKey,
      metaKey,
    });
  }

  render () {
    const {
      components,
      itemClass,
      checkboxProps,
      openedInDetails,
      selected,
      data,
      cursor,
    } = this.props;
    return (
      <div
        className={classNames(`list__item ${itemClass}`, {
          'list__item--opened': openedInDetails,
          'list__item--selected': selected,
          'list__item--cursor': cursor,
        })}
        onDoubleClick={this.onDoubleClick}
        onClick={this.onClick}
        data-id={data.id}
      >
        <Checkbox
          name="issue_checkbox"
          checked={checkboxProps.checked}
          onCheck={checkboxProps.cb}
          view="list"
        />
        {components}
      </div>
    );
  }
};

ListItem.propTypes = {
  callbacks: PropTypes.object,
  checkboxProps: PropTypes.object,
  components: PropTypes.array,
  data: PropTypes.object,
  dictionaries: PropTypes.object,
  index: PropTypes.number,
  itemClass: PropTypes.string,
  openItemCb: PropTypes.func,
  openedInDetails: PropTypes.bool,
  selectItem: PropTypes.func,
  selected: PropTypes.bool,
};

export default ListItem;
