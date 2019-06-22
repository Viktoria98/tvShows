import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './list.styl';

const InfiniteScrollHorizontalList = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      scrollLeft: 0,
      clientWidth: 0,
    };

    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount () {
    this.updateScroller();
  }

  updateScroller () {
    const { startAt, rowWidth } = this.props;

    let scrollLeft = 0;
    if (startAt) {
      scrollLeft = startAt * rowWidth;
      this.container.scrollLeft = scrollLeft;
    }

    const clientWidth = this.container.clientWidth;
    this.setState({ scrollLeft, clientWidth });
  }

  onScroll (event) {
    const { items, rowWidth } = this.props;
    this.setState({
      scrollLeft: this.container.scrollLeft,
      clientWidth: this.container.clientWidth,
    });

    this.header.scrollLeft = this.container.scrollLeft;
  }

  calculcateRange () {
    const { scrollLeft, clientWidth } = this.state;
    const { rowWidth } = this.props;

    const first = Math.floor(scrollLeft / rowWidth);
    const last = Math.floor(clientWidth / rowWidth) + first;
    return {
      first,
      last,
    };
  }

  prepareItemsData (first, last) {
    const { items, rowWidth } = this.props;
    const els = [];

    for (let i = first; i < last; i++) {
      const item = items[i];
      const even = item % 2 === 0;
      const style = {
        background: even && 'lightgray',
        width: rowWidth,
      };
      els.push(<div key={i} style={style} className="infinite-horizontal__item">
        {item}
      </div>);
    }
    return els;
  }

  render () {
    const renderHeader = (width, leftOffset, els) => (
      <div
        style={{
          width,
          boxSizing: 'border-box',
          display: 'flex',
          height: '30px',
          paddingLeft: leftOffset,
        }}
      >
        {els}
      </div>
    );
    const renderItems = (width, leftOffset, els) => {
      const { rows } = this.props;
      const rowStyle = {
        display: 'flex',
        height: '80px',
      };

      const rowsToRender = [];
      for (let i = 0; i < rows; i++) {
        rowsToRender.push(<div key={`row_${i}`} style={rowStyle}>
          {els}
        </div>);
      }

      return (
        <div
          style={{
            paddingLeft: leftOffset,
            width,
            boxSizing: 'border-box',
          }}
        >
          {rowsToRender}
        </div>
      );
    };

    const { items, rowWidth } = this.props;
    const { first, last } = this.calculcateRange();

    const width = items.length * rowWidth;
    const leftOffset = first * rowWidth;
    const els = this.prepareItemsData(first, last);

    const itemsToRender = renderItems(width, leftOffset, els);
    const header = renderHeader(width, leftOffset, els);

    return (
      <div>
        <div ref={(header) => (this.header = header)} className="infinite-horizontal__header">
          {header}
        </div>
        <br />
        <div
          ref={(container) => (this.container = container)}
          onScroll={this.onScroll}
          className="infinite-horizontal__container"
        >
          {itemsToRender}
        </div>
      </div>
    );
  }
};

InfiniteScrollHorizontalList.propTypes = {
  items: PropTypes.array,
  rows: PropTypes.number,
  rowWidth: PropTypes.number,
};

export default InfiniteScrollHorizontalList;
