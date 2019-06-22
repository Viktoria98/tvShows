import PropTypes from 'prop-types';
import React from 'react';
import Base from '../_dropdownBase';
import RangeDatepicker from '../../../datepickers/rangeDatepicker.jsx';

export default class RangeDatepickerDropdown extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      text: this.props.text,
    };

    this.onChange = this.onChange.bind(this);
    this.updateText = this.updateText.bind(this);
  }

  componentWillReceiveProps (props) {
    if (props.text !== this.state.text) {
      this.updateText(props.text);
    }
  }

  updateText (text) {
    this.setState({ text });
  }

  onChange (args) {
    this.refs.base.setState({ open: false });
    this.props.onChange(args);
  }

  render () {
    return (
      <Base
        ref="base"
        className="datepicker"
        disabled={this.props.disabled}
        buttonIcon={this.props.icon}
        buttonText={this.state.text}
        align="right"
      >
        <RangeDatepicker
          tabs={this.props.tabs}
          maximumDate={this.props.maximumDate}
          minimumDate={this.props.minimumDate}
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          onChange={this.onChange}
          updateText={this.updateText}
          singleCalendar={this.props.singleCalendar}
        />
      </Base>
    );
  }
}

RangeDatepickerDropdown.displayName = 'DatepickerDropdown';

RangeDatepickerDropdown.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  maximumDate: PropTypes.object,
  minimumDate: PropTypes.object,
  onChange: PropTypes.func,
  tabs: PropTypes.array,
  singleCalendar: PropTypes.bool,
};
