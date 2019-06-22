import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

/* eslint-disable react/jsx-no-bind */

export default class InlineField extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      editing: false,
      value: this.props.value || '',
      style: {},
    };

    this.keyCodes = {
      ENTER: 13,
      ESC: 27,
    };

    this.savedValue = this.props.value || '';
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.value !== nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextState.editing !== this.state.editing ||
            this.state.value !== nextProps.value;
  }

  // eslint-disable-next-line
  componentDidUpdate (prevProps, prevState) {
    if (this.state.editing) {
      this.field.focus();
      this.autoResize();
    }

    this.savedValue = this.state.value;
  }

  open (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.state.editing) {
      this.updateFieldWidth();

      this.setState({
        editing: true,
      });
    }
  }

  close (e) {
    if (e.target.value !== this.state.value) {
      this.props.onUpdate(this.props.ident, e.target.value, (indexingExternalComments) => {
        this.setState({
          value: indexingExternalComments,
          editing: false,
        });
      });
    } else {
      this.setState({
        editing: false,
      });
    }
  }

  autoResize () {
    $(this.field)
      .outerHeight(38)
      .outerHeight(this.field.scrollHeight);
  }

  disableBackgroundClicks (e) {
    e.stopPropagation();
  }

  handleKeyDown (e) {
    if (e.keyCode === this.keyCodes.ENTER && !e.shiftKey) {
      e.preventDefault();
      this.close(e);
    } else if (e.keyCode === this.keyCodes.ESC) {
      this.setState({
        value: this.savedValue,
        editing: false,
      });
    }
  }

  updateFieldWidth () {
    const container = ReactDOM.findDOMNode(this).offsetParent;

    this.setState({
      style: {
        width: container.offsetWidth,
      },
    });
  }

  render () {
    const field = this.state.editing ?
      (<textarea
        style={this.state.style}
        className="inline-field__input"
        ref={(elem) => {
          this.field = elem;
        }}
        readOnly={!this.state.editing}
        defaultValue={this.state.value}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        onChange={this.autoResize.bind(this)}
        onClick={this.disableBackgroundClicks.bind(this)}
        onKeyDown={this.handleKeyDown.bind(this)}
        onBlur={this.close.bind(this)}
      />)
      : (
        <span className="inline-field__text">
          {this.state.value}
        </span>
      );

    return (
      <div
        className="inline-field"
        onDoubleClick={this.open.bind(this)}
      >
        {field}
      </div>
    );
  }
}

InlineField.displayName = 'InlineField';

InlineField.propTypes = {
  value: PropTypes.string,
  ident: PropTypes.number,
  onUpdate: PropTypes.func.isRequired,
};
