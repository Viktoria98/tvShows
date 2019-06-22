import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ListingHeader from '../listingHeader.jsx';
import Cell from '../cells/cell.jsx';
import CellHeader from '../cells/cellHeader.jsx';
import SystemCheckbox from '../cells/systemCheckbox.jsx';
import Indicator from '../../indicators/indicator.jsx';

import { findComponentProps } from '../helpers.js';

// TODO: make it stateless
const RenderHeader = class extends Component {
  constructor (props) {
    super(props);
    this.findSortData = this.findSortData.bind(this);
  }

  findSortData (cellName) {
    const { sortOrder } = this.props;
    if (sortOrder) {
      if (cellName === sortOrder.column) {
        return sortOrder.order;
      }
    }
    return 0;
  }

  render () {
    const renderRow = () => {
      const {
        structure, lockedCols, lockOffset, onResize, propsPackage,
      } = this.props;

      return structure.map((columnProps) => {
        const {
          id, config, component, displayField, valueField, sortField,
        } = columnProps;

        const sortName = sortField || valueField || displayField;
        const colLeftOffset = lockedCols && lockedCols.includes(id) ? lockOffset : 0;

        const key = `${id}Header`;

        const componentsGenerator = {
          checkboxSystem () {
            const { disableCheckbox } = this.props;
            checkboxProps = {
              ...findComponentProps(propsPackage, component, id),
              disableCheckbox,
            };

            return (
              <Cell key={key} config={config} columnId={id} lockOffset={colLeftOffset}>
                <SystemCheckbox {...checkboxProps} />
              </Cell>
            );
          },

          indicatorSystem () {
            return (
              <Cell key={key} config={config} columnId={id}>
                <Indicator {...findComponentProps(propsPackage, component, id)} />
              </Cell>
            );
          },
        };

        const standartHeaderCell = (
          <CellHeader
            {...propsPackage.sortable}
            key={key}
            columnId={id}
            config={config}
            onResize={onResize}
            sortName={sortName}
            sortOrder={this.findSortData(sortName)}
            lockOffset={colLeftOffset}
          />
        );

        const content = componentsGenerator[component]
          ? componentsGenerator[component].call(this)
          : standartHeaderCell;

        return content;
      });
    };

    const headerRow = renderRow();

    return <ListingHeader content={headerRow} />;
  }
};

RenderHeader.propTypes = {
  sortOrder: PropTypes.object,
  onResize: PropTypes.func,
  structure: PropTypes.array.isRequired,
  propsPackage: PropTypes.object,
};

RenderHeader.defaultProps = {
  propsPackage: {},
};

export default RenderHeader;
