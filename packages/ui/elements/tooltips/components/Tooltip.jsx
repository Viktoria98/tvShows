import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

export default class Tooltip extends React.Component {
  constructor (props) {
    super(props);
    this.initialState = this.initialState.bind(this);
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.lockTooltip = this.lockTooltip.bind(this);
    this.unlockTooltip = this.unlockTooltip.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = this.initialState();
  }

  initialState () {
    return {
      active: false,
      locked: false,
      direction: null,
      top: -9999,
      left: -9999,
    };
  }

  showTooltip () {
    const pos = this.refs.trigger.getBoundingClientRect();
    const direction = this.props.direction;
    let top;
    let left;

    if (!this.scrollArea) {
      const scrollArea = this.refs.trigger.closest('.listing__scrollarea');
      if (scrollArea) {
        this.scrollArea = scrollArea;
      }
    }

    if (this.scrollArea) {
      this.scrollArea.style.transform = 'none';
    }

    if (this.props.direction === 'right') {
      top = (pos.top + (pos.height / 2)) - (this.refs.cloud.clientHeight / 2);
      left = pos.right;
    } else if (this.props.direction === 'left') {
      top = (pos.top + (pos.height / 2)) - (this.refs.cloud.clientHeight / 2);
      left = pos.left - this.refs.cloud.clientWidth;
    } else {
      top = pos.top - this.refs.cloud.clientHeight;
      left = (pos.left + (pos.width / 2)) - (this.refs.cloud.clientWidth / 2);
    }

    this.setState({
      active: true,
      direction: direction ? `-${direction}` : '-up',
      top,
      left,
    });
  }

  hideTooltip () {
    if (!this.state.locked) {
      if (this.scrollArea) {
        this.scrollArea.style.transform = '';
      }
      this.setState({
        active: false,
        direction: null,
        top: -9999,
        left: -9999,
      });
    }
  }

  lockTooltip () {
    this.setState({ locked: true });
  }

  unlockTooltip () {
    this.setState({
      active: false,
      locked: false,
      top: -9999,
      left: -9999,
    });
  }

  handleClick () {
    if (this.props.onClick) {
      this.props.onClick(this.props.onClickParams);
    }
    if (this.props.lockable) {
      this.lockTooltip();
    }
  }

  render () {
    return (
      <div
        className={classNames('tooltipsy', this.props.className)}
        onMouseEnter={this.showTooltip}
        onMouseLeave={this.hideTooltip}
        onClick={this.handleClick}
      >
        <div
          className={classNames('trigger', { '-pointer': this.props.lockable })}
          ref="trigger"
        >
          {this.props.visible}
        </div>
        <div
          className={
            classNames('cloud', { '-visible': this.state.active }, this.state.direction, this.props.cloudClassName)
          }
          style={{ top: `${this.state.top}px`, left: `${this.state.left}px` }}
          ref="cloud"
        >
          {this.props.children}
          <div className={classNames('helper', { '-visible': this.props.lockable })}>Click to lock tooltip</div>
        </div>
        <div className={classNames('closer', { '-visible': this.state.locked })} onClick={this.unlockTooltip} />
      </div>
    );
  }

}

Tooltip.displayName = 'Tooltip';

Tooltip.propTypes = {
  direction: PropTypes.string,
  className: PropTypes.string,
  cloudClassName: PropTypes.string,
  lockable: PropTypes.bool,
  visible: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]),
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]),
  onClick: PropTypes.func,
  onClickParams: PropTypes.any,
};
