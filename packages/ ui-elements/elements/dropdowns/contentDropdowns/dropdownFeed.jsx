import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import DropdownBase from './base/dropdownBase.jsx';
import Feed from '../../feed/feed.jsx';
import Icon from '../../icons/icon.jsx';
import formatNumber from '../../../helpers/formatNumber.js';

const DropdownFeed = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      feedHeight: null,
      feedStyle: null,
    };

    this.windowHeight = null;

    this.openCb = this.openCb.bind(this);
  }

  onScroll (event) {
    event.stopPropagation();
  }

  openCb (dropdownState) {
    const { maxHeight } = dropdownState.optionsCoords;
    const inputHeight = 60;
    const feedHeight = maxHeight ? maxHeight - inputHeight : null;

    this.getMaxHeight();

    this.setState({
      feedHeight,
    });

    if (this.feed && this.feed.textarea && this.feed.textarea.editor) {
      this.feed.textarea.editor.focus();
    }
  }

  getMaxHeight () {
    const { disableActions } = this.props;
    const dropdownBaseDOMElement = _.get(this, 'baseDropdownComponent.base');

    if (dropdownBaseDOMElement) {
      this.windowHeight = window.innerHeight;
      const feedCoords = dropdownBaseDOMElement.getBoundingClientRect();
      const headerHeight = 60;
      let newHeight = !disableActions
        ? this.windowHeight - (feedCoords.top - headerHeight + 32 + 60) - 110
        : this.windowHeight - (feedCoords.top - headerHeight + 62) - 110;

      // quickfix
      // TODO: refactor, check should be smarter than that, thought it works atm
      if (newHeight < 200) {
        newHeight = feedCoords.top - headerHeight - 110;
      }

      this.setState({
        feedStyle: {
          maxHeight: newHeight,
        },
      });
    } else {
      return false;
    }
  }

  componentDidMount () {
    if (!this.props.noMaxHeight) {
      this.getMaxHeight();
    }
  }

  render () {
    const renderBtn = () => {
      const { btnText } = this.props;
      return (
        <div
          className={classNames('dropdown-feed__btn-icon', {
            'dropdown-feed__btn-icon--no-messages': btnText === 0,
          })}
        >
          <Icon type="comments" />
          <div className="dropdown-feed__btn-icon-counter">{formatNumber(btnText, false)}</div>
        </div>
      );
    };

    const {
      data,
      updates,
      markdown,
      showToolbar,
      disableActions,
      currentUserEmail,
      deleteCb,
      cb,
      itemType,
      itemData,
      tooltipContentFunc,
      ...dropdownProps
    } = this.props;

    const btnComponent = renderBtn();
    const dropdownHeight = 250;
    const tooltipContent =
      typeof tooltipContentFunc === 'function' && updates.length
        ? tooltipContentFunc(itemData, updates[updates.length - 1])
        : null;
    const textarea = {
      markdown,
      showToolbar,
    };

    renderBtn();
    return (
      <DropdownBase
        {...dropdownProps}
        dropdownHeight={dropdownHeight}
        ref={(baseDropdownComponent) => (this.baseDropdownComponent = baseDropdownComponent)}
        onOpenCb={this.openCb}
        tooltipContent={tooltipContent}
        btnComponent={btnComponent}
        className="dropdown-feed"
      >
        <Feed
          data={data}
          updates={updates}
          textarea={textarea}
          currentUserEmail={currentUserEmail}
          disableActions={disableActions}
          deleteComment={deleteCb}
          itemType={itemType}
          saveCb={cb}
          mentions={this.props.mentions}
          ref={(feed) => (this.feed = feed)}
          style={this.state.feedStyle}
        />
      </DropdownBase>
    );
  }
};

DropdownFeed.propTypes = {
  disableActions: PropTypes.bool,
  noMaxHeight: PropTypes.bool,
  btnText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  field: PropTypes.string,
  cb: PropTypes.func,
  currentUserEmail: PropTypes.string,
  data: PropTypes.object,
  deleteCb: PropTypes.func,
  disableChevronIcon: PropTypes.bool,
  dropdownWidth: PropTypes.number,
  updates: PropTypes.array,
  markdown: PropTypes.bool,
  showToolbar: PropTypes.bool,
  itemType: PropTypes.string,
  computeTooltipText: PropTypes.func,
};

export default DropdownFeed;
