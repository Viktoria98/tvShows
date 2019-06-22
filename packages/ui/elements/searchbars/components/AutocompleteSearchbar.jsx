import PropTypes from 'prop-types';
import React from 'react';
import Autosuggest from 'react-autosuggest';
import classNames from 'classnames';

function escapeRegexCharacters (str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSectionSuggestions (section) {
  return section.items;
}

function shouldRenderSuggestions (value) {
  return value ? value.trim().length > 1 : false;
}


class AutocompleteSearchbar extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      value: props.value || '',
      suggestions: [],
      selectedSection: '',
      loading: false,
    };

    this.loadingTimeout = 0;
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSectionTitle = this.renderSectionTitle.bind(this);
    this.initSuggestions = this.initSuggestions.bind(this);
    this.onSelectedSectionChange = this.onSelectedSectionChange.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  componentDidMount () {
    this.initSuggestions();
  }

  onChange (event, { newValue }) {
    if (typeof newValue !== 'undefined') {
      this.setState({ value: newValue });
    }
  }

  onFocus (event) {
    this.onSuggestionsUpdateRequested({ value: event.target.value, reason: null });
  }

  onSelectedSectionChange (event) {
    const newSection = event.target.dataset.value;
    event.preventDefault();
    if (this.state.selectedSection !== newSection) {
      this.setState({ selectedSection: newSection });
      this.onSuggestionsUpdateRequested({ value: this.state.value, reason: null }, newSection);
    }
  }

  onSuggestionsUpdateRequested ({ value, reason }, newSection) {
    this.initSuggestions();
    const escapedValue = escapeRegexCharacters(value || value.trim());
    const selected = newSection || this.state.selectedSection || this.props.options[0].title;

    if (escapedValue === '') {
      return;
    }

    const promises = [];
    const suggestData = [];

    clearTimeout(this.loadingTimeout);
    this.loadingTimeout = setTimeout(() => {
      const opts = this.props.options;
      opts.forEach((option) => {
        suggestData.push(option.title);
        const p = new Promise((resolve) => {
          option.store.getSuggestData(
            value,
            option.callback,
            (data) => {
              data.rows.unshift({ empty: true });
              const index = suggestData.indexOf(option.title);
              suggestData.splice(index, 1, {
                title: option.title,
                count: data.count,
                items: option.title === selected ? data.rows : [],
              });
              resolve(suggestData);
            },
            option.pageStore
          );
        });
        promises.push(p);
      });

      Promise.all(promises)
        .then(() => {
          this.setState({ suggestions: suggestData, loading: false });
        });
    }, 300);
  }

  onSuggestionSelected () {
    const { onSuggestionSelected } = this.props;
    const { value } = this.state;
    if ((typeof onSuggestionSelected === 'boolean') && !onSuggestionSelected) {
      this.setState({ value });
    }
  }

  getSuggestionValue (suggestion) {
    const { value } = this.state;
    const ret = suggestion;

    if (ret.callback) {
      ret.inputValue = value;
      ret.callback(ret, true);
    }

    if (this.props.updateValue) {
      this.setState({ value: ret.suggestTitle });
      return ret.suggestTitle;
    }
    return '';
  }

  showAll (arg, event) {
    this.props.options[0].showAllCallback(this.state.suggestions[0].items);
    event.stopPropagation();
    this.setState({ value: '' });
  }

  initSuggestions () {
    const initialSuggestions = [];
    const opts = this.props.options;
    opts.forEach((option) => {
      initialSuggestions.push({
        title: option.title,
        items: [{ empty: true }],
      });
    });

    this.setState({
      loading: true,
      suggestions: initialSuggestions,
    });
  }

  renderSectionTitle (section) {
    // eslint-disable-next-line
    const selected = (this.state.selectedSection || this.state.suggestions[0].title) === section.title;
    return (
      <div>
        <strong
          className={classNames('searchbarTrigger', { '-active': selected })}
          onMouseDown={this.onSelectedSectionChange}
          data-value={section.title}
        >
          {section.title} {this.state.loading ? null : `(${section.count})`}
          {(section.title === this.props.options[0].title) &&
           (this.props.options[0].showAllCallback) ?
            (
              <span
                className="searchbarAllbtn"
                onMouseDown={(event) => this.showAll(section.title, event)}
              >
                Show All
              </span>
           ) : ''}
        </strong>
        {selected && this.state.loading ?
          <div className="searchbarLoading"><span className="spinner" />Loading...</div> : null}
      </div>
    );
  }

  renderSuggestion (suggestion) {
    return (
      <div className="item">
        <div className="name">{suggestion.suggestTitle}</div>
      </div>
    );
  }

  render () {
    let label = '';
    if (this.props.label) {
      label = <label className="form__label">{this.props.label}</label>;
    }
    const { value, suggestions } = this.state;
    const multiSections = true;
    let placeholder;
    if (this.props.noPlaceholder) {
      placeholder = '';
    } else {
      placeholder = 'Search';
    }
    const inputProps = {
      placeholder,
      value,
      onChange: this.onChange,
      onSubmit: this.onSubmit,
      onFocus: this.onFocus,
      onKeyDown: (event) => {
        if (event.which === 13 || event.keyCode === 13) {
          if (this.state.value === '') {
            this.props.options[0].callback('');
          } else {
            this.props.options[0].showAllCallback(this.state.suggestions[0].items);
            $('.react-autosuggest__input')
              .blur();
          }
        }
      },
    };
    return (
      <div className={classNames('form__group', { '-error': this.props.error })}>
        {label}
        <Autosuggest
          ref="autosuggestInput"
          multiSection={multiSections}
          suggestions={suggestions}
          onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
          getSuggestionValue={this.getSuggestionValue}
          onSuggestionSelected={this.onSuggestionSelected}
          renderSectionTitle={this.renderSectionTitle}
          renderSuggestion={this.renderSuggestion}
          getSectionSuggestions={getSectionSuggestions}
          shouldRenderSuggestions={shouldRenderSuggestions}
          inputProps={inputProps}
          focusInputOnSuggestionClick={false}
        />
        <p className={classNames('form__error', { '-visible': this.props.error })}>{this.props.error}</p>
      </div>
    );
  }
}

AutocompleteSearchbar.displayName = 'AutocompleteSearchbar';

AutocompleteSearchbar.propTypes = {
  value: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  onSuggestionSelected: PropTypes.bool,
  updateValue: PropTypes.bool,
  noPlaceholder: PropTypes.string,
};

export default AutocompleteSearchbar;
