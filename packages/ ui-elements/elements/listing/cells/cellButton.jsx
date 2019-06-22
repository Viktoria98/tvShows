/**
 * I didn't delete it only for one purpose, we are using btn inside gmail extension
 * but I didn't implement replacement for CellButton, so when we will take a look at extension,
 * we will create new component according to new structure, and this one will go to trash
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class CellButton extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.onClick = this.onClick.bind(this);
  }

  onClick (event) {
    if (this.props.preventDefault) {
      event.preventDefault();
      event.stopPropagation();
    }

    const {
      cb, content, cellText, name,
    } = this.props;
    if (cb && typeof cb === 'function') {
      cb(content || cellText, name);
    }
  }

  render () {
    const {
      // width,
      // right,
      content,
      cellText,
      showModal,
    } = this.props;
    // There is no sense to do additional width and align settings, cell component already has that
    const style = {
      // width,
      // textAlign: right ? 'right' : 'left',
    };
    if (content || cellText) {
      return (
        <div
          className={classNames('cell', 'cell-button', {
            '-popup': !!showModal,
          })}
          style={style}
          onClick={this.onClick}
        >
          {cellText || content}
        </div>
      );
    }
    return null;
  }
}

CellButton.propTypes = {
  cb: PropTypes.func,
  name: PropTypes.string,
  showModal: PropTypes.bool,
  preventDefault: PropTypes.bool,
  cellText: PropTypes.oneOf([PropTypes.string, PropTypes.number, PropTypes.element]),
  content: PropTypes.any,
};

export default CellButton;
