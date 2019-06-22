/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';

import './formDropdown.styl';

class FormDropdown extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      active: false,
      isSelected: false,
      selectedOption: this.getSelectedOption(this.props),
    };
    this.inputWidth = 0;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.closeClick = this.closeClick.bind(this);
  }

  componentDidMount () {
    this.inputWidth = this.refs.input.offsetWidth;
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps !== this.props) {
      this.setState({ selectedOption: this.getSelectedOption(nextProps) });
    }
  }

  getSelectedOption (props) {
    let selectedOption = 0;
    _.each(props.options, (option, i) => {
      if (option.value === props.selected) {
        selectedOption = i;
      }
    });
    return selectedOption;
  }

  open () { // eslint-disable-line
    if (this.props.disabled) {
      return;
    }
    this.setState({ active: true });
    document.addEventListener('click', this.closeClick, false);
  }

  close () {
    this.setState({ active: false });
    document.removeEventListener('click', this.closeClick, false);
  }

  closeClick (e) { // eslint-disable-line
    this.close();
  }

  setItem (optionIndex) {
    this.setState({
      isSelected: true,
      selectedOption: optionIndex,
    }, () => {
      this.props.onChange(this.props.name, this.props.options[optionIndex].value);
    });
  }


  render () {
    const selected = this.state.selectedOption;
    let containerText = this.props.options[selected].text;
    let containerHint = this.props.options[selected].hint;
    let options;
    let optionsContainer;

    if (this.props.placeholder && !this.state.isSelected) {
      containerText = this.props.placeholder;
      containerHint = '';
    }

    if (this.state.active) {
      options = this.props.options.map((item, index) => {
        const classes = `options__item item_${index}`;
        return (
          <li key={index} className={classes} onClick={() => this.setItem(index)}>
            {item.text}
            <span className="item__hint">{item.hint}</span>
          </li>
        );
      });
      optionsContainer =
        (<div ref="options" className="options" style={{ minWidth: this.inputWidth }}>
          {options}
        </div>);
    }

    return (
      <div
        id={this.props.id}
        className={
          classNames(
            'form__element form__dropdown',
            { '--active': this.state.active },
            { '-disabled': this.props.disabled },
            this.props.className
          )
        }
      >
        <label>{this.props.label}</label>
        <div className="container" onClick={this.open}>
          <input
            ref="input"
            type="text"
            value={containerText}
            disabled
            className={this.props.disabledStyle}
          />
          <span className="input__hint">{containerHint}</span>
          {optionsContainer}
        </div>
      </div>
    );
  }
};

FormDropdown.displayName = 'FormDropdown';

FormDropdown.propTypes = {
  disabledStyle: PropTypes.string,
};

export default FormDropdown;
