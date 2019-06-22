/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Autosuggest from 'react-autosuggest';
import classNames from 'classnames';
import Icon from '../icons/icon.jsx';
import Tooltip from '../tooltips/tooltip.jsx';
import FixedTooltip from '../tooltips/components/fixedTooltip.jsx';
import SearchToolsDropdown from '../dropdowns/components/searchToolsDropdown.jsx';
import Format from '../../formatters/Format.js';

function escapeRegexCharacters (str) {
  // preventing DOI being escaped in order to match by exact DOI
  const doiRegex = /^(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&'<>])\S)+)$/g;
  if (str && doiRegex.test(str.trim())) {
    return str;
  }
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSectionSuggestions (section) {
  return section.items;
}

const KEY_CODE = {
  ENTER: 13,
  ESC: 27,
  DOWN: 40,
  UP: 38,
};

export default class EnhancedSearchBar extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      value: props.value || '',
      suggestions: [],
      selectedSection: _.get(this.props.options[0], 'title') || '',
      loading: false,
      searchTools: false,
      shouldExpand: false,
      alwaysRenderSuggestions: false,
      noSuggestions: false,
      selectedSectionIndex: 0,
      selectedSectionItemIndex: 0,
      lastSelectedSectionItemIndex: false,
      isItemSelected: false,
    };

    this.categories = this.props.options.length;
    this.loadingTimeout = 0;
    this.previousSearch = '';
    this.placeholderObject = {
      title: 'Placeholder',
      items: [{ empty: true }],
    };

    // input handlers and functionality
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.handleClearBtnClick = this.handleClearBtnClick.bind(this);

    // core
    this.initSuggestions = this.initSuggestions.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.onSelectedSectionChange = this.onSelectedSectionChange.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.findSelectedSuggestions = this.findSelectedSuggestions.bind(this);
    this.shouldRenderSuggestions = this.shouldRenderSuggestions.bind(this);

    // render
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.renderSuggestionsContainer = this.renderSuggestionsContainer.bind(this);
    this.renderSectionTitle = this.renderSectionTitle.bind(this);
    this.renderListContainer = this.renderListContainer.bind(this);
    this.renderTooltipContent = this.renderTooltipContent.bind(this);
    this.renderSearchToolsButton = this.renderSearchToolsButton.bind(this);
    this.renderSearchToolsPanel = this.renderSearchToolsPanel.bind(this);
    this.renderFooter = this.renderFooter.bind(this);

    // callbacks and other
    this.useFilter = this.useFilter.bind(this);
    this.toggleSearchToolsState = this.toggleSearchToolsState.bind(this);
    this.checkSuggestionsTitleLength = this.checkSuggestionsTitleLength.bind(this);
    this.focusOnFirstSection = this.focusOnFirstSection.bind(this);
    this.focusOnDefaultSection = this.focusOnDefaultSection.bind(this);
  }

  componentDidMount () {
    this.initSuggestions();
  }
  componentDidUpdate () {
    if (this.props.isSubmited) {
      this.state.value = '';
    }
  }
  onChange (event, { newValue }) {
    if (newValue === '') {
      this.setState({
        value: newValue,
        shouldExpand: false,
        isItemSelected: false,
      });
      return;
    }
    this.setState({
      value: newValue,
      isItemSelected: false,
    });
  }

  onFocus (event) {
    this.onSuggestionsUpdateRequested({ value: event.target.value, reason: null });
    this.setState({ selectedSectionItemIndex: 0, isItemSelected: false });
  }

  onKeyDown (event) {
    const {
      value,
      selectedSectionIndex,
      selectedSectionItemIndex,
      lastSelectedSectionItemIndex,
    } = this.state;

    const keyCode = event.keyCode;
    const focusedClass = 'react-autosuggest__suggestion--focused';

    switch (keyCode) {
      case KEY_CODE.ESC: {
        this.clearInput();
        this.setState({ alwaysRenderSuggestions: false });
        break;
      }
      case KEY_CODE.ENTER: {
        if (value === '') {
          this.useFilter();
          return;
        }
        const focused = document.getElementsByClassName(focusedClass);
        if (!focused.length) {
          this.useFilter(() => {
            this.clearInput();
          });
        } else {
          focused[0].click();
        }
        break;
      }
      case KEY_CODE.DOWN:
      case KEY_CODE.UP: {
        setTimeout(() => {
          const list = document.getElementsByClassName('react-autosuggest__suggestions-list')[0];
          if ((!value || value.length < 2) || !list) {
            return;
          }

          const activeItem = document.getElementsByClassName(focusedClass)[0];
          const offsetTop = activeItem ? activeItem.offsetTop : 0;
          const clientHeight = activeItem ? activeItem.clientHeight : 0;

          const bgFocusedClass = 'react-autosuggest__suggestion--focused-bg';
          if (list.children.length) {
            for (let i = 0; i < list.children.length; i++) {
              const child = list.children[i];
              if (child) {
                child.classList.remove(focusedClass);
              }
            }
          }

          const idStr = `react-autowhatever-1-section-${selectedSectionIndex}-item-`;
          let nextSelectedSectionItemIndex = null;

          if (keyCode === KEY_CODE.DOWN) {
            nextSelectedSectionItemIndex = selectedSectionItemIndex + 1;
          } else {
            nextSelectedSectionItemIndex = selectedSectionItemIndex - 1;
          }

          const itemId = idStr + nextSelectedSectionItemIndex;
          const item = document.getElementById(itemId);
          const focusedItem = document.getElementsByClassName(bgFocusedClass);
          if (focusedItem.length) {
            focusedItem[0].classList.remove(bgFocusedClass);
          }

          if (item) {
            this.setState({
              selectedSectionItemIndex: nextSelectedSectionItemIndex,
              lastSelectedSectionItemIndex: false,
            });
            item.classList.add(focusedClass, bgFocusedClass);
          } else if (keyCode === KEY_CODE.DOWN && !lastSelectedSectionItemIndex) {
            this.setState({
              selectedSectionItemIndex: nextSelectedSectionItemIndex,
              lastSelectedSectionItemIndex: true,
            });
          }

          if (
            keyCode === KEY_CODE.DOWN
            && !lastSelectedSectionItemIndex
          ) {
            if (list.scrollTop >= list.scrollHeight) {
              list.scrollTop = list.scrollHeight;
            }
            if (
              (offsetTop + clientHeight > list.clientHeight)
              && (list.scrollTop !== list.scrollHeight)
            ) {
              list.scrollTop += clientHeight;
            }
          } else if (!lastSelectedSectionItemIndex) {
            if (list.scrollTop < 0) {
              list.scrollTop = 0;
            }
            if (
              (offsetTop + clientHeight > list.clientHeight)
              && (list.scrollTop !== 0)
            ) {
              list.scrollTop -= clientHeight;
            }
          }
        });

        break;
      }
      default:
        break;
    }
  }

  onBlur () {
    this.previousSearch = '';
    this.setState({ alwaysRenderSuggestions: false });
  }

  onSelectedSectionChange (event) {
    const newSection = event.target.dataset.value;

    this.props.options.forEach((option, index) => {
      if (option.title === newSection) {
        this.setState({ selectedSectionIndex: index });
      }
    });

    event.preventDefault();
    this.setState({
      selectedSection: newSection,
      selectedSectionItemIndex: 0,
    });
    this.checkSuggestionsTitleLength(this.state.suggestions, newSection);
  }

  onSuggestionsUpdateRequested ({ value, forceReload }) {
    const searchTools = this.state.searchTools;
    this.initSuggestions();
    const escapedValue = escapeRegexCharacters(value);
    let delay = 1000 - Math.round(value.length * 100);
    if (delay < 500) {
      delay = 500;
    }
    // eslint-disable-next-line
    if (escapedValue === '' || escapedValue === this.previousSearch && !forceReload) {
      return;
    }
    this.previousSearch = escapedValue;

    clearTimeout(this.loadingTimeout);
    this.loadingTimeout = setTimeout(() => {
      if (this.state.isItemSelected) {
        return;
      }
      const timeoutId = this.loadingTimeout;
      const defaultSection = _.get(this.props, 'defaultSection', '');
      const promises = this
        .props
        .options
        .map((option) => {
          const args = {
            defaultSection: defaultSection.toLowerCase(),
            query: escapedValue,
            where: _
              .chain(option)
              .get(['settings'])
              .first()
              .get(['selected'])
              .value(),
          };

          return (
            ((_.isFunction(option.getSuggest) ? // Expected to return a Promise instance
            // next-line: Expected to return a Promise instance
            option.getSuggest(args) : option.store.getEnhancedSuggest(args)))
          ).then(({ rows, count }) => {
            rows.unshift({ empty: true });

            return {
              title: option.title,
              items: rows,
              count,
            };
          });
        });

      Promise
        .all(promises)
        .then((suggestData) => {
          if (timeoutId !== this.loadingTimeout) {
            return;
          }

          // let noSuggestions = false;
          // if (suggestData.length === 0) {
          //   suggestData.push(this.placeholderObject);
          //   noSuggestions = true;
          // }

          this.setState({
            suggestions: suggestData,
            loading: false,
            // noSuggestions,
            searchTools,
          });

          const selectedSectionSuggestions =
            _.find(suggestData, { title: this.state.selectedSection });
          if (!selectedSectionSuggestions) {
            this.focusOnDefaultSection();
          }

          this.checkSuggestionsTitleLength(suggestData);
        });
    }, delay);
  }

  onSuggestionSelected (event, { suggestion }) {
    if (event.type === 'keydown') {
      return;
    }
    const { selectedSection, value } = this.state;
    const { options } = this.props;
    clearTimeout(this.loadingTimeout);
    this.setState({ isItemSelected: true });
    options.forEach((option) => {
      if (option.title === selectedSection) {
        option.callback(suggestion);
      }
    });
    this.clearInput();
    this.onBlur();

    // only for ui-demo
    if (options[0].demoCallback && value) {
      options[0].demoCallback(value);
    }
  }

  getSuggestionValue () {
    return this.state.value;
  }

  focusOnDefaultSection () {
    if (this.props.defaultSection) {
      for (const section of this.state.suggestions) {
        if (section.title === this.props.defaultSection) {
          this.setState({
            selectedSection: section.title,
          });
          return;
        }
      }
    }
    this.focusOnFirstSection();
  }

  focusOnFirstSection () {
    for (const section of this.state.suggestions) {
      if (section.title === this.state.selectedSection) {
        return;
      }
    }
    this.setState({
      selectedSection: this.state.suggestions[0].title,
    });
  }

  checkSuggestionsTitleLength (data, sectionTitle) {
    const suggestionsArray = this.findSelectedSuggestions(data, sectionTitle).items;
    const maxTitleLength = this.categories >= 3 ? this.categories * 13 : 35;

    // if there are no suggestions or we need fixed autocomplete width (usually in popups)
    if (this.state.noSuggestions || this.props.fixedWidth) {
      return;
    }

    for (const suggestion of suggestionsArray) {
      // if at least one suggestion has too long title
      if (suggestion.suggestTitle && suggestion.suggestTitle.length > maxTitleLength) {
        this.setState({
          shouldExpand: true,
        });
        return;
      }
    }
    this.setState({
      shouldExpand: false,
    });
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
      searchTools: false,
    });
  }

  searchToolsOpen (sectionTitle) {
    let result = false;
    this.props.options.forEach((option) => {
      // if we are checking particular section and this section has settings
      if (option.settings && option.title === sectionTitle) {
        option.settings.forEach((setting) => {
          if (setting.open) {
            result = true;
          }
        });
      }
    });
    return result;
  }

  clearInput () {
    this.setState({
      value: '',
      shouldExpand: false,
    });
  }

  handleClearBtnClick () {
    this.clearInput();
  }

  useFilter (cb = _.noop) {
    if (this.state.value === '') {
      return;
    }
    const option = this.findSelectedSuggestions(this.props.options);

    const showAllCallback = _.get(option, ['showAllCallback']);

    if (!_.isFunction(showAllCallback)) {
      return;
    }

    showAllCallback(this.state.value);

    $('.react-autosuggest__input')
      .blur();

    cb();
  }

  toggleSearchToolsState () {
    this.setState({
      searchTools: !this.state.searchTools,
    });
  }

  findSelectedSuggestions (options, currentCategory = this.state.selectedSection) {
    for (const category of options) {
      if (category.title === currentCategory) {
        return category;
      }
    }
    return false;
  }

  shouldRenderSuggestions (value) {
    if (this.state.forceClose) {
      return false;
    }
    return typeof value === 'string' ? value.trim().length > 1 : false;
  }

  renderSectionTitle (section) {
    const selected = (
      this.state.selectedSection
      || this.state.suggestions[0].title
    ) === section.title;

    let titleEl = '';

    if (this.state.loading) {
      titleEl = <div className="title-loading" />;
    } else {
      titleEl = (
        <strong
          className={
            classNames(
              'searchbarTrigger',
              { '-active': selected }
            )
          }
          onMouseDown={this.onSelectedSectionChange}
          data-value={section.title}
        >
          {section.title}
        </strong>
      );
    }

    return (
      <div id={_.camelCase(section.title)}>
        <strong className="placeholder">{section.title}</strong>
        {titleEl}
      </div>
    );
  }

  renderTooltipContent (suggestion) {
    let info = '';
    const infoArray = suggestion.suggestInfo;

    if (infoArray && infoArray.length > 0) {
      info = infoArray.map((row, i) => (
        <div key={i} className="tooltip__row">
          <div className="tooltip__row-el tooltip__row-el--title">{row.title}</div>
          <div className="tooltip__row-el tooltip__row-el--value">{row.value}</div>
        </div>)
      );
    }

    const subtitle = suggestion.suggestSubtitle ? (
      <div className="tooltip__subtitle">
        {suggestion.suggestSubtitle}
      </div>
    ) : '';

    /**
      * suggest title should be less than 120 symbols (about two rows of text)
      * to avoid tooltip be out of screen by height
      */
    let suggestTitle = '';
    if (suggestion.empty) {
      suggestTitle = '';
    } else {
      const maxTitleLength = 120;
      suggestTitle = suggestion.suggestTitle.length > maxTitleLength
        ? `${suggestion.suggestTitle.substr(0, maxTitleLength)}...`
        : suggestion.suggestTitle;
    }
    suggestTitle = suggestTitle.replace(/&quot;/g, '"');

    return (
      <div className="content">
        <div className="tooltip__title">{suggestTitle}</div>
        {subtitle}
        {info}
      </div>
    );
  }

  renderSuggestion (suggestion) {
    let suggestTitle = '';
    const content = this.renderTooltipContent(suggestion);
    if (suggestion.empty) {
      suggestTitle = '';
    } else {
      suggestTitle = suggestion.suggestTitle.replace(/&quot;/g, '"');
    }
    return (
      <div className="item">
        <FixedTooltip
          className="name"
          visible={suggestTitle}
        >
          {content}
        </FixedTooltip>
      </div>
    );
  }

  renderFooter () {
    let searchString;
    let adviceString;
    const {
      loading,
      value,
      selectedSection,
    } = this.state;
    if (loading) {
      searchString = `Searching for '${value}'`;
      adviceString = 'Press enter to search';
    } else {
      const options = this.findSelectedSuggestions(this.props.options);
      const sectionCount = this.findSelectedSuggestions(this.state.suggestions).count;
      let selectedSectionText = selectedSection;
      if (selectedSectionText !== 'TrendMD staff') {
        selectedSectionText = selectedSection.toLowerCase();
        selectedSectionText = +sectionCount === 1 ?
          selectedSectionText.slice(0, -1) :
          selectedSectionText;
      }
      searchString = `${Format.number(sectionCount)} ${selectedSectionText}

                      found for '${value}'`;
      adviceString = options.showAllCallback ? 'Press Enter to show all' : '';
    }

    return (
      <div className="react-autosuggest__footer">
        <span>
          {searchString}
        </span>
        <span className="react-autosuggest__footer-advice">
          {adviceString}
        </span>
      </div>
    );
  }

  renderListContainer (suggestions) {
    function createLoadingDivs () {
      const animatedDivs = [];
      for (let i = 0; i < 6; i++) {
        animatedDivs.push(<div key={i} className="animated-line" />);
      }
      return (
        <div className="react-autosuggest__loading-lists">
          {animatedDivs}
        </div>
      );
    }

    function getSelectedSectionSuggestions (suggestionsArray, selectedSection) {
      for (const suggestion of suggestionsArray) {
        if (suggestion.sectionTitle === selectedSection) {
          return suggestion.sectionSuggestions;
        }
      }
      return false;
    }

    let content;

    if (this.state.loading) {
      content = createLoadingDivs();
    } else if (!this.state.loading && suggestions) {
      content = getSelectedSectionSuggestions(suggestions, this.state.selectedSection);
    }

    const listContainerId = `autosuggest-list-${this.state.selectedSection.toLowerCase()}`;

    return (
      <div
        id={listContainerId}
        className={
          classNames(
            'react-autosuggest__lists-container',
            { '-loading': this.state.loading }
          )
        }
      >
        {content}
      </div>
    );
  }

  renderSearchToolsButton () {
    const option = this.findSelectedSuggestions(this.props.options);

    const btnActive = option.settings;
    const currentSectionTitle = option.title;

    return (
      <button
        className={
          classNames(
            'react-autosuggest__tools-btn',
            {
              '-active': this.state.searchTools || this.searchToolsOpen(currentSectionTitle),
              '-loading': this.state.loading,
            }
          )
        }
        onClick={this.toggleSearchToolsState}
        disabled={!btnActive}
      >
        <Icon type="gear" size="contain" className="center--xy" />
        {btnActive ? <Tooltip visible="">Search tools</Tooltip> : ''}
      </button>
    );
  }

  renderSearchToolsPanel () {
    const { settings } = this.findSelectedSuggestions(this.props.options);
    let forceSearchToolsPanel = false;

    if (settings) {
      const settingsDropdowns = settings.map((dropdownData, i) => {
        if (dropdownData.open) {
          forceSearchToolsPanel = true;
        }
        const dropdownOptions = dropdownData.options.map((option) => ({
          name: option.name,
          text: option.text,
          cb: option.cb,
        }));
        const onSelect = (name) => {
          for (const option of dropdownOptions) {
            if (option.name === name) {
              option.cb(this.state.value, name);
              this.onSuggestionsUpdateRequested({ value: this.state.value, forceReload: true });
            }
          }
        };
        return (
          <SearchToolsDropdown
            key={i}
            label="Search in"
            selected={dropdownData.selected || null}
            onSelect={onSelect}
            options={dropdownOptions}
          />
        );
      });

      return (
        <div
          className={
            classNames(
              'react-autosuggest__search-tools',
              { '-active': this.state.searchTools || forceSearchToolsPanel }
            )
          }
        >
          {settingsDropdowns}
        </div>
      );
    }

    return false;
  }

  renderSuggestionsContainer ({ children, ...rest }) {
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

    function calculateContainerWidth (categoriesCount, shouldExpand) {
      /*
       * if we have less then 3 default categories then
       * set categories amount to 3 (prevent width shrinking)
       */
      const coeff = categoriesCount > 3 ? categoriesCount : 3;
      const categoryWidth = 100;
      const gap = 60;
      let properWidth = (coeff * categoryWidth) + gap;

      // width should be not less than 450px to avoid tooltip out of screen
      if (properWidth < 450) {
        properWidth = 450;
      }

      return shouldExpand ? properWidth + (properWidth / 2.5) : properWidth;
    }

    const suggestionLists = getSuggestionLists(children);
    const titles = getTitles(children);

    const inputBtn = (
      <div
        className="react-autosuggest__input-btn"
        onClick={this.handleClearBtnClick}
      />
    );

    const searchToolsButton = this.renderSearchToolsButton();
    const searchToolsPanel = this.renderSearchToolsPanel();
    const listsContainer = this.renderListContainer(suggestionLists);
    const footer = this.renderFooter();

    const { loading, value, noClearBtn, shouldExpand } = this.state;
    const { fixedWidth } = this.props;

    const props = { ...rest };
    const width = fixedWidth ? '100%' : calculateContainerWidth(this.categories, shouldExpand);
    props.style = {
      width,
    };

    let container = null;
    // if autocomplete is loaded already and has no suggestion results
    if (!loading && this.state.noSuggestions) {
      container = (
        <div {...props}>
          <div className="no-results">
            <span className="no-results__title">No search results found</span>
            <p className="no-results__descr">Looking for websites, people or articles?
            Try entering a name, email, website address or different words.</p>
          </div>
        </div>
      );
    } else {
      container = (
        <div {...props}>
          <div
            className={
              classNames(
                'react-autosuggest__titles-container',
                { '-loading': loading }
              )
            }
          >
            <div className="titles">
              {titles}
            </div>
            {searchToolsButton}
          </div>
          {searchToolsPanel}
          {listsContainer}
          {footer}
        </div>
      );
    }

    return (
      <div className="wrapper">
        {container}
        {!noClearBtn && (value && !loading) ? inputBtn : ''}
      </div>
    );
  }

  render () {
    const { value, suggestions, alwaysRenderSuggestions } = this.state;
    const multiSections = true;
    let placeholder;
    let label;
    let error;

    if (this.props.noPlaceholder) {
      placeholder = '';
    } else {
      placeholder = 'Search';
    }

    if (this.props.label) {
      label = (
        <div className="form__label">{this.props.label}</div>
      );
    }

    if (this.props.error) {
      error = (
        <p className={classNames('form__error', { '-visible': this.props.error })}>
          {this.props.error}
        </p>
      );
    }

    const inputProps = {
      placeholder,
      value,
      onChange: this.onChange,
      onSubmit: this.onSubmit,
      onFocus: this.onFocus,
      onKeyDown: this.onKeyDown,
      onBlur: this.onBlur,
    };

    return (
      <div id={this.props.id || ''} className="v2-autocomplete">
        {label}
        <Autosuggest
          ref="autosuggestInput"
          suggestions={suggestions}
          multiSection={multiSections}
          onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
          getSuggestionValue={this.getSuggestionValue}
          onSuggestionSelected={this.onSuggestionSelected}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
          renderSectionTitle={this.renderSectionTitle}
          renderSuggestion={this.renderSuggestion}
          getSectionSuggestions={getSectionSuggestions}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          inputProps={inputProps}
          alwaysRenderSuggestions={alwaysRenderSuggestions}
        />
        {error}
      </div>
    );
  }
}

EnhancedSearchBar.displayName = 'EnhancedSearchBar';

EnhancedSearchBar.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.array.isRequired,
  noPlaceholder: PropTypes.bool,
  fixedWidth: PropTypes.bool,
  label: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
};
