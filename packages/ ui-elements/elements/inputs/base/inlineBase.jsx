import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Link from '../../links/link.jsx';
// TODO: move expander handler outside listing folder
import ExpanderHandler from '../../listing/cells/expanderHandler.jsx';
import Tooltip from '../../tooltips/components/cellTooltip.jsx';

import './inlineBase.styl';

const InlineBase = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false,
      cellValue: props.content,
    };

    this.keyCodes = {
      ENTER: 13,
      ESC: 27,
    };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.checkAndClose = this.checkAndClose.bind(this);
    this.callOverlayAndClose = this.callOverlayAndClose.bind(this);
    this.basicKeyListener = this.basicKeyListener.bind(this);
    this.listener = this.listener.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);

    this.throttle = _.throttle(({ url }) => window.open(url, '_blank'), 280, {
      leading: false,
    });
  }

  componentDidMount () {
    if (this.props.openOnMount) {
      this.open();
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.content !== this.props.content) {
      this.setState({
        cellValue: newProps.content,
      });
      this.close();
    }
  }

  callOverlayAndClose () {
    const { overlayCb } = this.props;
    if (overlayCb) {
      const result = overlayCb(this.state);
      this.checkAndClose(result);
    } else {
      this.close();
    }
  }

  basicKeyListener (event) {
    if (event.shiftKey || event.ctrlKey) {
      return;
    }
    const { keyCode } = event;
    if (keyCode === this.keyCodes.ENTER) {
      this.callOverlayAndClose();
    } else if (keyCode === this.keyCodes.ESC) {
      this.close();
    }
  }

  onClick (e) {
    e.preventDefault();
    e.stopPropagation();
    const { cellValue } = this.state;
    this.throttle({ url: cellValue });
  }

  onDoubleClick () {
    this.throttle.cancel();
    this.open();
  }

  listener (event) {
    // if we clicked inside dropdown body
    if (this.body && !this.body.contains(event.target)) {
      this.callOverlayAndClose();
    }
  }

  open () {
    if (this.state.open) {
      return false;
    }
    const {
      data, onOpenCb, readCb, blocked,
    } = this.props;
    if (blocked) {
      return;
    }
    this.setState({
      open: true,
    });
    document.addEventListener('mousedown', this.listener);
    document.addEventListener('keydown', this.basicKeyListener);
    setTimeout(() => {
      if (onOpenCb) {
        onOpenCb();
      }
      if (readCb) {
        readCb(data.id);
      }
    }, 25);
  }

  close () {
    const { unblock } = this.props;
    this.setState({
      open: false,
    });
    // cuz we don't have unblock outside of listing   TODO: refactor
    if (typeof unblock === 'function') {
      unblock();
    }
    document.removeEventListener('mousedown', this.listener);
    document.removeEventListener('keydown', this.basicKeyListener);
  }

  checkAndClose (result) {
    const { focus, block, blocked } = this.props;
    if (result && !result.err && !blocked) {
      this.close();
    } else if (result) {
      block();
      focus();
    }
  }

  render () {
    const renderCellContent = () => {
      const { link, tooltipContentFunc, disableTooltip } = this.props;
      const { cellValue } = this.state;

      let cellContent = cellValue;
      if (link) {
        cellContent = (
          <Link
            className="-no-padding -initial-width"
            href={cellValue}
            text={cellValue}
            onClick={this.onClick}
            static
          />
        );
      }

      const tooltipContent = typeof tooltipContentFunc === 'function' ? tooltipContentFunc() : null;

      if (tooltipContent) {
        cellContent = (
          <Tooltip className="inline-field__text" visible={cellContent}>
            {tooltipContent}
          </Tooltip>
        );
      } else {
        cellContent = (
          <ExpanderHandler
            className="inline-field__text"
            disable={disableTooltip}
            cellContent={cellContent}
          />
        );
      }

      return cellContent;
    };

    const renderInlineContainer = () => {
      const { children, style } = this.props;
      return (
        <div className="inline-field__input" style={style}>
          {children}
        </div>
      );
    };

    const { expander, open, cellValue } = this.state;
    const cellContent = renderCellContent();
    const inlineContainer = open && renderInlineContainer();

    return (
      <div
        ref={(body) => (this.body = body)}
        className={classNames('inline-field', { '-open': open })}
        onDoubleClick={this.onDoubleClick}
      >
        {cellContent}
        {inlineContainer}
      </div>
    );
  }
};

InlineBase.propTypes = {
  cb: PropTypes.func,
  overlayCb: PropTypes.func,
  onOpenCb: PropTypes.func,
  style: PropTypes.object,
  children: PropTypes.element,
  content: PropTypes.string,
  data: PropTypes.object,
  placeholder: PropTypes.string,
  style: PropTypes.object,
};

export default InlineBase;
