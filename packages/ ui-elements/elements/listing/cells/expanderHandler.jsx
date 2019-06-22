import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import anchorme from 'anchorme';

import TooltipCloud from '../../tooltips/components/tooltipCloud.jsx';
import formatNumber from '../../../helpers/formatNumber.js';

const ExpanderHandler = class extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      expander: false,
      coords: {},
    };

    this.timeoutID = null;
    this.delay = 300;

    this.linkify = this.linkify.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.checkTriggerCoords = this.checkTriggerCoords.bind(this);
  }

  linkify (text) {
    return {
      __html: anchorme(text, {
        attributes: [
          {
            name: 'target',
            value: '_blank',
          },
        ],
      }),
    };
  }

  checkTriggerCoords (event) {
    const coords = event.target.getBoundingClientRect();
    const cellWidth = event.target.parentElement.offsetWidth;
    const leftShiftCoords = cellWidth / 2;
    this.setState({
      coords: {
        top: coords.top,
        left: coords.left + leftShiftCoords,
      },
    });
  }

  mouseEnter (event) {
    event.persist();
    this.timeoutID = setTimeout(
      () => this.checkCellWidth(event, this.checkTriggerCoords),
      this.delay
    );
  }

  mouseLeave () {
    clearTimeout(this.timeoutID);
    if (this.state.expander) {
      this.setState({ expander: false });
    }
  }

  checkCellWidth (event, callback) {
    const realWidth = event.target.offsetWidth;
    const cellWidth = event.target.parentElement.offsetWidth;
    const paddings = 2;
    if (realWidth + paddings > cellWidth) {
      this.setState({ expander: true }, callback(event));
    }
  }

  render () {
    const { linkify } = this.props;
    let { cellContent } = this.props;
    cellContent = typeof cellContent === 'number' ? formatNumber(cellContent) : cellContent;
    const tooltip =
      this.state.expander && !this.props.disable ? (
        <TooltipCloud coords={this.state.coords} content={cellContent} />
      ) : (
        ''
      );
    return (
      <span
        ref={(wrapper) => (this.wrapper = wrapper)}
        className={this.props.className}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
        onDoubleClick={() => {
          this.setState({ expander: false });
        }}
      >
        {linkify ? <span dangerouslySetInnerHTML={this.linkify(cellContent)} /> : cellContent}
        {tooltip}
      </span>
    );
  }
};

ExpanderHandler.propTypes = {
  className: PropTypes.string,
  cellContent: PropTypes.any,
  linkify: PropTypes.bool,
};

export default ExpanderHandler;
