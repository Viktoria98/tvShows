import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ListingBase from './listingBase.jsx';
import RenderHeader from './render/renderHeader.jsx';
import RenderRow from './render/renderRow.jsx';

const Listing = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      blocked: false,
    };

    this.block = this.block.bind(this);
    this.unblock = this.unblock.bind(this);
  }

  componentWillReceiveProps (newProps) {
    if (typeof newProps.blocked !== 'undefined') {
      if (newProps.blocked === true) {
        this.block();
      } else {
        this.unblock(true);
      }
    }
  }

  block () {
    if (!this.state.blocked) {
      this.setState({ blocked: true });
      if (this.props.updateServerBlock) {
        this.props.updateServerBlock({ data: true });
      }
    }
  }

  unblock (server) {
    if (this.state.blocked) {
      this.setState({ blocked: false });
      if (server && this.props.updateServerBlock) {
        this.props.updateServerBlock({ data: false });
      }
    }
  }

  applyColumnSettings () {
    const findColumnSettings = (column) => this.props.colsSettings[column.id];

    const { structure, colsSettings } = this.props;

    if (_.isEmpty(colsSettings)) {
      return structure;
    }

    return structure
      .filter((column) => {
        const settings = findColumnSettings(column);

        return !settings || !_.get(settings, 'hidden');
      })
      .map((column) => {
        const settings = findColumnSettings(column);
        if (settings && settings.width) {
          column.config.width = settings.width;
        }

        return column;
      });
  }

  render () {
    const renderHeader = (additionalProps) => {
      const { headerProps, disableHeaderCheckbox } = this.props;

      return (
        <RenderHeader
          {...headerProps}
          {...additionalProps}
          disableCheckbox={disableHeaderCheckbox}
        />
      );
    };

    const renderItems = (additionalProps) => {
      const {
        itemsProps,
        selected,
        lockedCols,
        lockOffset,
        disableSmartSelection,
        startCopy,
        continueCopy,
        endCopy,
        colsCopy,
        rowsCopy,
      } = this.props;

      const { blocked } = this.state;

      const listingProps = {
        blocked,
        block: this.block,
        unblock: this.unblock,
        selected,
        disableSmartSelection,
        startCopy,
        continueCopy,
        endCopy,
        colsCopy,
        rowsCopy,
      };

      return itemsProps.map((item) => {
        const key = _.get(itemsProps, 'keyId', 'id');
        return <RenderRow key={item.data[key]} {...item} {...additionalProps} {...listingProps} />;
      });
    };

    const { id, dataProps, scrollToTop, lockOffset } = this.props;
    const structure = this.applyColumnSettings();

    const commonProps = {
      lockedCols: dataProps.lockedCols,
      lockOffset,
      structure,
    };
    const header = renderHeader(commonProps);
    const items = renderItems(commonProps);

    return <ListingBase id={id} {...dataProps} scrollToTop={scrollToTop} header={header} items={items} />;
  }
};

Listing.propTypes = {
  id: PropTypes.string,
  headerProps: PropTypes.object,
  itemsProps: PropTypes.array,
  colsSettings: PropTypes.object,
  structure: PropTypes.array,
  dataProps: PropTypes.shape({
    loaded: PropTypes.number,
    loading: PropTypes.bool,
    onInfiniteScroll: PropTypes.func,
    scrollToTop: PropTypes.bool,
    total: PropTypes.number,
  }),
  updateServerBlock: PropTypes.func,
  selected: PropTypes.shape({
    all: PropTypes.bool,
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }),
};

export default Listing;
