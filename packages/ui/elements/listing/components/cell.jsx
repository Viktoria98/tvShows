/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import { Dispatch as dispatch } from 'meteor/meteorflux:meteorflux';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import FixedTooltip from '../../v2/tooltips/components/fixedTooltip';
import Icon from '../../v2/icons/icon';

/* eslint-disable react/jsx-no-bind */

function findSelectedOption (optionsArray) {
  if (optionsArray) {
    for (const option of optionsArray) { // eslint-disable-line
      if (option.selected) {
        return option.name;
      }
    }
  }
  return '';
}

export default class Cell extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      expander: false,
      dropdown: false,
      dropdownSelected: findSelectedOption(props.dropdown),
      copyValue: '',
    };

    this.mouseEnter = this.mouseEnter.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);

    this.handleDropdownClick = this.handleDropdownClick.bind(this);
    this.createCellDropdown = this.createCellDropdown.bind(this);
    this.changeOptionName = this.changeOptionName.bind(this);
    this.startDrag = this.startDrag.bind(this);
    this.continueDrag = this.continueDrag.bind(this);
    this.handleDrag = _.throttle(this.handleDrag, 50);
    this.stopDrag = this.stopDrag.bind(this);
  }

  click (event) { // eslint-disable-line
    if (event.altKey) {
      event.stopPropagation();
      if (!this.refs.hiddenCopyValue.value || this.props.id === 'abstract') {
        return;
      }
      this.refs.hiddenCopyValue.select();
      document.execCommand('copy');
      dispatch('NOTIFICATION', { message: 'Copied to clipboard' });
    } else if (event.target.className === 'link' && typeof event.target.dataset.href === 'string') {
      event.stopPropagation();
      window.open(event.target.dataset.href, '_blank');
    }
  }

  doubleClick () {
    let propName;
    if (typeof this.props.doubleClick === 'function') {
      propName = this.props.className;
      this.props.doubleClick.call(this, propName, this.props.itemId); // eslint-disable-line
    }
  }

  mouseEnter () {
    let copyValue = '';
    if (this.contentIsReactElement()) {
      let labels;
      const cellObj = this.props.value.props;
      if (cellObj.hasOwnProperty('labels')) { // eslint-disable-line
        labels = cellObj.labels;
        for (let i = 0; i < labels.length; i++) {
          copyValue += copyValue !== '' ? ' ' : '';
          if (typeof labels[i] === 'object') {
            copyValue += labels[i].name;
          } else {
            copyValue += labels[i];
          }
        }
      } else if (cellObj.date) {
        copyValue = cellObj.date;
      } else {
        copyValue = this.props.value.props.children;
      }
    }
    this.setState({ copyValue });
    if (this.props.value) {
      const child = this.refs.child;
      const parent = this.refs.parent;
      if (!this.props.dontWrapContent &&
          !this.props.wrapped &&
          child.clientWidth + 12 >= parent.clientWidth) {
        this.setState({ expander: true });
      }
    }
  }

  mouseLeave () {
    if (this.state.expander) {
      this.setState({ expander: false });
    }
  }

  handleDropdownClick (event) {
    event.stopPropagation();
    this.setState({
      dropdown: !this.state.dropdown,
    });
  }

  changeOptionName (name) {
    this.setState({
      dropdownSelected: name,
    });
  }


  createCellDropdown (optionsArray) {
    const dropdownList = optionsArray.map((option) => (
      // eslint-disable-next-line
      <li
        className={classNames(
          'cell-dropdown__option',
          { '-selected': option.name === this.state.dropdownSelected }
        )}
        onClick={(event) => {
          this.handleDropdownClick(event);
          this.changeOptionName(option.name);
          option.callback(event);
        }
        }
        data-value={option.value}
      >
        {option.name}
      </li>
    ));
    const dropdownEl = (
      <div className="cell-dropdown">
        <div className="cell-dropdown__btn" onClick={this.handleDropdownClick}>
          {this.state.dropdownSelected}
        </div>
        <div className={classNames('cell-dropdown__content', { '-visible': this.state.dropdown })}>
          {dropdownList}
        </div>
        <div
          className={classNames(
          'cell-dropdown__close',
          { '-visible': this.state.dropdown }
        )}
          onClick={this.handleDropdownClick}
        />
      </div>
    );

    return dropdownEl;
  }

  prepareOnClick (cellContent) {
    const oldOnClick = cellContent.props.onClick;
    return (e) => {
      if (!e.altKey) {
        oldOnClick(e);
      }
    };
  }

  startDrag (e) {
    e.stopPropagation();
    this.colNum = this.props.xPos; // eslint-disable-line
    if (this.colNum < 0) {
      return;
    }
    const htmlCell = ReactDOM.findDOMNode(this);
    this.initWidth = +htmlCell.offsetWidth;
    this.colName = htmlCell.id;
    this.startX = e.clientX;
    document.onmousemove = this.continueDrag;
    document.onmouseup = this.stopDrag;
  }

  continueDrag (e) {
    this.handleDrag(e);
  }

  handleDrag (e) {
    const newWidth = this.initWidth + (e.clientX - this.startX);
    if (newWidth > 20 && this.colNum > -1) {
      this.context.setColumnWidth(this.colNum, this.colName, newWidth);
    }
  }

  setWidth (width) {
    const htmlCell = ReactDOM.findDOMNode(this);
    const leftPosStyle = htmlCell.style.left;
    const styleStr = `min-width: ${width}px !important; max-width: ${width}px !important;`;
    htmlCell.style = (leftPosStyle) ? `${styleStr} left: ${leftPosStyle};` : styleStr;
  }

  contentIsReactElement () {
    return React
      .isValidElement(this.props.value);
  }

  stopDrag (e) { // eslint-disable-line
    this.startX = null;
    this.initWidth = null;
    this.colNum = -1;
    document.onmousemove = null;
    document.onmouseup = null;
  }

  moveLeft (offestLeft) {
    ReactDOM.findDOMNode(this).style.left = `${offestLeft}px`;
  }

  stopPropagation (e) {
    e.stopPropagation(e);
  }

  render () {
    const cellContent = this.props.value;
    if (this.contentIsReactElement() && cellContent.props.onClick) {
      cellContent.props.onClick = this.prepareOnClick(cellContent);
    }
    let expander = false;
    let controls = false;
    let dropdown = false;
    let content = null;
    let resizer = null;
    if (this.props.dropdown) {
      dropdown = this.createCellDropdown(this.props.dropdown);
    }
    if (this.state.expander) {
      expander = <span ref="expander" className="expander">{cellContent}</span>;
    }
    if (this.props.editable) {
      const iconEdit = <Icon type="stylus" size="contain" className="center--xy" />;
      const iconDelete = <Icon type="basket" size="contain" className="center--xy" />;
      controls = (<div className="cell__controls">
        <FixedTooltip
          visible={iconEdit}
          callback={this.props.edit.bind(null, this.props.value)}
        >
          Edit
        </FixedTooltip>
        <FixedTooltip visible={iconDelete} callback={this.props.remove}>Delete</FixedTooltip>
      </div>);
    }
    if (this.props.listingCell) { // eslint-disable-line
      resizer = (
        <div
          className="resizer-hor-r"
          onMouseDown={this.startDrag}
          onClick={this.stopPropagation}
        />
      );
    }
    if (this.props.dontWrapContent) {
      content = cellContent;
    } else {
      content = (
        <span ref="child" className={classNames('content', { '-wrapper': !this.props.wrapped })}>
          {cellContent}{this.props.tooltip}
        </span>
      );
    }
    let widthClass = '';
    if (this.props.width !== undefined) {
      widthClass = `-w${this.props.width.toString()}`;
    }
    const style = {};
    if (this.props.width % 10 > 0) {
      style.minWidth = this.props.width;
      style.maxWidth = this.props.width;
    }
    if (!this.props.freezed) {
      style.left = 0;
    }
    return (
      <div
        id={this.props.id}
        className={classNames('cell',
                              this.props.className,
                              { '-freezed': this.props.freezed },
                              { '-editable': this.props.editable },
                              { '-right': this.props.right },
                              { '-expired': this.props.expired },
                              { listingCell: this.props.listingCell },
                              widthClass)}
        style={style}
        ref="parent"
        onClick={this.click.bind(this)}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
        onDoubleClick={this.doubleClick.bind(this)}
      >
        <input
          ref="hiddenCopyValue"
          value={this.state.copyValue || this.props.value}
          className="hiddenCopyInput"
        />
        {resizer}
        {content}
        {expander}
        {controls}
        {dropdown}
      </div>
    );
  }
}

Cell.displayName = 'Cell';

Cell.propTypes = {
  value: PropTypes.any,
  wrapped: PropTypes.bool,
  dontWrapContent: PropTypes.bool,
  freezed: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  dropdown: PropTypes.array,
  copyValue: PropTypes.string, // eslint-disable-line
  tooltip: PropTypes.object,
  editable: PropTypes.bool,
  expired: PropTypes.bool,
  width: PropTypes.number,
  right: PropTypes.bool,
  doubleClick: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  edit: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  remove: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
};

Cell.contextTypes = {
  setColumnWidth: PropTypes.func,
};
