import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Icon from '../../v2/icons/icon';

const Checkbox = class extends Component { // eslint-disable-line
  constructor (props) {
    super(props);
    this.check = this.check.bind(this);
    this.state = {
      checked: props.checked || false,
    };
  }

  componentWillReceiveProps (props) {
    if (typeof props.checked !== 'undefined') {
      if (this.props.checked !== props.checked) {
        this.setState({ checked: props.checked });
      }
    }
  }

  check (event) {
    event.stopPropagation();
    this.setState({
      checked: !this.state.checked,
    }, () => {
      this.props.onCheck(this.state.checked, this.props.name);
    });
  }

  render () {
    const numRnd = Math.round((Math.random() * (1000000000 - 1)) + 1);
    return (
      <div id={this.props.id} className={classNames('checkbox', { '-error': this.props.error })}>
        <input id={`${this.props.id}Checkbox${numRnd}`} type="checkbox" checked={this.state.checked} onChange={this.check} />
        <label htmlFor={`${this.props.id}Checkbox${numRnd}`}>
          <Icon type="check" />
          <div className={classNames('label', { '-hidden': !this.props.label, '-required': this.props.required })}>{this.props.label}</div>
        </label>
      </div>
    );
  }
};

Checkbox.propTypes = {
  error: PropTypes.bool,
  checked: PropTypes.bool,
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onCheck: PropTypes.func,
  required: PropTypes.bool,
};

export default Checkbox;
