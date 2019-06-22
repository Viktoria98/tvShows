import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListKeyActionsContainer from '../../helperComponents/listKeyActionsContainer.jsx';

import DropdownItem from './base/dropdownItem.jsx';
import DropdownBase from './base/dropdownBase.jsx';

const DropdownAutosuggest = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filteredOptions: props.options,
      value: '',
    };

    this.optionsLimit = 50;

    this.openCb = this.openCb.bind(this);
    this.selectOption = this.selectOption.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.addOption = this.addOption.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (JSON.stringify(nextProps.options) !== JSON.stringify(this.props.options)) {
      this.setState({
        filteredOptions: nextProps.options.filter((option) => option.text === this.state.value),
      });
    }
  }

  onKeyDown (event) {
    const keyCodes = {
      ENTER: 13,
    };
    if (event.keyCode === keyCodes.ENTER) {
      this.addOption(event.target.value);
      event.preventDefault();
      event.stopPropagation();
    }
  }

  addOption () {
    const { multiedit, data } = this.props;
    const value = this.state.value;
    if (value) {
      this.props.cb(value, multiedit, data);
    }
  }

  openCb () {
    this.input.focus();
    this.setState({
      filteredOptions: this.props.options,
    });
  }

  selectOption (value) {
    const { multiedit, data } = this.props;
    this.props.cb(value, multiedit, data);
    this.base.close(event);
  }

  onChange (event) {
    const { value } = event.target;
    const filteredOptions = this.props.options.filter((option) => {
      if (option.text) {
        return option.text.toLowerCase()
          .indexOf(value.toLowerCase()) > -1;
      }
    });

    this.setState({
      filteredOptions,
      value,
    });
  }

  render () {
    const {
      btnText, defaultOption, addNewOptions, tooltipContentFunc,
    } = this.props;
    const renderOptions = (options, hovered) => {
      const optionsArray = options.map((option, i) => {
        // render limited options list
        if (i >= this.optionsLimit) {
          return false;
        }

        return (
          <DropdownItem
            key={i}
            selected={option.text === btnText}
            value={option.value}
            text={option.text}
            meaningText={option.meaningText}
            chosen={i == hovered}
            cb={this.selectOption}
          />
        );
      });

      if (defaultOption) {
        optionsArray.push(<DropdownItem
          key="defaultOption"
          selected={!btnText}
          value={defaultOption.value}
          text={defaultOption.text}
          cb={this.selectOption}
        />);
      }

      return optionsArray;
    };

    const renderAutosuggestBody = (optionsList) => {
      const additionalProps = {};
      if (addNewOptions) {
        additionalProps.onKeyDown = this.onKeyDown;
      }

      const autosuggestInput = (
        <div className="dropdown-autosuggest__input-container">
          <input
            className="dropdown-autosuggest__input"
            onChange={this.onChange}
            type="text"
            ref={(input) => (this.input = input)}
            {...additionalProps}
          />
        </div>
      );

      const result = (
        <div>
          {autosuggestInput}
          {optionsList}
        </div>
      );
      return result;
    };

    const calculateAutosuggestHeight = () => {
      const { defaultOption, options } = this.props;
      const autosuggestInputHeight = 40;
      const items =
        options.length >= this.optionsLimit
          ? this.optionsLimit
          : defaultOption ? options.length + 1 : options.length;
      const optionsContainerHeight = items * 26 + autosuggestInputHeight + 5;
      return optionsContainerHeight;
    };

    const { filteredOptions } = this.state;

    const dropdownHeight = calculateAutosuggestHeight();
    // render options and body
    let renderedOptions;
    if (addNewOptions) {
      renderedOptions = <div>{renderOptions(filteredOptions, null)}</div>;
    } else {
      renderedOptions = (
        <ListKeyActionsContainer
          choseDefault={!addNewOptions}
          items={filteredOptions}
          onSelect={this.selectOption}
        >
          {({ hovered }) => renderOptions(filteredOptions, hovered)}
        </ListKeyActionsContainer>
      );
    }

    const body = renderAutosuggestBody(renderedOptions);
    // prepare array with mapped options for keyPress events on arrows

    const tooltipContent =
      typeof tooltipContentFunc === 'function' ? tooltipContentFunc({ text: btnText }) : null;

    return (
      <DropdownBase
        {...this.props}
        onOpenCb={this.openCb}
        dropdownHeight={dropdownHeight}
        ref={(base) => (this.base = base)}
        tooltipContent={tooltipContent}
        dropdownType="autosuggest"
      >
        {body}
      </DropdownBase>
    );
  }
};

DropdownAutosuggest.propTypes = {
  width: PropTypes.number,
  right: PropTypes.string,
  content: PropTypes.string,
  name: PropTypes.string,
  cb: PropTypes.func,
  options: PropTypes.any, // should be an array
  dropdownWidth: PropTypes.number,
  dropdownType: PropTypes.string,
  addNewOptions: PropTypes.bool,
  btnText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  data: PropTypes.object,
  defaultOption: PropTypes.object,
  field: PropTypes.string,
  multiedit: PropTypes.bool,
};

DropdownAutosuggest.defaultProps = {
  options: [],
};

export default DropdownAutosuggest;
