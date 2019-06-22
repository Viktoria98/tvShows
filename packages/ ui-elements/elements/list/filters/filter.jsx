import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import formatNumber from '../../../helpers/formatNumber.js';
import InlineTextarea from '../../inputs/inlineTextarea/inlineTextarea.jsx';
import Icon from '../../icons/icon.jsx';

import Tooltip from '../../tooltips/tooltip.jsx';

const ListFilter = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};

    this.timeoutId = null;

    this.onClick = this.onClick.bind(this);
    this.debouncedOnClick = this.debouncedOnClick.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.renameCb = this.renameCb.bind(this);
    this.switchVisibilityState = this.switchVisibilityState.bind(this);
  }

  componentDidMount () {
    const { selected, filter, activeCb } = this.props;
    this.signalFilterAsActive({
      selected: selected.value,
      filter: filter.value,
      cb: activeCb,
    });

    setTimeout(() => {
      if (this.active) {
        this.item.focus();
      }
    }, 50);
  }

  componentWillReceiveProps (nextProps) {
    const { selected, filter, activeCb } = this.props;
    this.signalFilterAsActive({
      selected: nextProps.selected.value,
      filter: filter.value,
      cb: activeCb,
      additionalCheck: selected.value !== nextProps.selected.value,
    });
  }

  componentDidUpdate (prevProps) {
    if (prevProps.selected.value !== this.props.selected.value && this.active) {
      this.item.focus();
    }
  }

  signalFilterAsActive (args) {
    const {
      selected, filter, cb, additionalCheck,
    } = args;
    this.active = selected === filter;

    if (this.active && typeof cb === 'function') {
      // if we passed additionalCheck, check for it
      if (typeof additionalCheck !== 'undefined') {
        return additionalCheck ? cb(filter) : false;
      }
      // otherwise just run cb
      return cb(filter);
    }
  }

  debouncedOnClick () {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.onClick(), 200);
  }

  onClick () {
    const {
      group, filter, selected, callbacks, parentFilter,
    } = this.props;
    const isActive = filter.value === selected.value;
    if (group.notActive || this.active) {
      return false;
    }

    callbacks.apply({
      filter: {
        id: filter.id,
        text: filter.text,
        value: filter.value,
        type: group.type,
        category: filter.autosuggestCategory,
        index: filter.autosuggestIndex,
        parent: parentFilter,
      },
    });
  }

  onDoubleClick (event) {
    clearTimeout(this.timeoutId);
    event.preventDefault();
  }

  renameCb (value) {
    const { callbacks, group, filter } = this.props;
    callbacks.rename({
      group: group.type,
      value,
      id: filter.id,
    });
  }

  applyEventHandlers () {
    const { group } = this.props;

    if (group.rename) {
      return {
        onClick: this.debouncedOnClick,
        onDoubleClick: this.onDoubleClick,
      };
    }
    return {
      onClick: this.onClick,
    };
  }

  switchVisibilityState (event) {
    event.stopPropagation();

    const {
      filter, group, callbacks, filtersConfig,
    } = this.props;
    const hidden = filtersConfig.hiddenFilters[filter.id];

    if (hidden) {
      return callbacks.show(filter.id);
    }
    return callbacks.hide(filter, group);
  }

  render () {
    const renderFilterBody = (editable) => {
      if (editable) {
        return <InlineTextarea content={filter.text} disableTooltip cb={this.renameCb} />;
      }
      return <span className="filter__text">{filter.text}</span>;
    };

    const renderCounter = (counter) => {
      if (counter) {
        return <span className="filter__counter">{formatNumber(filter.counter, false)}</span>;
      }
    };

    const renderAdditionalText = (text) => {
      if (text) {
        return <span className="filter__additional-text">{text}</span>;
      }
    };

    const renderShowHideBtn = (args) => {
      const { canHide, hidden, parentFilterHidden } = args;

      if (!canHide || parentFilterHidden) {
        return null;
      }
      return (
        <span
          className={classNames('filter__hide-switch', {
            '-show': hidden,
          })}
          onClick={this.switchVisibilityState}
        />
      );
    };

    const {
      filter,
      group,
      receiveReady,
      hoveredOverSameGroup,
      selected,
      filtersConfig,
      parentFilter,
    } = this.props;

    const counter = renderCounter(filter.counter);
    const body = renderFilterBody(group.rename);
    const additionalText = renderAdditionalText(filter.additionalText);
    const showHideBtn = renderShowHideBtn({
      canHide: group.dynamic,
      hidden: filtersConfig.hiddenFilters[filter.id],
      parentFilterHidden: parentFilter ? filtersConfig.hiddenFilters[parentFilter.id] : false,
    });

    const active = selected.value === filter.value;

    const eventHandlers = this.applyEventHandlers();

    const output = (
      <li
        className={classNames('filter', {
          '-active': this.active,
          '-receive-ready': receiveReady,
          '-hovered-over-same-group': hoveredOverSameGroup,
        })}
        style={{
          display: this.props.outOfRenderRange ? 'none' : null,
        }}
        tabIndex={0} // without tabIndex you would not be able to put focus on DOM element
        ref={(item) => (this.item = item)}
        {...eventHandlers}
      >
        <div>
          {body}
          {additionalText}
        </div>
        {counter}
        {showHideBtn}
      </li>
    );

    return filter.tooltip ? (
      <Tooltip style={{ fontSize: 13, width: '100%' }} visible={output}>
        {filter.tooltip}
      </Tooltip>
    ) : (
      output
    );
  }
};

ListFilter.propTypes = {
  callbacks: PropTypes.object,
  filter: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  filters: PropTypes.object,
  group: PropTypes.object,
  index: PropTypes.number,
  parentFilter: PropTypes.object,
  readyToDrop: PropTypes.bool,
  sortContainerCb: PropTypes.func, // nu
};

export default ListFilter;
