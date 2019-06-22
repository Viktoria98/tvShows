import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './list.styl';

const InfiniteScrollList = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      scrollTop: 0,
      clientHeight: 0,
    };

    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount () {
    this.updateScroller();
  }

  updateScroller () {
    const { startAt, rowHeight } = this.props;

    let scrollTop = 0;
    if (startAt) {
      // this one is not finished, won't work from the box
      scrollTop = startAt * rowHeight;
      this.container.scrollTop = scrollTop;
    }

    const clientHeight = this.container.clientHeight;
    this.setState({ scrollTop, clientHeight });
  }

  onScroll (event) {
    const { items, rowHeight } = this.props;
    this.setState({
      scrollTop: this.container.scrollTop,
      clientHeight: this.container.clientHeight,
    });
  }

  calculcateRange () {
    const { scrollTop, clientHeight } = this.state;
    const { rowHeight } = this.props;

    const first = Math.floor(scrollTop / rowHeight);
    const last = Math.floor(clientHeight / rowHeight) + first;
    return {
      first,
      last,
    };
  }

  render () {
    const renderItems = () => {
      const { items, rowHeight } = this.props;
      const { first, last } = this.calculcateRange();

      const height = items.length * rowHeight;

      const els = [];

      for (let i = first; i < last; i++) {
        const item = items[i];
        const even = item % 2 === 0;
        const style = {
          background: even && 'lightgray',
          height: rowHeight,
        };
        els.push(<div key={i} style={style} className="infinite__item">
          {item}
        </div>);
      }

      const topOffset = first * rowHeight;

      return (
        <div
          style={{
            paddingTop: topOffset,
            height,
            boxSizing: 'border-box',
          }}
        >
          {els}
        </div>
      );
    };

    const itemsToRender = renderItems();

    return (
      <div
        ref={(container) => (this.container = container)}
        onScroll={this.onScroll}
        className="infinite__container"
      >
        {itemsToRender}
      </div>
    );
  }
};

InfiniteScrollList.propTypes = {
  items: PropTypes.array,
  rowHeight: PropTypes.number,
};

export default InfiniteScrollList;
