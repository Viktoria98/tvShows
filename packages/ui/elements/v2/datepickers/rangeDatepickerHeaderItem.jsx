/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

const RangeDatepickerHeaderItem = class extends Component {
  onClick () {
    this.props.onItemClick(this.props.param);
  }

  render () {
    return (
      <li
        className={classNames(
          'rangeDatepicker__header__item',
          { '-active': this.props.active }
        )}
        onClick={this.onClick}
      >
        {this.props.text}
      </li>
    );
  }
};

RangeDatepickerHeaderItem.displayName = 'RangeDatepickerHeaderItem';

RangeDatepickerHeaderItem.propTypes = {
  onItemClick: PropTypes.func,
  param: PropTypes.any,
  text: PropTypes.string,
  active: PropTypes.bool,
};

export default RangeDatepickerHeaderItem;
