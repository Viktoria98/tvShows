import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// TODO: Uncomment when you'll be able to check it on AAD
// import { Label } from '../../labels/';

const Pill = class extends Component {
  constructor (props) {
    super(props);
    this.onClose = this.onClose.bind(this);
  }

  onClose () {
    const { onClose, item } = this.props;
    _.isFunction(onClose) && onClose(item);
  }

  render () {
    const {
      item, checked, disabled, showRemoveIcon,
    } = this.props;
    const getName = (i) => `${i.category}: ${i.text}`;
    const getButton = () =>
      (showRemoveIcon ? <div className="tag__delete-btn" onClick={this.onClose} /> : null);
    return (
      <li
        className={classNames('filter-item', {
          selected: checked.includes(item) || disabled,
        })}
      >
        <span className={classNames('tag', { '--padding': showRemoveIcon })}>
          <span className="tag__text">{getName(item)}</span>
          {getButton()}
        </span>
      </li>
    );
  }

  // TODO: Uncomment when you'll be able to check it on AAD
  // and replace current render func, this code uses universal Label component
  // render() {
  //   const { item, checked, disabled, showRemoveIcon } = this.props;
  //
  //   const value = `${item.category}: ${item.text}`;
  //   const disableCb = showRemoveIcon ? this.onClose : null;
  //
  //   return (
  //     <li className={classNames('filter-item', {'selected': (checked.includes(item) || disabled)})}>
  //       <Label value={value} onDisable={disableCb} />
  //     </li>
  //   );
  // }
};

Pill.propTypes = {
  checked: PropTypes.array,
  item: PropTypes.object,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Pill;
