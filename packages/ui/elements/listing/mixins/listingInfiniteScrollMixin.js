// import _ from 'lodash';

export default {
  waitingData: false,
  scrollYTimeoutId: null,

  componentDidMount () {
    this.store()
      .addDataListener(this._dataListener);
    this.store()
      .addDestroyListener(this._destroyListener);
    this.refs.listing.listingScrollArea()
      .addEventListener('scroll', this._onScroll);
    window.addEventListener('keydown', this._onKeyPress);
  },

  componentWillUnmount () {
    window.removeEventListener('keydown', this._onKeyPress);
  },

  componentDidUpdate () {
    this.waitingData = false;
    const height = `${this._calculateListingHeight()}px`;
    this.refs.listing.wrap().style.maxHeight = height;
  },

  _dataListener () {
    this.waitingData = false;
  },

  _destroyListener () {
    if (this.refs.listing) {
      this.refs.listing.listingScrollArea()
        .removeEventListener('scroll', this._onScroll);
    }
  },

  _onKeyPress (event) {
    const keyCodes = {
      ARROW_LEFT: 37,
      ARROW_UP: 38,
      ARROW_RIGHT: 39,
      ARROW_DOWN: 40,
    };
    const tagName = event.target.tagName.toUpperCase();
    if (tagName !== 'INPUT' && tagName !== 'BUTTON' && tagName !== 'TEXTAREA') {
      switch (event.keyCode) {
        case keyCodes.ARROW_LEFT:
          this.refs.listing.listingScrollArea().scrollLeft -= 10;
          break;
        case keyCodes.ARROW_UP:
          this.refs.listing.listingScrollArea().scrollTop -= 10;
          break;
        case keyCodes.ARROW_RIGHT:
          this.refs.listing.listingScrollArea().scrollLeft += 10;
          break;
        case keyCodes.ARROW_DOWN:
          this.refs.listing.listingScrollArea().scrollTop += 10;
          break;
        default:
          break;
      }
    }
  },

  _addData () {
    this.waitingData = true;
    // eslint-disable-next-line
    Dispatch('ADD_DATA'); // eslint-disable
  },

  _onScroll () {
    const scrollLeft = this.refs.listing.listingScrollArea().scrollLeft;
    if (this.store().scrollLeft !== scrollLeft) {
      this.refs.listing.header().scrollLeft = scrollLeft;
      const freezedColumnsCount = this.store()
        .getCurrentFreezedColumnsCount();
      if (freezedColumnsCount) {
        this.refs.listing.moveFreezedCols(scrollLeft, freezedColumnsCount);
      }
      this.store().scrollLeft = scrollLeft;
    }

    if (this.scrollYTimeoutId) {
      clearTimeout(this.scrollYTimeoutId);
    }
    this.scrollYTimeoutId = setTimeout(() => {
      if (this.waitingData) {
        return true;
      }
      const scrolled = this.refs.listing.listingScrollArea().scrollTop;
      if (this.store().scrolled !== scrolled) {
        const overallHeight = this.refs.listing.listingScrollArea().childNodes[0].clientHeight;
        const visibleHeight = this.refs.listing.listingScrollArea().clientHeight;
        if (visibleHeight > overallHeight - scrolled - 150) {
          const dataLength = Object.keys(this.store().data).length;
          const newDataLength = Object.keys(this.store().newData).length;
          if (this.store().count !== dataLength + newDataLength) {
            this._addData();
          }
        }
      }
      this.store().scrolled = scrolled;
      return this.store().scrolled;
    }, 500);
  },

  _calculateListingHeight () {
    const wh = window.innerHeight;
    let offset = this.refs.listing.wrap().offsetTop;
    if (offset > 500) { // hack to calculate height on pages with elements above
      offset = 0;
    }
    const bottomPadding = 14;
    return Math.abs(wh - (offset + bottomPadding));
  },
};
