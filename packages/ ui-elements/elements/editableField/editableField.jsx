import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Tooltip from '../tooltips/components/cellTooltip.jsx';

import './editableField.styl';

const EditableField = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      edit: false,
      inputValue: props.content || '',
    };

    // keyCodes for input actions (e.g. save/close/etc)
    this.keyCodes = {
      ENTER: 13,
      ESC: 27,
    };

    // keyCodes which we can allow on condition
    // needed for input types such as number or text
    this.allowedKeyCodes = {
      BACKSPACE: 8,
      DELETE: 46,
      ARROW_LEFT: 37,
      ARROW_RIGHT: 39,
      PERIOD: 190,
    };
    if (this.props.inputType !== 'number') {
      this.allowedKeyCodes.SPACE = 32;
    }

    // types of input characters
    this.subTypes = {
      number: {
        regExp: /^[0-9]\d*(\.\d+)?$/,
        message: 'Only numbers allowed',
      },
      custom: {
        regExp: props.validationRegExp,
        message: props.validationErrMessage,
      },
    };

    this.mouseEnter = this.mouseEnter.bind(this);
    this.edit = this.edit.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.saveValue = this.saveValue.bind(this);
    this.closeWithoutSaving = this.closeWithoutSaving.bind(this);
    this.renderCellContent = this.renderCellContent.bind(this);
    this.listener = this.listener.bind(this);
  }

  componentWillReceiveProps (newProps) {
    // hack for server validation
    if (newProps.content !== this.props.content) {
      this.setState({
        inputValue: newProps.content,
      });
      this.close();
    }
  }

  mouseEnter (event) {
    const realWidth = event.target.offsetWidth;
    this.props.mouseEnter(realWidth);
  }

  onKeyDown (event) {
    const { keyCode } = event;
    const { inputType } = this.props;
    const conditionals = {
      // allows user to type in only numbers
      // numpad
      number:
        (keyCode < 48 || keyCode > 57) && // key numbers
        (keyCode < 96 || keyCode > 105),
      // allows user to type only letters and symbols
      text: (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105),
    };

    if (keyCode === this.keyCodes.ENTER) {
      this.saveValue();
    } else if (keyCode === this.keyCodes.ESC) {
      this.closeWithoutSaving();
    } else if (Object.values(this.allowedKeyCodes)
      .some((el) => el === keyCode)) {
      // if user typed allowed key code - don't do anything
      return;
    }

    // if input has specified type and user typed not allowed key (for specific input type)
    // block action from that key (e.g. prevents typing letters in number input etc)
    if (inputType && conditionals[inputType]) {
      event.preventDefault();
    }
  }

  onClick (event) {
    if (event.ctrlKey) {
      event.preventDefault();
      event.stopPropagation();
      this.edit();
    }
  }

  listener (event) {
    // if we clicked inside dropdown body
    if (this.body.contains(event.target)) {
      event.preventDefault();
    } else {
      this.saveValue();
    }
  }

  edit () {
    this.setState({
      edit: true,
    });
    document.addEventListener('click', this.listener);
    setTimeout(() => {
      this.input.focus();
    }, 100);
  }

  saveValue () {
    let { inputValue } = this.state;
    const {
      content, hasServerValidation, inputType, fixedPoint,
    } = this.props;
    if (
      typeof inputValue !== 'undefined' &&
      inputValue !== null &&
      inputValue !== '' &&
      inputType === 'number' &&
      fixedPoint
    ) {
      inputValue = +(+inputValue).toFixed(this.props.fixedPoint);
    }
    // don't save if value wasn't changed
    if (inputValue === content) {
      this.close();
      return;
    }

    if (!inputType && !hasServerValidation) {
      this.props.cb(inputValue);
      this.close();
    } else {
      const passed = this.validate(inputValue);
      if (passed) {
        this.close();
      }
    }
  }

  validate (inputValue) {
    function showHideNotification (message = '') {
      dispatch({ type: 'UPDATE_NOTIFICATION', message, class: '-alert' });
      setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 3000);
    }

    const { hasServerValidation, inputType } = this.props;

    let config = {};
    let passedClient = true;

    if (inputType) {
      config = this.subTypes[inputType];
      passedClient = inputValue.length === 0 || config.regExp.test(inputValue.toString());
    }

    if (passedClient) {
      this.props.cb(inputValue);
    } else {
      showHideNotification(config.message);
      return false;
    }

    if (hasServerValidation) {
      return false;
    }

    this.close();
  }

  close (dontSave) {
    const state = {
      edit: false,
    };

    if (dontSave) {
      state.inputValue = this.props.content;
    }

    this.setState(state);
    document.removeEventListener('click', this.listener);
  }

  closeWithoutSaving () {
    this.close(true);
  }

  onChange (event) {
    const inputValue = event.target.value;
    this.setState({
      inputValue,
    });
  }

  renderCellContent () {
    const { name, link } = this.props;
    const { inputValue } = this.state;

    let cellContent = inputValue;
    if (link) {
      cellContent = (
        <a href={inputValue} onClick={this.onClick} target="_blank">
          {inputValue}
        </a>
      );
    }

    return cellContent;
  }

  render () {
    const { edit, inputValue } = this.state;
    const { expander, cellWidth } = this.props;
    const cellContent = this.renderCellContent();
    const tooltip = (
      <Tooltip visible={cellContent} cellWidth={cellWidth}>
        {cellContent}
      </Tooltip>
    );

    return (
      <div
        ref={(body) => (this.body = body)}
        className={classNames('editable-field', { '-edit': edit })}
        onDoubleClick={this.edit}
      >
        <span
          ref={(wrapper) => (this.wrapper = wrapper)}
          className="editable-field__text"
          onMouseEnter={this.mouseEnter}
          onMouseLeave={this.props.mouseLeave}
        >
          {expander ? tooltip : cellContent}
        </span>
        <input
          ref={(input) => {
            this.input = input;
          }}
          className="editable-field__input"
          type="text"
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          value={inputValue}
        />
      </div>
    );
  }
};

EditableField.propTypes = {
  width: PropTypes.number,
  right: PropTypes.string,
  content: PropTypes.any,
  name: PropTypes.string,
  cb: PropTypes.func,
  inputType: PropTypes.string,
  mouseEnter: PropTypes.func,
  mouseLeave: PropTypes.func,
  hasServerValidation: PropTypes.bool,
  fixedPoint: PropTypes.number,
  link: PropTypes.bool,
  expander: PropTypes.bool,
  cellWidth: PropTypes.number,
};

export default EditableField;
