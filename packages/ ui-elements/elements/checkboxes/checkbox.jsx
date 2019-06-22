import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../icons/icon.jsx';

import './checkboxes.styl';

const Checkbox = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      focused: false,
    };
    this.check = this.check.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
  }

  check (event) {
    event.stopPropagation();
    this.props.onCheck(this.props.name);
  }

  focus () {
    this.setState({ focused: true });
  }

  blur () {
    this.setState({ focused: false });
  }

  render () {
    const {
      id, label, checked, error, style, view,
    } = this.props; // style not used
    let labelEl;
    let check;

    if (label) {
      labelEl = <span className="checkbox__label">{label}</span>;
    }
    if (checked) {
      switch (view) {
        case 'list':
          check = <Icon type="shape" className="checkbox__check" />;
          break;
        default:
          check = <Icon type="checked_row" className="checkbox__check" />;
          break;
      }
    }

    return (
      <div
        id={id}
        className={classNames('checkbox', {
          '-error': error,
          '-checked': checked,
        })}
        onClick={this.check}
      >
        <input
          className="checkbox__input"
          type="checkbox"
          onFocus={this.focus}
          onBlur={this.blur}
        />
        <div
          className={classNames('checkbox__box', {
            '-focused': this.state.focused,
          })}
        >
          {check}
        </div>
        {labelEl}
      </div>
    );
  }
};

Checkbox.propTypes = {
  id: PropTypes.string,
  error: PropTypes.bool,
  checked: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onCheck: PropTypes.func,
  view: PropTypes.string,
};

export default Checkbox;
