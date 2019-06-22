import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Pill from './pill';

const PillsList = class extends Component {
  constructor (props) {
    super(props);
    this.onClose = this.onClose.bind(this);
  }

  onClose (item) {
    const { onClosing } = this.props;
    _.isFunction(onClosing) && onClosing(item);
  }

  render () {
    const {
      items, checked, disabledItems, isOpened,
    } = this.props;
    if (_.isEmpty(items)) {
      return null;
    }

    let renderItem = items.map((item) => (
      <Pill
        key={item.index}
        item={item}
        checked={checked}
        onClose={this.onClose}
        showRemoveIcon={isOpened}
      />
    ));

    if (!_.isEmpty(disabledItems)) {
      renderItem = [
        ...renderItem,
        disabledItems.map((item) => (
          <Pill
            key={item.index}
            item={item}
            checked={checked}
            onClose={this.onClose}
            disabled
            showRemoveIcon={isOpened}
          />
        )),
      ];
    }

    return (
      <div className="pills-list">
        <ul className="pills-list__content">{renderItem}</ul>
      </div>
    );
  }
};

PillsList.propTypes = {
  items: PropTypes.array,
  checked: PropTypes.array,
  disabledItems: PropTypes.array,
  onChoosing: PropTypes.func,
};

PillsList.defaultProps = {
  filters: [],
};

export default PillsList;
