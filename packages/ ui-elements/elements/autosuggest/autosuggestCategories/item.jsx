import _ from 'lodash';
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Item = class extends Component {
  constructor (props) {
    super(props);
    this.onCheck = this.onCheck.bind(this);
    this.onHover = this.onHover.bind(this);
  }

  onCheck () {
    const { item, onCheck } = this.props;
    _.isFunction(onCheck) && onCheck(item);
  }

  onHover () {
    const { onHover, item } = this.props;
    _.isFunction(onHover) && onHover(item.index);
  }

  render () {
    const {
      item, selected, checked, icon, itemTemplate,
    } = this.props;
    const getCounter = (item) => {
      if (!item.counter) {
        return null;
      }
      return <span className="filter-item__count">{item.counter}</span>;
    };

    const getPrompt = () => {
      const { prompt } = item;
      if (prompt) {
        return <span className="filter-item__prompt"> - {prompt}</span>;
      }
    };

    const checkedIndex = checked.find((i) => i.index === item.index);
    let content = null;

    const component = _.get(itemTemplate, 'component');
    if (component) {
      content = component({ item });
    } else {
      content = (
        <div>
          {icon && (
            <span className="filter-item__icon" style={{ backgroundImage: icon }}>
              &nbsp;
            </span>
          )}
          <span className="filter-item__name">
            {item.text}
            {getPrompt()}
          </span>
          {getCounter(item)}
        </div>
      );
    }

    const id = item.value ? item.value.toString().toLowerCase() : 'everywhere';

    return (
      <li
        id={id}
        className={classNames('filter-item', {
          selected: selected === item.index,
          checked: !_.isEmpty(checkedIndex),
        })}
        onClick={() => {
          this.onCheck(item);
        }}
        onMouseEnter={() => {
          this.onHover(item.index);
        }}
      >
        {content}
      </li>
    );
  }
};

Item.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  checked: PropTypes.array,
  item: PropTypes.object,
  itemTemplate: PropTypes.object,
  onCheck: PropTypes.func,
  onHover: PropTypes.func,
  selected: PropTypes.string,
};

export default Item;
