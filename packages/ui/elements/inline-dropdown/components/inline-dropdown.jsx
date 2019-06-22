import React from 'react';
import PropTypes from 'prop-types';

import DropdownBase from './dropdown-base.jsx';
import DropdownItem from './dropdown-item.jsx';

export default class Dropdown extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      selectedOption: this.props.selectedOption,
      btnComponent: this.props.btnComponent,
    };

    this.selectOption = this.selectOption.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.selectedOption !== nextProps.selectedOption) {
      this.setState({
        selectedOption: nextProps.selectedOption,
        btnComponent: nextProps.btnComponent,
      });
    }
  }

  selectOption (value) {
    if (value !== this.state.selectedOption) {
      this.props.onUpdate(this.props.ident, value, (indexingStatus, indexingPriority) => {
        this.setState({
          selectedOption: indexingPriority,
          btnComponent: this.props.createBtnComponent(indexingStatus, indexingPriority),
        });
      });
    }

    this.base.close();
  }

  render () {
    const renderOptions = () => {
      const { options } = this.props;

      const optionsArray = options.map((option, i) => (
        <DropdownItem
          key={i}
          selected={option.value === this.state.selectedOption}
          value={option.value}
          text={option.text}
          meaningText={option.meaningText}
          cb={this.selectOption}
        />
        ));

      return optionsArray;
    };

    const { options } = this.props; // eslint-disable-line
    const selectedOption = this.state.selectedOption; // eslint-disable-line
    const optionsToRender = renderOptions();

    return this.props.disabled ? null :
    (
      <DropdownBase
        {...this.props}
        selectedOption={this.state.selectedOption}
        btnComponent={this.state.btnComponent}
        ref={(base) => {
          this.base = base;
          return this.base;
        }}
      >
        {optionsToRender}
      </DropdownBase>
    );
  }
}

Dropdown.displayName = 'Dropdown';

Dropdown.propTypes = {
  selectedOption: PropTypes.number,
  ident: PropTypes.number,
  btnComponent: PropTypes.object,
  createBtnComponent: PropTypes.func,
  options: PropTypes.array,
  onUpdate: PropTypes.func,
  disabled: PropTypes.bool,
};
