import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DropdownBase from './base/dropdownBase.jsx';
import DropdownItem from './base/dropdownItem.jsx';
import ListKeyActionsContainer from '../../helperComponents/listKeyActionsContainer.jsx';

const Dropdown = class extends Component {
  constructor (props) {
    super(props);
    this.selectOption = this.selectOption.bind(this);
  }

  selectOption (value) {
    const { multiedit, data } = this.props;
    this.props.cb(value, multiedit, data);
    this.base.close();
  }

  render () {
    const { options, tooltipContentFunc, selectedOption } = this.props;
    const renderOptions = (options, hovered) => {
      const { btnText, defaultOption } = this.props;

      const optionsArray = options.map((option, i) => (
        <DropdownItem
          key={i}
          selected={option.text === btnText}
          value={option.value}
          text={option.text}
          meaningText={option.meaningText}
          chosen={i == hovered}
          cb={this.selectOption}
        />
      ));

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
    };

    const optionsToRender = (
      <ListKeyActionsContainer items={options} onSelect={this.selectOption}>
        {({ hovered }) => renderOptions(options, hovered)}
      </ListKeyActionsContainer>
    );

    const dropdownHeight = optionsToRender.length * 26 + 8;
    const tooltipContent =
      typeof tooltipContentFunc === 'function' ? tooltipContentFunc(selectedOption) : null;

    return (
      <DropdownBase
        {...this.props}
        ref={(base) => (this.base = base)}
        tooltipContent={tooltipContent}
        dropdownHeight={dropdownHeight}
        dropdownType="dropdown"
      >
        {optionsToRender}
      </DropdownBase>
    );
  }
};

Dropdown.propTypes = {
  width: PropTypes.number,
  right: PropTypes.bool,
  cellClass: PropTypes.string,
  content: PropTypes.string,
  name: PropTypes.string,
  cb: PropTypes.func,
  close: PropTypes.func,
  options: PropTypes.arrayOf({
    text: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    meaningText: PropTypes.string,
  }),
  dropdownType: PropTypes.string,
  multiedit: PropTypes.bool,
  data: PropTypes.object,
  btnClassName: PropTypes.string,
  btnText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultOption: PropTypes.object,
  selectedOption: PropTypes.object,
  field: PropTypes.string,
  computeTooltipText: PropTypes.func,
};

export default Dropdown;
