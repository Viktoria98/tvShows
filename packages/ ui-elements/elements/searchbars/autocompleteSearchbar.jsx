import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import classNames from 'classnames';
import Spinner from '../spinner/spinnerBase';
import Icon from '../icons/icon';

const getSuggestionValue = (suggestion) => suggestion.title;
const getSectionSuggestions = (section) => section.items;

const AutocompleteSearchbar = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value: '',
      selectedSection: props.selectedSection || null,
      hideSuggestions: false,
    };

    this.timeout = false;

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.showAllCb = this.showAllCb.bind(this);
    this.debouncedLoadSuggestions = this.debouncedLoadSuggestions.bind(this);
    this.clearInput = this.clearInput.bind(this);

    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.changeSection = this.changeSection.bind(this);

    this.renderSectionTitle = this.renderSectionTitle.bind(this);
    this.renderListContainer = this.renderListContainer.bind(this);
    this.renderSuggestionsContainer = this.renderSuggestionsContainer.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderInputComponent = this.renderInputComponent.bind(this);
    this.shouldRenderSuggestions = this.shouldRenderSuggestions.bind(this);

    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  componentWillReceiveProps (newProps) {
    const { selectedSection } = this.state;
    const { suggestions } = newProps;

    if (suggestions.length) {
      for (const suggestion of suggestions) {
        if (selectedSection === suggestion.title) {
          return;
        }
      }

      this.setState({
        selectedSection: suggestions[0].title,
      });
    }
  }

  escapeRegexCharacters (str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  debouncedLoadSuggestions ({ value }) {
    const { fetchSuggestions, multiFilters } = this.props;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      value = this.escapeRegexCharacters(value.trim());
      fetchSuggestions(value, multiFilters);
    }, 500);
  }

  onKeyDown (event) {
    const keyCodes = {
      ENTER: 13,
    };
    if (event.keyCode === keyCodes.ENTER) {
      this.showAllCb();
    }
  }

  showAllCb () {
    const { selectedSection, value } = this.state;
    const { onPressEnter } = this.props;
    this.setState({ hideSuggestions: true });
    onPressEnter(value, selectedSection);
  }

  clearInput () {
    if (typeof this.props.clearInput === 'function') {
      this.props.clearInput();
    }
    this.setState({ value: '' });
  }

  onSuggestionSelected (event, { suggestion, suggestionValue, sectionIndex }) {
    const { onSelectSuggestion, suggestions } = this.props;
    const section = suggestions[sectionIndex].title;
    onSelectSuggestion({ value: suggestionValue, section, suggestion });
    this.setState({ value: '' });
  }

  shouldRenderSuggestions (value) {
    const { forceRenderSuggestions, readOnly } = this.props;
    if (this.state.hideSuggestions || readOnly) {
      return false;
    }
    return value.trim().length > 0 || forceRenderSuggestions;
  }

  changeSection (event) {
    this.setState({
      selectedSection: event.target.dataset.value,
    });
  }

  onChange (event, { newValue }) {
    this.setState({
      value: newValue,
      hideSuggestions: false,
    });
  }

  renderSuggestion (suggestion) {
    const { title, secondaryTitle } = suggestion;
    const additionalTitle = secondaryTitle ? (
      <span className="react-autosuggest__suggestion-secondary-title">{secondaryTitle}</span>
    ) : null;
    return (
      <div className="react-autosuggest__suggestion-wrapper">
        <span className="react-autosuggest__suggestion-title">{title}</span>
        {additionalTitle}
      </div>
    );
  }

  renderInputComponent (inputProps) {
    const { value } = this.state;
    const { loading } = this.props;
    let inputBtn;
    if (
      value ||
      (_.isFunction(this.props.shouldRenderClearButton) && this.props.shouldRenderClearButton())
    ) {
      inputBtn = <button className="react-autosuggest__input-btn" onClick={this.clearInput} />;
    }

    if (loading) {
      inputBtn = (
        <div className="react-autosuggest__input-spinner">
          <Spinner type="sk-fading-circle" />
        </div>
      );
    }

    return (
      <div className="react-autosuggest__input-wrapper">
        <input {...inputProps} />
        <Icon type="search" />
        {inputBtn}
      </div>
    );
  }

  renderSectionTitle (section) {
    const { title } = section;
    const active = title === this.state.selectedSection;
    return (
      <div className="react-autosuggest__title-wrapper">
        <strong className="react-autosuggest__title-placeholder">{title}</strong>
        <span
          className={classNames('react-autosuggest__title-trigger', {
            '-active': active,
          })}
          onClick={this.changeSection}
          data-value={title}
        >
          {title}
        </span>
      </div>
    );
  }

  renderListContainer (suggestions) {
    const { selectedSection } = this.state;
    if (suggestions) {
      for (const suggestion of suggestions) {
        if (suggestion.sectionTitle === selectedSection) {
          return suggestion.sectionSuggestions;
        }
      }
      return false;
    }
  }

  renderFooter () {
    const { selectedSection, value } = this.state;
    const { suggestions, mainSections } = this.props;
    let count;

    if (suggestions.length && selectedSection) {
      for (const section of suggestions) {
        if (section.title === selectedSection) {
          count = section.items.length;
          const isMainSection = mainSections.some((section) => section === selectedSection);
          const advice = isMainSection ? (
            <div className="react-autosuggest__footer-advice">Press enter to show all</div>
          ) : null;
          return (
            <div>
              {value ? (
                <div>
                  {count} {selectedSection.toLowerCase()} found for '{value}'
                </div>
              ) : (
                <div>
                  Found {count} {selectedSection.toLowerCase()}
                </div>
              )}
              {advice}
            </div>
          );
        }
      }
    }
  }

  renderSuggestionsContainer ({ containerProps, children, query }) {
    function getTitles (array) {
      if (array) {
        return array.map((el) => el.props.children[0]);
      }
      return false;
    }
    function getSuggestionLists (array) {
      if (array) {
        return array.map((el) => ({
          sectionTitle: el.props.children[0].props.section.title,
          sectionSuggestions: el.props.children[1],
        }));
      }
      return false;
    }

    // render no results message if there are no suggestions
    // otherwise render autosuggest container
    let content;

    if (this.props.noSuggestions) {
      content = (
        <div {...containerProps}>
          <div className="no-results">
            <span className="no-results__title">No search results found</span>
            <p className="no-results__descr">
              Looking for suggestions? Try entering info in different words.
            </p>
          </div>
        </div>
      );
    } else {
      const titles = getTitles(children);
      let lists = getSuggestionLists(children);
      lists = this.renderListContainer(lists);
      const footer = this.renderFooter();

      content = (
        <div {...containerProps}>
          <div className="react-autosuggest__titles-container">{titles}</div>
          <div className="react-autosuggest__lists-container">{lists}</div>
          <div className="react-autosuggest__footer-container">{footer}</div>
        </div>
      );
    }

    return content;
  }

  render () {
    const {
      clearSuggestions, loading, suggestions, readOnly,
    } = this.props;
    let { value } = this.state;
    if (this.props.value) {
      value = this.props.value;
    }
    const inputProps = {
      placeholder: 'Search',
      value,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      readOnly,
    };
    return (
      <div className={classNames('autosuggest', { '-readonly': readOnly })}>
        <Autosuggest
          multiSection
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.debouncedLoadSuggestions}
          onSuggestionsClearRequested={clearSuggestions}
          getSuggestionValue={getSuggestionValue}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          getSectionSuggestions={getSectionSuggestions}
          renderInputComponent={this.renderInputComponent}
          inputProps={inputProps}
          renderSuggestion={this.renderSuggestion}
          renderSectionTitle={this.renderSectionTitle}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
          onSuggestionSelected={this.onSuggestionSelected}
          {...this.props}
        />
      </div>
    );
  }
};

AutocompleteSearchbar.propTypes = {
  fetchSuggestions: PropTypes.func,
  // multiFilters: PropTypes.object, // not sure
  onPressEnter: PropTypes.func,
  clearInput: PropTypes.func,
  onSelectSuggestion: PropTypes.func,
  suggestions: PropTypes.array,
  forceRenderSuggestions: PropTypes.func,
  readOnly: PropTypes.bool,
  loading: PropTypes.bool,
  shouldRenderClearButton: PropTypes.func,
  mainSections: PropTypes.array,
  noSuggestions: PropTypes.bool,
  clearSuggestions: PropTypes.func,
  value: PropTypes.string,
};
AutocompleteSearchbar.defaultProps = {
  mainSections: [],
};

export default AutocompleteSearchbar;
