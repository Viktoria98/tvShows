import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Cell from './cell.jsx';
import ResizeMarker from './resizeMarker.jsx';
import Icon from '../../icons/icon.jsx';
import Tooltip from '../../tooltips/components/fixedTooltip.jsx';

const CellHeader = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      resizeOffset: 0,
      tooltip: false,
    };

    this.timeoutID = null;
    this.timeoutDuration = 1000;

    this.onResize = this.onResize.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount () {
    if (this.container) {
      const el = ReactDOM.findDOMNode(this.container);
      if (el.offsetWidth < el.scrollWidth && !this.state.tooltip) {
        this.setState({ tooltip: true });
      }
    }
  }

  onResize (offset) {
    const { onResize, config, columnId } = this.props;
    const { resizeOffset } = this.state;

    if (typeof onResize === 'function') {
      this.setState({ resizeOffset: resizeOffset + offset });

      clearTimeout(this.timeoutID);
      this.timeoutID = setTimeout(() => {
        onResize({ column: columnId, width: config.width + resizeOffset });
        this.setState({ resizeOffset: 0 });
      }, this.timeoutDuration);
    }
  }

  onClick (event) {
    const { cb, sortName, sortOrder } = this.props;
    // invert sortOrder (i.e. 1 -> -1 || -1 -> 1) return 1 if sortOrder is undefined
    const order = -sortOrder || 1;
    cb(sortName, order);
  }

  render () {
    const getText = (text) => {
      if (this.state.tooltip) {
        return (
          <Tooltip visible={text} className="text-ellipsis">
            <span>{text}</span>
          </Tooltip>
        );
      }

      return <span>{text}</span>;
    };

    const addSortFunctionality = () => {
      const { name, sortable } = this.props.config;
      if (!sortable) {
        return name;
      }

      return (
        <div className="cell-header__wrapper">
          <div
            className="cell-header__text cell-header__text--sortable"
            onClick={this.onClick}
            ref={(i) => (this.container = i)}
          >
            {getText(name)}
          </div>
          <div>
            <Icon type="chevron" className="cell-header__sort-icon" />
          </div>
        </div>
      );
    };

    const addResizeFunctionality = (content, resize) => {
      if (!resize) {
        return content;
      }

      // we need to wrap plain text inside div with specific styles
      // if we are going to place it inside resizible column
      if (typeof content === 'string') {
        content = <div className="cell-header__text">{this.props.config.name}</div>;
      }
      return (
        <div>
          {content}
          <ResizeMarker className="cell-header__resize-marker" onResize={this.onResize} />
        </div>
      );
    };
    const constructClassname = () => {
      const { sortOrder } = this.props;
      let sortClass = '';
      if (sortOrder > 0) {
        sortClass = 'cell-header--sort-asc';
      }
      if (sortOrder < 0) {
        sortClass = 'cell-header--sort-desc';
      }
      return `cell-header ${sortClass}`;
    };

    const { config, onResize } = this.props;

    const columnIsResizable = onResize && !config.blockResize;

    // TODO: make header align specifically
    const className = constructClassname();
    const extendedConfig = {
      ...config,
      className,
      width: config.width + this.state.resizeOffset,
      overflow: !columnIsResizable, // resizible column doesn't need overflow on its container
      align: 'left',
      tooltip: false,
      compute: false,
    };

    let content = addSortFunctionality();
    content = addResizeFunctionality(content, columnIsResizable);

    return <Cell {...this.props} config={extendedConfig} data={config.name} children={content} />;
  }
};

CellHeader.propTypes = {
  cb: PropTypes.func,
  config: PropTypes.object,
  onResize: PropTypes.func,
  sortName: PropTypes.string,
  sortOrder: PropTypes.number,
};

export default CellHeader;
