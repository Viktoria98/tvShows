import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import AutosuggestSuggestionsContainer from './autosuggestSuggestionsContainer.jsx';

import './autosuggestSimple.styl';

const AutosuggestSimple = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value: '',
    };

    this.debouncedFetch = _.debounce(this.onFetchRequest, 500);
    this.onChange = this.onChange.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onFetchRequest (value) {
    const { onFetch } = this.props;
    onFetch(value);
  }

  onChange (event) {
    const { value } = event.target;
    this.setState({ value });

    this.debouncedFetch(value);
  }

  onDoubleClick (event) {
    this.onFetchRequest();
  }

  onKeyDown (event) {
    const { onSuggestionSelect } = this.props;
    const { value } = this.state;
    if (event.key === 'Enter') {
      onSuggestionSelect(value);
      this.setState({ value: '' });
    }
  }

  render () {
    const { value } = this.state;
    const { suggestions, onSuggestionSelect } = this.props;

    return (
      <div className="autosuggest-simple">
        <input
          type="text"
          name="autosuggest-input"
          className="autosuggest-simple__input"
          value={value}
          onChange={this.onChange}
          onDoubleClick={this.onDoubleClick}
          onKeyDown={this.onKeyDown}
        />
        <AutosuggestSuggestionsContainer
          suggestions={suggestions}
          suggestionCallback={onSuggestionSelect}
        />
      </div>
    );
  }
};

AutosuggestSimple.propTypes = {
  suggestions: PropTypes.array,
  onSuggestionSelect: PropTypes.func,
  onFetch: PropTypes.func,
};

export default AutosuggestSimple;
