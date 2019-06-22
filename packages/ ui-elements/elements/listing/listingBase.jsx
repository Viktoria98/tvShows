import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { ComponentHeightResizer } from '../helperComponents/';

import './listing.styl';

const ListingBase = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};

    this.timeoutID = null;
    this.scrollLeft = 0;

    this.moveLockedCols = _.debounce((offset) => props.moveLockedCols(offset), 50);
    this.onScroll = this.onScroll.bind(this);
    this.infiniteScroll = this.infiniteScroll.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.scrollToTop) {
      this.listingBody.scrollTop = 0;
    }
  }

  onScroll (e) {
    // debounce
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(this.infiniteScroll, 50);

    // header horizontal movement
    const left = e.target.scrollLeft;
    if (this.scrollLeft != left) {
      this.listingHeader.style.left = `-${left}px`;
      this.scrollLeft = left;
      if (!_.isEmpty(this.props.lockedCols)) {
        this.moveLockedCols(left);
      }
    }
  }

  infiniteScroll () {
    const {
      loading, onInfiniteScroll, loaded, total,
    } = this.props;

    if (typeof onInfiniteScroll === 'function') {
      if (loading) {
        return false;
      }

      // return if user haven't scrolled to bottom
      const scrolledToBottom =
        this.listingBody.scrollTop + this.listingBody.clientHeight >
        this.listingBody.scrollHeight - 25;
      if (!scrolledToBottom) {
        return false;
      }

      // load items if there are any
      if (loaded < total) {
        onInfiniteScroll();
      }
    }
  }

  render () {
    const { id, header, items } = this.props;

    return (
      <div id={id} className="listing">
        <div ref={(header) => (this.listingHeader = header)} className="listing__header__container">
          {header}
        </div>
        <ComponentHeightResizer offset={60}>
          {(style) => (
            <div
              style={style}
              ref={(body) => (this.listingBody = body)}
              className="listing__body --helpers-custom-scrollbar"
              onScroll={this.onScroll}
            >
              {items}
            </div>
          )}
        </ComponentHeightResizer>
      </div>
    );
  }
};

ListingBase.propTypes = {
  id: PropTypes.string,
  header: PropTypes.element,
  items: PropTypes.array,
  loaded: PropTypes.number,
  loading: PropTypes.bool,
  onInfiniteScroll: PropTypes.func,
  scrollToTop: PropTypes.bool,
  total: PropTypes.number,
};

export default ListingBase;
