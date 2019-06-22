import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Item from './item';
import Tooltip from '../../tooltips/components/fixedTooltip.jsx';

const ItemsList = class extends Component {
  constructor (props) {
    super(props);
    this.onCheck = this.onCheck.bind(this);
    this.onHover = this.onHover.bind(this);
  }

  onCheck (item) {
    const { onSelect } = this.props;
    onSelect(item);
  }

  onHover (index) {
    const { onHover } = this.props;
    onHover(index);
  }

  render () {
    const { items, selected, customItemTemplates } = this.props;
    let { checked } = this.props;

    // chose reset item if nothing selected in category
    const category = _.get(_.first(items), 'category', null);
    const isSelected = !_.isEmpty(checked.filter((i) => i.category === category));
    if (!isSelected) {
      checked = [{ index: `${category}:null` }];
    }

    const renderItem = _.map(items, (item, index) => {
      const itemTemplate = _.get(customItemTemplates, item.category);
      const output = (
        <Item
          id={item.id}
          key={`${index}-${item.value}`}
          onCheck={this.onCheck}
          onHover={this.onHover}
          item={item}
          selected={selected}
          checked={checked}
          itemTemplate={itemTemplate}
        />
      );

      if (item.tooltip) {
        let tooltipContent = item.tooltip;

        if (_.isArray(item.tooltip)) {
          tooltipContent = item.tooltip.map(({ title, value }) => (
            <div key={title} className="tooltip__row">
              <div className="tooltip__row-el tooltip__row-el--title">{title}</div>
              <div className="tooltip__row-el tooltip__row-el--value">{value}</div>
            </div>
          ));
        }

        return <Tooltip key={`${index}-${item.value}`} visible={output}>{tooltipContent}</Tooltip>;
      }

      return output;
    });

    return (
      <div className="filters-wrap --helpers-custom-scrollbar">
        <ul className="filters">{renderItem}</ul>
      </div>
    );
  }
};

ItemsList.propTypes = {
  checked: PropTypes.instanceOf(Array),
  customItemTemplates: PropTypes.instanceOf(Object),
  items: PropTypes.instanceOf(Array),
  onHover: PropTypes.func,
  onSelect: PropTypes.func,
  selected: PropTypes.string,
};

ItemsList.defaultProps = {
  checked: [],
  customItemTemplates: {},
  items: [],
  onHover: () => {},
  onSelect: () => {},
  selected: '',
};

export default ItemsList;
