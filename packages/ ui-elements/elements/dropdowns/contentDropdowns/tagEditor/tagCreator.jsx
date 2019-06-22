import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class TagCreator extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value: '',
      showSuggestions: false,
      suggestions: [],
    };
    this.onKeyUp = this.onKeyUp.bind(this);
    this.show = this.show.bind(this);
    this.search = this.search.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  componentDidMount () {
    this.input.focus();
  }

  onKeyUp (event) {
    const keyCodes = {
      ENTER: 13,
      ESC: 27,
    };
    if (event.target.value === '' && !this.state.showSuggestions) {
      return;
    }

    switch (event.keyCode) {
      case keyCodes.ENTER:
        this.props.addLabel(event.target.value);
        this.setState({ value: '' });
        break;

      case keyCodes.ESC:
        this.setState({ value: '', showSuggestions: false });
        break;
    }
  }

  show (filteredLabels) {
    if (filteredLabels.length) {
      this.setState({ showSuggestions: true });
    }
  }

  search (text, search) {
    search = search.replace(/\ /g, '')
      .toLowerCase();
    const tokens = text.split('');
    let searchPosition = 0;

    tokens.forEach((char, i) => {
      if (char.toLowerCase() === search[searchPosition]) {
        searchPosition++;
      }
      if (searchPosition >= search.length) {
        return false;
      }
    });

    if (searchPosition !== search.length) {
      return '';
    }

    return tokens.join('');
  }

  onChange (value, allLabels) {
    const filteredLabels =
      value !== '' ? allLabels.filter((label) => this.search(label.value, value)) : '';
    this.setState({
      value,
      showSuggestions: !!filteredLabels.length,
      suggestions: filteredLabels || this.props.allLabels,
    });
  }

  onClick (addLabel) {
    if (this.input.value === '') {
      this.input.focus();
      return;
    }
    this.props.addLabel(this.input.value);
    this.setState({ value: '' });
    this.input.focus();
  }

  onDoubleClick () {
    this.setState({ showSuggestions: true, suggestions: this.props.allLabels });
  }

  render () {
    const { allLabels, addLabel } = this.props;
    const renderSuggenstions = this.state.suggestions
      ? this.state.suggestions
        .map((label, i) => (
          <li
            key={i}
            onClick={() => {
              this.setState({ value: '', showSuggestions: false });
              addLabel(label.value);
            }}
          >
            {label.value}
          </li>
        ))
        .slice(0, 10)
      : '';

    return (
      <div className="tag-creator">
        <input
          placeholder="Add labels"
          value={this.state.value}
          ref={(input) => (this.input = input)}
          onChange={(event) => this.onChange(event.target.value, allLabels)}
          onKeyUp={this.onKeyUp}
          onDoubleClick={this.onDoubleClick}
          className="tag-creator__input"
        />
        <ul
          className={classNames('tag-creator__tags-autosuggest', {
            'tag-creator__tags-autosuggest--expand': this.state.showSuggestions,
          })}
        >
          {renderSuggenstions}
        </ul>
      </div>
    );
  }
}

TagCreator.propTypes = {
  addLabel: PropTypes.func,
  allLabels: PropTypes.array,
  getLabels: PropTypes.func,
};

export default TagCreator;
