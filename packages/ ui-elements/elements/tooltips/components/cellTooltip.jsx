/* eslint-disable no-return-assign,jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import '../tooltip.styl';

const getHorisontalExpandDirection = (baseStyles, cloudStyles, offset) => {
  const windowLeft = document.documentElement.scrollLeft;
  const windowRight = windowLeft + window.innerWidth;
  const tooltipCenter = (baseStyles.left + baseStyles.right) / 2;
  const tooltipHalfWidth = cloudStyles.width / 2;
  const tooltipLeft = tooltipCenter - tooltipHalfWidth - offset;
  const tooltipRight = tooltipCenter + tooltipHalfWidth + offset;

  if (tooltipLeft < windowLeft) {
    return 'right';
  } else if (tooltipRight > windowRight) {
    return 'left';
  }
  return 'center';
};

const getVerticalExpandDirection = (baseStyles, cloudStyles, offset) => {
  const windowBottom = window.innerHeight + document.documentElement.scrollTop;
  const tooltipBottom = baseStyles.bottom + cloudStyles.height + offset;

  if (tooltipBottom < windowBottom) {
    return 'down';
  }
  return 'up';
};

const CellTooltip = class extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      coords: {},
      hideCloud: true,
      renderCloud: false,
      horisontalAlign: 'center',
      verticalAlign: 'up',
    };

    this.timeoutID = null;
    this.delay = 500;

    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);

    this.checkTriggerCoords = this.checkTriggerCoords.bind(this);
    this.renderTooltipContent = this.renderTooltipContent.bind(this);
  }

  checkTriggerCoords () {
    this.setState({
      hideCloud: true,
      renderCloud: true,
    });

    if (!this.tooltip || !this.cloud) {
      this.setState({
        renderCloud: false,
      });
      return;
    }

    const hOffset = 20;
    const vOffset = 11;

    const baseStyles = this.tooltip.getBoundingClientRect();
    const cloudStyles = this.cloud.getBoundingClientRect();

    const horisontalExpandDirection = getHorisontalExpandDirection(
      baseStyles,
      cloudStyles,
      hOffset
    );
    const verticalExpandDirection = getVerticalExpandDirection(baseStyles, cloudStyles, vOffset);
    let styles = {};

    switch (horisontalExpandDirection) {
      case 'left': {
        styles = {
          left: -cloudStyles.width + hOffset,
        };
        break;
      }
      case 'right': {
        styles = {
          left: baseStyles.width - hOffset,
        };
        break;
      }
      default:
      case 'center': {
        styles = {
          left: (baseStyles.width - cloudStyles.width) / 2,
        };
        break;
      }
    }

    switch (verticalExpandDirection) {
      case 'down': {
        styles = {
          ...styles,
          top: baseStyles.height + vOffset,
        };
        break;
      }
      default:
      case 'up': {
        styles = {
          ...styles,
          top: -cloudStyles.height - vOffset,
        };
        break;
      }
    }

    this.setState({
      coords: styles,
      hideCloud: false,
      verticalAlign: verticalExpandDirection,
      horisontalAlign: horisontalExpandDirection,
    });
  }

  mouseEnter (event) {
    event.persist();
    clearTimeout(this.timeoutID);
    this.setState({ renderCloud: true });
    this.timeoutID = setTimeout(() => this.checkTriggerCoords(), this.delay);
  }

  mouseLeave () {
    clearTimeout(this.timeoutID);
    this.setState({
      hideCloud: true,
    });
    this.timeoutID = setTimeout(() => this.setState({ renderCloud: false }), 200);
  }

  renderTooltipContent () {
    const {
      hideCloud, renderCloud, coords, horisontalAlign, verticalAlign,
    } = this.state;
    const { children } = this.props;

    if (!children) {
      return '';
    }

    const childrenContent =
      children && children.length > 200 ? `${children.slice(0, 200)}...` : children;

    let content;
    if (renderCloud) {
      content = (
        <div className={classNames('cell-tooltip__wrap', { '--hide': hideCloud })}>
          <div
            className={classNames(
              'cell-tooltip__cloud',
              `-${horisontalAlign}`,
              `-${verticalAlign}`,
              { '--hide': hideCloud }
            )}
            style={coords}
            ref={(cloud) => (this.cloud = cloud)}
          >
            {childrenContent}
          </div>
        </div>
      );
    }
    return content;
  }

  render () {
    const {
      overflow, visible, className, callback, visibleStyle, containerStyle,
    } = this.props;
    const content = this.renderTooltipContent();

    const style = overflow
      ? {
        ...visibleStyle,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        position: 'relative',
      }
      : visibleStyle;

    return (
      <div
        className={classNames('cell-tooltip', className)}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
        onClick={callback}
        ref={(tooltip) => (this.tooltip = tooltip)}
        style={containerStyle}
      >
        {content}
        <div style={style}>{visible}</div>
      </div>
    );
  }
};

CellTooltip.propTypes = {
  className: PropTypes.string,
  callback: PropTypes.func,
  visible: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
  visibleStyle: PropTypes.instanceOf(Object),
  containerStyle: PropTypes.instanceOf(Object),
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.instanceOf(Object)]),
  overflow: PropTypes.bool,
};

CellTooltip.defaultProps = {
  className: '',
  callback: () => {},
  visible: null,
  visibleStyle: {},
  containerStyle: {},
  children: null,
  overflow: false,
};

export default CellTooltip;
