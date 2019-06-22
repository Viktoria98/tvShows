import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Tooltip from '../../tooltips/components/cellTooltip';
import ExpanderHandler from './expanderHandler';

import formatNumber from '../../../helpers/formatNumber';

const Cell = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentWillMount () {
    const { config = {} } = this.props;
    const { onMount } = config;
    if (typeof onMount === 'function') {
      onMount(this);
    }
  }

  render () {
    const computeData = () => {
      const { config, data } = this.props;
      if (typeof data === 'number' && !config.rawNumber) {
        let num = formatNumber(data);
        if (config.decimal) {
          num = num.includes('.') ? num : `${num}.00`;
        }
        if (config.percent) {
          num = `${num}%`;
        }
        return num;
      }
      if (config.compute) {
        return config.compute(data);
      }
      return data;
    };

    const renderExpander = (content) => {
      const { linkify, blockExpander } = this.props.config;
      if ((blockExpander && !linkify) || !blockExpander) {
        return content;
      }
      if (this.props.config.tooltip) {
        return content;
      }
      return <ExpanderHandler className="cell__wrapper" cellContent={content} linkify={linkify} />;
    };

    const renderTooltip = (content) => {
      const { config, itemData, children } = this.props;
      if (!config.tooltip) {
        return content;
      }

      if (!children) {
        return (
          <Tooltip visible={content} overflow={config.overflow}>
            {config.tooltip(itemData)}
          </Tooltip>
        );
      } else if (!config.tooltipComponentHandler) {
        return (
          <Tooltip visible={children} overflow={config.overflow}>
            {config.tooltip(itemData)}
          </Tooltip>
        );
      }
      return React.cloneElement(children, {
        tooltipContentFunc: config.tooltip,
      });
    };

    const {
      onClick,
      onDoubleClick,
      config = {},
      children,
      data,
      lockOffset,
      startCopy,
      continueCopy,
      endCopy,
      colsCopy,
      rowsCopy,
      columnId,
      itemData,
    } = this.props;
    const { stylize } = config;
    const copying = colsCopy && rowsCopy ?
      colsCopy.includes(columnId) && rowsCopy.includes(itemData.id) : false;

    // by default we render children passed inside cell
    let content = children;
    if (children && _.get(this.props, 'config.onMount')) {
      content = React.cloneElement(content, {
        openOnMount: this.state.openChildren,
      });
    }

    /*
      if cell received child component (e.g. dropdown, autosuggest, input),
      we shouldn't do anything
      since those components handle logic by themselves
     */
    if (!children) {
      content = computeData(data);
      content = renderExpander(content);
    }

    content = renderTooltip(content);

    if (typeof data === 'number' || typeof content === 'number') {
      config.align = 'right';
    }

    // overflow props is not needed for cells with content, expecially with dropdowns
    // overflow by default when overflow isn't specified
    const overflow =
      !config.tooltip && (config.overflow || (!children && config.overflowIfPlain))
        ? {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          position: 'relative',
        }
        : null;

    let style = {
      left: lockOffset || null,
      width: config.width,
      textAlign: config.align,
      ...overflow,
    };

    if (_.isFunction(stylize)) {
      style = { ...style, ...stylize(data) };
    }

    const className = classNames(
      'cell',
      `${config.className || ''}`,
      { '--padding': !children || config.padding },
      { '--locked': lockOffset },
      { '--copying': copying }
    );

    const isBoostingPriority = columnId === 'boostingPriority' && className.search('cell-header') === -1 && content;
    let color = '';
    if (isBoostingPriority) {
      const number = parseInt(content, 10);
      if (number === 1) {
        color = 'yellow';
      }
      if (number === 2) {
        color = 'superyellow';
      }
      if (number === 3) {
        color = 'orange';
      }
      if (number === 4) {
        color = 'red';
      }
      if (number === 5) {
        color = 'superred';
      }
    }
    const childrenElement = isBoostingPriority ? (
      <div
        style={{ display: 'inline-block' }}
        className="labels-container"
      >
        <div className={`label ${color}`} style={{ justifyContent: 'flex-end' }}>
          {content}
        </div>
      </div>
    ) : content;

    return (
      <div
        id={columnId}
        style={style}
        className={className}
        ref={
          (body) => {
            this.body = body;
          }
        }
        role="presentation"
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseDown={() => startCopy && startCopy(columnId, itemData.id)}
        onMouseUp={() => endCopy && endCopy()}
        onMouseEnter={() => rowsCopy && rowsCopy.length && continueCopy(columnId, itemData.id)}
      >
        {childrenElement}
      </div>
    );
  }
};

Cell.defaultProps = {
  config: {},
  data: '',
  itemData: '',
  onClick: () => {},
  onDoubleClick: () => {},
  lockOffset: 0,
  children: undefined,
  startCopy: () => {},
  continueCopy: () => {},
  endCopy: () => {},
  rowsCopy: {},
  columnId: '',
};

Cell.propTypes = {
  config: PropTypes.shape({
    width: PropTypes.number,
    align: PropTypes.string,
    className: PropTypes.string,
    linkify: PropTypes.bool,
    padding: PropTypes.bool,
    tooltip: PropTypes.bool,
    overflow: PropTypes.bool,
    rawNumber: PropTypes.bool,
    blockExpander: PropTypes.bool,
    overflowIfPlain: PropTypes.bool,
    compute: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.bool,
    ]),
    onMount: PropTypes.func,
    tooltipComponentHandler: PropTypes.func,
  }),
  data: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.node,
    PropTypes.array,
    PropTypes.object,
    PropTypes.instanceOf(Date),
  ]),
  itemData: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
    PropTypes.instanceOf(Date),
  ]),
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  lockOffset: PropTypes.number,
  children: PropTypes.node,
  startCopy: PropTypes.func,
  continueCopy: PropTypes.func,
  endCopy: PropTypes.func,
  colsCopy: PropTypes.any, // eslint-disable-line
  rowsCopy: PropTypes.object, // eslint-disable-line
  columnId: PropTypes.string,
};

export default Cell;
