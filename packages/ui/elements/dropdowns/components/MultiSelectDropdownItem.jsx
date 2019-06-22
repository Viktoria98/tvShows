import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

const MultiselectDropdownItem = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      expander: false,
      showExpander: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.trigger = this.trigger.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);

    this.moveExpander = this.moveExpander.bind(this);
  }

  handleClick () {
    if (this.props.selected) {
      this.props.remove(this.props.name, this.props.value, this.props.label);
    } else {
      this.props.add(this.props.name, this.props.value, this.props.label);
    }
  }

  trigger (event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.deleteItem(this.props.index);
  }

  moveExpander () {
    const expander = this.refs.expander;
    // Calculate and return length of the hidden part of expander
    function calculateDifference () {
      const expanderParent = expander.parentElement;

      const expanderWidth = expander.getBoundingClientRect().width;
      const expanderParentWidth = expanderParent.getBoundingClientRect().width;

      return (expanderWidth - expanderParentWidth);
    }
    // Calculate and return (in seconds) proper transition-duration
    // based on length of the hidden part of expander
    function calculateTransitionDuration (diff) {
      if (diff > 450) {
        return 9;
      } else if (diff > 300) {
        return 7;
      } else if (diff > 150) {
        return 4;
      } else if (diff > 100) {
        return 3;
      }
      return 2;
    }

    const difference = calculateDifference();
    const transitionDuration = calculateTransitionDuration(difference);

    expander.style.transform = `translateX(-${difference}px)`;
    expander.style.transitionDuration = `${transitionDuration}s`;
  }

  handleMouseEnter () {
    if (this.refs.expander) {
      this.setState({
        showExpander: true,
      });
      // without setTimeout transition won't apply on elements with display:none
      setTimeout(this.moveExpander, 200);
    }
  }

  handleMouseLeave () {
    if (this.refs.expander) {
      this.setState({
        showExpander: false,
      });
      this.refs.expander.style.transform = '';
      this.refs.expander.style.transitionDuration = '';
    }
  }

  createExpander (label) {
    return (
      <span
        className={classNames(
          'dropdown__expander',
          { '-visible': this.state.showExpander }
        )}
        ref="expander"
      >
        {label}
      </span>
    );
  }

  render () {
    let counter;
    let closeButton;
    let trimmedLabel;
    let expander;
    const label = this.props.label;

    if (this.props.count) {
      counter = (<span className="dropdown__list__item__counter">
        <span className="fake">{this.props.count}</span>
        <span className="real">{this.props.count}</span>
      </span>);
    }
    if (this.props.removable) {
      closeButton = <span className="dropdown__list__item__remover" onClick={this.trigger} />;
    }

    if (this.props.button) {
      return (
        <button
          className={classNames('dropdown__inner__button', { '-disabled': this.props.disabled })}
          onClick={this.props.cb}
        >
          {label}
        </button>
      );
    }

    if (label && label.length > 64) {
      expander = this.createExpander(label);
      trimmedLabel = `${label.substring(0, 64)}...`;
      this.state.expander = true;
    } else {
      trimmedLabel = label;
    }
    return (
      <li // eslint-disable-line
        className={
          classNames(
            'dropdown__list__item',
            { '-active': this.props.selected },
            { '-expandable': this.state.expander }
          )}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {trimmedLabel}
        {counter}
        {closeButton}
        {expander}
      </li>
    );
  }
};

MultiselectDropdownItem.displayName = 'MultiselectDropdownItem';

MultiselectDropdownItem.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.array,
  ]),
  label: PropTypes.string,
  count: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  index: PropTypes.number,
  selected: PropTypes.bool,
  removable: PropTypes.bool,
  add: PropTypes.func,
  remove: PropTypes.func,
  deleteItem: PropTypes.func,
  button: PropTypes.bool,
  disabled: PropTypes.bool,
  cb: PropTypes.func,
};

export default MultiselectDropdownItem;
