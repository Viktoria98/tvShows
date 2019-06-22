import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import DropdownBase from './base/dropdownBase.jsx';
import DropdownItem from './base/dropdownItem.jsx';
import Spinner from '../../spinner/spinnerBase.jsx';

const DropdownAutosuggestPromise = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filteredOptions: props.options,
      response: true,
      renderToTop: false,
      dropdownInputValue: '',
      defaultOptions: props.options,
    };

    this.timeout = false;
    this.optionsLimit = 50;

    this.openCb = this.openCb.bind(this);
    this.selectOption = this.selectOption.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.renderAutosuggestBody = this.renderAutosuggestBody.bind(this);
    this.onChange = this.onChange.bind(this);
    this.debouncedLoadSuggestions = this.debouncedLoadSuggestions.bind(this);
  }

  openCb (dropdownState) {
    this.input.focus();
    this.setState({
      filteredOptions: this.props.options,
      renderToTop: dropdownState.renderToTop,
    });
  }

  debouncedLoadSuggestions (args) {
    const { promiseMethod } = this.props;
    this.setState({
      filteredOptions: [],
      response: false,
    });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      promiseMethod(args);
    }, 500);
  }

  selectOption (value) {
    this.props.cb(value, this.props.multiedit);
    this.base.close(event);
  }

  renderOptions (options) {
    const {
      defaultOption, data, field, btnText,
    } = this.props;

    const optionsArray = options.map((option, i) => {
      // render limited options list
      if (i >= this.optionsLimit) {
        return false;
      }

      const selected =
        typeof option.value === 'object' && option.value.id && data[field]
          ? option.value.id === data[field].id
          : option.text === btnText;

      return (
        <DropdownItem
          key={i}
          selected={selected}
          value={option.value}
          text={option.text}
          meaningText={option.meaningText}
          cb={this.selectOption}
        />
      );
    });

    if (defaultOption) {
      optionsArray.unshift(<DropdownItem
        key="defaultoption"
        selected={!btnText}
        value={defaultOption.value}
        text={defaultOption.text}
        cb={this.selectOption}
      />);
    }

    return optionsArray;
  }

  renderAutosuggestBody (optionsList) {
    const { renderToTop } = this.state;
    const autosuggestInput = (
      <div className="dropdown-autosuggest__input-container">
        <input
          className="dropdown-autosuggest__input"
          onChange={this.onChange}
          type="text"
          ref={(input) => (this.input = input)}
          defaultValue={this.state.dropdownInputValue}
        />
      </div>
    );
    const options = this.state.response
      ? [autosuggestInput, optionsList]
      : [autosuggestInput, optionsList, <Spinner type="sk-fading-circle" />];
    return renderToTop ? [optionsList, autosuggestInput] : options;
  }

  onChange (event) {
    const value = event.target.value;
    this.setState({ dropdownInputValue: value });
    this.debouncedLoadSuggestions({
      name: this.props.field.toLowerCase(),
      value,
    });
  }

  componentWillReceiveProps (nextProps) {
    if (JSON.stringify(nextProps.options) !== JSON.stringify(this.props.options)) {
      this.setState({
        filteredOptions:
          nextProps.options === this.props.options ? this.state.defaultOptions : nextProps.options,
        response: true,
      });
    }
  }

  prepareKeyOptions (optionsList) {
    const readyOptions = [];
    optionsList.forEach((option, i) => {
      if (option && i) {
        readyOptions.push({ value: option.props.value });
      }
    });
    return readyOptions;
  }

  render () {
    const calculateAutosuggestHeight = (options) => {
      const autosuggestInputHeight = 40;
      const items = options.length >= this.optionsLimit ? this.optionsLimit : options.length;
      const optionsContainerHeight = items * 26 + autosuggestInputHeight;
      return optionsContainerHeight;
    };

    const { options } = this.props;
    const { filteredOptions } = this.state;

    const dropdownHeight = calculateAutosuggestHeight(options);
    // render options and body
    const renderedOptions = this.renderOptions(filteredOptions);
    const body = this.renderAutosuggestBody(renderedOptions);
    // prepare array with mapped options for keyPress events on arrows
    const preparedOptions = this.prepareKeyOptions(renderedOptions);

    return (
      <DropdownBase
        {...this.props}
        onOpenCb={this.openCb}
        dropdownHeight={dropdownHeight}
        ref={(base) => (this.base = base)}
        cb={this.selectOption}
        options={preparedOptions}
        dropdownType="autosuggestPromise"
      >
        {body}
      </DropdownBase>
    );
  }
};

DropdownAutosuggestPromise.propTypes = {
  width: PropTypes.number,
  right: PropTypes.string,
  content: PropTypes.string,
  name: PropTypes.string,
  cb: PropTypes.func,
  options: PropTypes.any,
  dropdownWidth: PropTypes.number,
  dropdownType: PropTypes.string,
  promiseMethod: PropTypes.func,
  multiedit: PropTypes.bool,
  defaultOption: PropTypes.object,
  data: PropTypes.object,
  field: PropTypes.string,
  btnText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

DropdownAutosuggestPromise.defaultProps = {
  options: [],
};

export default DropdownAutosuggestPromise;
