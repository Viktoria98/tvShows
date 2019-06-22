/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import '../tooltip.styl';

const FixedTooltip = class extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      coords: {},
      renderCloud: false,
      align: 'up',
    };

    this.checkTriggerCoords = this.checkTriggerCoords.bind(this);
    this.renderTooltipContent = this.renderTooltipContent.bind(this);
  }

  checkTriggerCoords () {
    if (!this.tooltip || !this.cloud) {
      return;
    }

    const windowTop = document.documentElement.scrollTop;
    const tooltipRect = this.tooltip.getBoundingClientRect();
    const cloudHeight = this.cloud.getBoundingClientRect().height;
    const leftShiftCoords = tooltipRect.width / 2;
    const offset = 30;

    if (tooltipRect.top - cloudHeight - offset > windowTop) {
      this.setState({
        coords: {
          top: tooltipRect.top - cloudHeight,
          left: tooltipRect.left + leftShiftCoords,
        },
        align: 'up',
      });
    } else {
      this.setState({
        coords: {
          top: tooltipRect.bottom,
          left: tooltipRect.left + leftShiftCoords,
        },
        align: 'down',
      });
    }
  }

  renderTooltipContent () {
    const { children } = this.props;
    const { coords, align } = this.state;

    if (!children) {
      return '';
    }

    return (
      <div
        className={classNames('fixed-tooltip__cloud', align)}
        ref={(cloud) => {
          this.cloud = cloud;
        }}
        style={coords}
      >
        {children}
      </div>
    );
  }

  render () {
    const { className, callback, visible } = this.props;
    const content = this.renderTooltipContent();

    return (
      <div
        className={classNames('fixed-tooltip', className)}
        onMouseEnter={this.checkTriggerCoords}
        onKeyPress={() => {}}
        onClick={callback}
        ref={(tooltip) => {
          this.tooltip = tooltip;
        }}
      >
        {content}
        {visible}
      </div>
    );
  }
};

FixedTooltip.propTypes = {
  className: PropTypes.string,
  callback: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.object]),
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
};

FixedTooltip.defaultProps = {
  className: '',
  callback: () => {},
  visible: '',
  children: '',
};

export default FixedTooltip;
