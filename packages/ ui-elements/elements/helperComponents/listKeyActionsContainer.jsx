import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const keyCodes = {
  ENTER: 13,
  ESC: 27,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
};

const MOVE_PREV = -1;
const MOVE_NEXT = 1;

const ListKeyActionsContainer = class extends Component {
  constructor (props) {
    super(props);
    this.state = { position: 0 };
    this.keyListener = this.keyListener.bind(this);
  }

  componentDidMount () {
    document.addEventListener('keydown', this.keyListener);
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.keyListener);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.items !== undefined) {
      this.setState({ position: 0 });
    }
  }

  saveValue () {
    const { onSelect, items } = this.props;
    const { position } = this.state;
    if (typeof onSelect === 'function' && _.nth(items, position)) {
      onSelect(items[position].value);
    }
  }

  keyListener (event) {
    const { items } = this.props;
    const { position } = this.state;
    const { keyCode } = event;

    const choose = (act) => {
      event.preventDefault();
      event.stopPropagation();
      if (act === MOVE_PREV && position > 0) {
        return this.setState({ position: position - 1 });
      }

      if (act === MOVE_NEXT && position < items.length - 1) {
        return this.setState({ position: position + 1 });
      }
    };

    switch (keyCode) {
      case keyCodes.ENTER:
        this.saveValue();
        break;

      case keyCodes.ARROW_DOWN:
        choose(MOVE_NEXT);
        break;

      case keyCodes.ARROW_UP:
        choose(MOVE_PREV);
        break;
    }
  }

  render () {
    return <div>{this.props.children({ hovered: this.state.position })}</div>;
  }
};

ListKeyActionsContainer.propTypes = {
  items: PropTypes.array,
  onSelect: PropTypes.func,
};

export default ListKeyActionsContainer;
