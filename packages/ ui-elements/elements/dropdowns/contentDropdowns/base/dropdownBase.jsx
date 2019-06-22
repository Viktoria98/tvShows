import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Icon from '../../../icons/icon.jsx';
import Tooltip from '../../../tooltips/components/cellTooltip.jsx';

import './dropdownBase.styl';

const DropdownBase = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false,
      containerCoords: {},
      optionsCoords: {},
      arrowCoords: {},
      renderToTop: false,
      horizontalDirection: '',
    };

    this.keyCodes = {
      ESC: 27,
    };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.listener = this.listener.bind(this);
    this.basicKeyListener = this.basicKeyListener.bind(this);
    this.calculateAbsoluteCoords = this.calculateAbsoluteCoords.bind(this);
  }

  open (event) {
    // works only for dropdownTextarea, since we have working links in btn there
    if (event.target.tagName === 'A') {
      return;
    }

    const { base } = this;
    const {
      data, onOpenCb, readCb, dropdownType, blocked,
    } = this.props;
    if (blocked) {
      return;
    }
    const coords = this.calculateAbsoluteCoords(base);

    this.setState({
      open: true,
      ...coords,
    });
    document.addEventListener('click', this.listener);

    // subscribe all dropdowns to basicKeyListener actions, such as pressing ESC
    document.addEventListener('keydown', this.basicKeyListener);

    // bcs setState works not immidiately
    // without setTimeout we will pass in callback old state
    setTimeout(() => {
      if (onOpenCb) {
        onOpenCb(this.state);
      }
      _.isFunction(readCb) && readCb(data.id);
    }, 50);
  }

  close (event) {
    const { onCloseCb, dropdownType, unblock } = this.props;
    if (typeof unblock === 'function') {
      unblock();
    }
    this.setState({
      open: false,
    });
    document.removeEventListener('click', this.listener);
    document.removeEventListener('keydown', this.basicKeyListener);

    if (onCloseCb) {
      setTimeout(() => onCloseCb(this.state), 50);
    }
  }

  listener (event) {
    const { body } = this;
    const { overlayCb, shouldStayOpen } = this.props;
    const { target } = event;

    // if we clicked inside dropdown body
    if (body && body.contains(target)) {
      // if callback shouldStayOpen was passed from child component and returns true
      // should be used as exception
    } else if (shouldStayOpen && shouldStayOpen(target)) {
      event.preventDefault();
    } else {
      // TODO: check if we use that overlayCb, looks like we don't
      if (overlayCb) {
        overlayCb(this.state);
      }
      this.close();
    }
  }

  basicKeyListener (event) {
    switch (event.keyCode) {
      case this.keyCodes.ESC:
        event.preventDefault();
        event.stopPropagation();
        this.close();
        break;
    }
  }

  calculateAbsoluteCoords (base) {
    const calculateWidth = (styles) => {
      styles.width = dropdownWidth;
    };
    const calculateHorizontalCoords = (styles, optionsStyles, arrowStyles) => {
      const offset = 30;
      expandDirection =
        expandDirection || checkHorizontalViewportShift(styles, offset, expandDirection);

      switch (expandDirection) {
        case 'right':
          this.setState({
            horizontalDirection: 'left',
          });
          styles.right = -styles.width + offset;
          arrowStyles.right = styles.width - offset;
          break;
        case 'left':
          this.setState({
            horizontalDirection: 'right',
          });
          styles.left = -styles.width + offset;
          arrowStyles.left = styles.width - offset;
          break;
        case 'byParentWidth':
          styles.maxWidth = baseCoords.width;
          if (styles.width < styles.maxWidth) {
            styles.right = 0;
            arrowStyles.left = styles.width - offset;
          } else {
            arrowStyles.left = '50%';
            arrowStyles.transform = 'translate(-50%)';
          }
          break;
        case 'center':
        default:
          styles.right = -(dropdownWidth / 2) + 10;
          arrowStyles.left = '50%';
          arrowStyles.transform = 'translate(-50%)';
          break;
      }
    };
    const calculateVerticalCoords = (styles, optionsStyles, arrowStyles) => {
      const { dropdownHeight } = this.props;
      const body = base.offsetParent;
      const bodyCoords = body.getBoundingClientRect();

      const distanceToBottom = bodyCoords.bottom - baseCoords.bottom;
      const distanceToTop = baseCoords.top - bodyCoords.top;

      // if cell is positioned too low and opened dropdown will cause vertical gaps
      if (baseCoords.top + baseCoords.height + dropdownHeight + 20 > window.innerHeight - 20) {
        if (distanceToBottom <= distanceToTop) {
          this.setState({
            renderToTop: true,
          });

          styles.top = 'auto';
          styles.bottom = '110%';

          if (expandDirection === 'center') {
            arrowStyles.transform = 'translate(-50%) rotate(180deg)';
          }
        } else {
          this.setState({
            renderToTop: false,
          });
        }
        optionsStyles.maxHeight = Math.max(distanceToTop, distanceToBottom) - 45;
      }
    };

    const checkHorizontalViewportShift = (styles, offset, expandDirection) => {
      const windowWidth = window.innerWidth;
      const leftPos = baseCoords.width - styles.width / 2;
      const rightDropdownCorner = baseCoords.left + leftPos + styles.width;
      const leftDropdownCorner = baseCoords.left + leftPos - 10;

      if (rightDropdownCorner > windowWidth) {
        return 'left';
      } else if (leftDropdownCorner < 10) {
        return 'right';
      }
      return expandDirection || 'center';
    };

    let { dropdownWidth, expandDirection, fixedHeight } = this.props;
    const baseCoords = base.getBoundingClientRect();
    dropdownWidth = dropdownWidth || baseCoords.width;

    const styles = {};
    const optionsStyles = {};
    const arrowStyles = {};

    calculateWidth(styles);
    calculateHorizontalCoords(styles, optionsStyles, arrowStyles);

    if (!fixedHeight) {
      calculateVerticalCoords(styles, optionsStyles, arrowStyles);
    } else if (fixedHeight && typeof fixedHeight === 'number') {
      // we can set fixedHeight of dropdown as number
      optionsStyles.maxHeight = fixedHeight;
    }

    return {
      containerCoords: styles,
      optionsCoords: optionsStyles,
      arrowCoords: arrowStyles,
    };
  }

  //  without this scrolling dropdown body can trigger parrent scrolling, e.g. listing body etc

  dontPropagate (event) {
    event.stopPropagation();
  }

  render () {
    const renderBtn = () => {
      const {
        btnText,
        btnPlaceholder,
        btnComponent,
        btnClassName,
        disableChevronIcon,
        tooltipContent,
        selectedOption, // not used
      } = this.props;

      let content = null;
      const propsObj = {
        className: `dropdown-base__btn-text ${btnClassName || ''}`,
      };

      // dropdown btn can switch chevron icon (i.e. disable if needed)
      // disabled icon also will change some paddings inside btn
      let icon;
      if (!disableChevronIcon) {
        icon = <Icon className="dropdown-base__chevron-icon" type="chevron_listing" />;
      }

      // we can pass inside btn specific component, like in tagEditor dropdown
      if (btnComponent) {
        let btnContent = btnComponent;
        if (!btnComponent.length && btnPlaceholder) {
          btnContent = btnPlaceholder;
        }
        content = <div {...propsObj}>{btnContent}</div>;
        // or we can pass inside just simple text
      } else {
        let text = btnText;
        // we can pass inside dropdown btnPlaceholder
        // prop will be used if dropdownBtn doesn't have text to show and has placeholder passed as prop
        if (!btnText && btnPlaceholder) {
          text = btnPlaceholder;
        }
        content = <div {...propsObj} dangerouslySetInnerHTML={{ __html: text }} />;
      }

      // wrap content in tooltip if needed
      // tooltip text is computed on the higher level, using function passed from listingStructure
      if (tooltipContent) {
        content = <Tooltip visible={content}>{tooltipContent}</Tooltip>;
      }

      return (
        <div
          className={classNames('dropdown-base__btn', {
            'dropdown-base__btn--no-chevron': disableChevronIcon,
          })}
          onClick={this.open}
        >
          {content}
          {icon}
        </div>
      );
    };

    const renderDropdownBody = () => {
      const {
        containerCoords,
        optionsCoords,
        arrowCoords,
        renderToTop,
        horizontalDirection,
      } = this.state;
      const { children } = this.props;

      return (
        <div className="dropdown-base__body" ref={(body) => (this.body = body)}>
          <div className="dropdown-base__options-container" style={containerCoords}>
            <ul
              className="dropdown-base__options --helpers-custom-scrollbar"
              style={optionsCoords}
              onScroll={this.dontPropagate}
              onClick={this.dontPropagate}
              onDoubleClick={this.dontPropagate}
            >
              {children}
            </ul>
            <Icon
              type="arrow"
              className={classNames('dropdown-base__container-pointer', {
                '-arrow-down': renderToTop,
              })}
              style={arrowCoords}
            />
          </div>
        </div>
      );
    };

    const { className, tooltip } = this.props;
    const { open } = this.state;

    const dropdownBody = open ? renderDropdownBody() : false;
    const dropdownBtn = renderBtn();

    return (
      <div
        className={classNames('dropdown-base', className, { '-open': open })}
        ref={(base) => (this.base = base)}
      >
        {dropdownBtn}
        {dropdownBody}
      </div>
    );
  }
};

DropdownBase.propTypes = {
  fixedHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  width: PropTypes.number,
  right: PropTypes.bool,
  content: PropTypes.any,
  cellClass: PropTypes.string,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  border: PropTypes.string,
  name: PropTypes.string,
  cb: PropTypes.func,
  dropdownType: PropTypes.string,
  onOpenCb: PropTypes.func,
  onCloseCb: PropTypes.func,
  overlayCb: PropTypes.func,
  shouldStayOpen: PropTypes.func,
  dropdownHeight: PropTypes.number,
  dropdownWidth: PropTypes.number,
  dontCalculateHeight: PropTypes.bool,
  expandDirection: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  btnText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  btnPlaceholder: PropTypes.string,
  btnComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array, // why array?
  ]),
  btnClassName: PropTypes.string,
  disableChevronIcon: PropTypes.bool,
  tooltipContent: PropTypes.node,
  selectedOption: PropTypes.object, // not used
};

export default DropdownBase;
