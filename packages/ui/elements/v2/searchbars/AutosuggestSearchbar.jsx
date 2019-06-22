/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import PropTypes from 'prop-types';
import React from 'react';
import Autosuggest from 'react-autosuggest';
import _ from 'lodash';
import classNames from 'classnames';
import Icon from '../icons/icon.jsx';
import Tooltip from '../tooltips/tooltip.jsx';
import FixedTooltip from '../tooltips/components/fixedTooltip.jsx';
import SelectDropdown from '../dropdowns/components/selectDropdown.jsx';
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

class AutosuggestSearchbar extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      value: props.value || '',
      suggestions: [],
      selectedSection: this.props.options[0].title,
      loading: false,
      searchTools: false,
      shouldExpand: false,
      alwaysRenderSuggestions: false,
      noClearBtn: this.props.noClearBtn,
      noSuggestions: false,
      selectedSectionIndex: 0,
      selectedSectionItemIndex: 0,
      lastSelectedSectionItemIndex: false,
      isItemSelected: false,
    };

    this.categories = this.props.options.length;
    this.loadingTimeout = 0;
    this.placeholderObject = {
      title: 'Placeholder',
      items: [{ empty: true }],
    };

    this.selectedSectionIndex = 0;
    this.selectedItemIndex = 0;
    this.nextSelectedSectionIndex = 0;
    this.nextSelectedItemIndex = 0;
    this.possiblenNeedUpdateContainerToRight = false;
    this.possiblenNeedUpdateContainerToLeft = true;
    this.lastButtonPressed = null;
    this.toBottomOfList = false;

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
    this.setSelecetedItemIndex = this.setSelecetedItemIndex.bind(this);
  }

  componentDidMount () {
    this.initSuggestions();
  }

  componentWillReceiveProps (props) {
    if (props.someValue === '') { // eslint-disable-line
      this.setState({ value: '' });
    }
  }

  onChange (event, { newValue, method }) { // eslint-disable-line
    if (newValue === '') {
      this.setState({
        value: newValue,
        shouldExpand: false,
        isItemSelected: false,
        selectedSection: this.props.options[0].title,
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
    this.setState({ isItemSelected: false, selectedSection: this.props.options[0].title });
    this.selectedSectionIndex = 0;
    this.selectedItemIndex = -1;
  }

  onKeyDown (event) {
    const {
      value,
      selectedSection,
      suggestions,
    } = this.state;
    this.lastButtonPressed = event.keyCode;

    const keyCode = event.keyCode;
    const focusedClass = 'react-autosuggest__suggestion--focused';
    const bgFocusedClass = 'react-autosuggest__suggestion--focused-bg';

    switch (keyCode) {
      case KEY_CODE.ESC: {
        this.clearInput();
        this.setState({ alwaysRenderSuggestions: false });
        break;
      }
      case KEY_CODE.ENTER: {
        const hasActiveItem = document.getElementsByClassName(focusedClass).length;
        if (selectedSection === this.props.mainSection && !hasActiveItem) {
          this.useFilter();
        } else if (!this.waitForGetSuggestionValue) {
          const suggestion = suggestions[this.selectedSectionIndex].items[this.selectedItemIndex];
          this.onSuggestionSelected(event, { suggestion });
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

          this.possiblenNeedUpdateContainerToRight = false;
          this.possiblenNeedUpdateContainerToLeft = false;

          const lastSuggestionIndex = suggestions[this.selectedSectionIndex].items.length - 1;
          const lastSectionIndex = suggestions.length - 1;

          if (this.waitForGetSuggestionValue) {
            if (this.selectedItemIndex === -1) {
              this.setPositionsForPossibleContainerSwitch(
                lastSectionIndex,
                suggestions[lastSectionIndex].items.length,
                true,
                false
              );
            } else {
              this.setPositionsForPossibleContainerSwitch(0, -1, false, true);
              this.moveScroll(list);
            }
            return;
          }
          this.waitForGetSuggestionValue = true;

          if (keyCode === KEY_CODE.DOWN) {
            this.selectedItemIndex += 1;
          } else if (keyCode === KEY_CODE.UP) {
            this.selectedItemIndex -= 1;
          }

          if (this.selectedItemIndex === lastSuggestionIndex) {
            // eslint-disable-next-line
            const nextSectionIdx = (this.selectedSectionIndex === lastSectionIndex) ? 0 : this.selectedSectionIndex + 1;
            this.setPositionsForPossibleContainerSwitch(nextSectionIdx, -1, false, true);
          } else if (this.selectedItemIndex === 0 || this.selectedItemIndex === -1) {
            // eslint-disable-next-line
            const nextSectionIdx = (this.selectedSectionIndex === 0) ? lastSectionIndex : this.selectedSectionIndex - 1;
            this.setPositionsForPossibleContainerSwitch(
              nextSectionIdx,
              suggestions[nextSectionIdx].items.length,
              true,
              false
            );
          }

          const prevActiveItems = document.querySelectorAll(`.${focusedClass}`);
          if (prevActiveItems[0]) {
            prevActiveItems.forEach((el) => el.classList.remove(focusedClass, bgFocusedClass));
          }

          const currentElId = `#react-autowhatever-1-section-${this.selectedSectionIndex}-item-${this.selectedItemIndex}`;
          const activeItem = document.querySelector(currentElId);
          if (activeItem) {
            activeItem.classList.add(focusedClass, bgFocusedClass);
          }

          this.moveScroll(list, keyCode, activeItem);
        });

        break;
      }
      default:
        if (value && value.length < 2) {
          this.selectedSectionIndex = 0;
        }
        this.selectedItemIndex = -1;
        this.setState({ isItemSelected: false });
        break;
    }
  }

  setPositionsForPossibleContainerSwitch (nextSectionIdx, nextItemIdx, toLeft, toRight) {
    this.nextSelectedSectionIndex = nextSectionIdx;
    this.nextSelectedItemIndex = nextItemIdx;
    this.possiblenNeedUpdateContainerToLeft = toLeft;
    this.possiblenNeedUpdateContainerToRight = toRight;
  }

  // eslint-disable-next-line
  moveScroll (listEl, keyCode, activeItem) {
    if (keyCode == null) {
      listEl.scrollTop = listEl.scrollHeight; // eslint-disable-line
      return;
    }
    const activeItemOffsetTop = activeItem ? activeItem.offsetTop : 0;
    const activeItemHeight = activeItem ? activeItem.clientHeight : 0;

    if (keyCode === KEY_CODE.DOWN) {
      if (
        (activeItemOffsetTop + activeItemHeight > listEl.clientHeight) &&
        (listEl.scrollTop !== listEl.scrollHeight)
      ) {
        listEl.scrollTop += activeItemHeight; // eslint-disable-line
      } else {
        listEl.scrollTop = 0; // eslint-disable-line
      }
    } else if (keyCode === KEY_CODE.UP) {
      if (this.toBottomOfList) {
        listEl.scrollTop = listEl.scrollHeight; // eslint-disable-line
        this.toBottomOfList = false;
      } else {
        listEl.scrollTop -= activeItemHeight; // eslint-disable-line
      }
    }
  }

  onBlur () {
    this.setState({ alwaysRenderSuggestions: false });
  }

  onSelectedSectionChange (event) {
    const newSection = event.target.dataset.value;

    this.state.suggestions.forEach((option, index) => {
      if (option.title === newSection) {
        this.selectedSectionIndex = index;
      }
    });
    this.selectedItemIndex = -1;

    event.preventDefault();
    this.setState({
      selectedSection: newSection,
      searchTools: false,
    });
    this.checkSuggestionsTitleLength(this.state.suggestions, newSection);
    this.switchActiveSectionClass();
  }

  onSuggestionsUpdateRequested ({ value }) {
    this.initSuggestions();
    const escapedValue = escapeRegexCharacters(value);

    if (escapedValue === '') {
      return;
    }

    const promises = [];
    const suggestData = [];

    clearTimeout(this.loadingTimeout);
    this.loadingTimeout = setTimeout(() => {
      if (this.state.isItemSelected) {
        return;
      }
      const opts = this.props.options;
      opts.forEach((option) => {
        suggestData.push(option.title);
        const p = new Promise((resolve) => {
          option.store.getSuggestData(escapedValue, option.callback, (data) => {
            const index = suggestData.indexOf(option.title);
            suggestData.splice(index, 1, {
              title: option.title,
              count: data.count,
              items: data.rows || [],
            });
            resolve(suggestData);
          }, this.props.searchWithoutFilters); // eslint-disable-line
        });
        promises.push(p);
      });

      Promise.all(promises)
        .then(() => {
          // Prevent hiding sections if the search tools requested to be open
          const filteredSuggestData = suggestData.filter((suggestionsList) =>
            suggestionsList.count > 0 || this.searchToolsOpen(suggestionsList.title)
          );

          let noSuggestions = false;
          if (filteredSuggestData.length === 0) {
            filteredSuggestData.push(this.placeholderObject);
            noSuggestions = true;
          }

          this.setState({
            suggestions: filteredSuggestData,
            loading: false,
            noSuggestions,
            selectedSection: this.props.options[this.selectedSectionIndex].title,
          });

          this.nextSelectedSectionIndex = filteredSuggestData.length - 1;
          // eslint-disable-next-line
          this.nextSelectedItemIndex = filteredSuggestData[filteredSuggestData.length - 1].items.length;

          this.focusOnFirstSection();
          this.checkSuggestionsTitleLength(filteredSuggestData);
        });
    }, 300);
  }

  // eslint-disable-next-line
  onSuggestionSelected (event, {suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
    if (suggestion === undefined) {
      return;
    }
    const { selectedSection, value } = this.state;
    const { options } = this.props;
    clearTimeout(this.loadingTimeout);
    this.setState({
      isItemSelected: true,
      shouldExpand: false,
      value: suggestion.suggestTitle,
      selectedSection: this.props.options[0].title,
    });
    options.forEach((option) => {
      if (option.title === selectedSection) {
        const res = option.callback(suggestion);
        if (res.clearInput) {
          this.clearInput();
        }
      }
    });

    this.onBlur();
    // only for ui-demo
    if (options[0].demoCallback && value) {
      options[0].demoCallback(value);
    }
  }

  getSuggestionValue (suggestion) { // eslint-disable-line
    this.waitForGetSuggestionValue = false;
    return this.state.value;
  }

  focusOnFirstSection () {
    for (const section of this.state.suggestions) { // eslint-disable-line
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

    for (const suggestion of suggestionsArray) { // eslint-disable-line
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
    this.props.options[0].callback('');
  }

  useFilter () {
    this.props.options[0].showAllCallback(this.state.suggestions[0].items);
    $('.react-autosuggest__input')
      .blur();
  }

  toggleSearchToolsState () {
    this.setState({
      searchTools: !this.state.searchTools,
    });
  }

  showAll (arg, event) {
    this.props.options[0].showAllCallback(this.state.suggestions[0].items);
    event.stopPropagation();
  }

  findSelectedSuggestions (options, currentCategory = this.state.selectedSection) {
    for (const category of options) { // eslint-disable-line
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
    const {
      suggestions,
    } = this.state;
    const selected = suggestions[this.selectedSectionIndex].title === section.title;
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

    return (
      <div className="content">
        <div className="tooltip__title">{suggestion.suggestTitle}</div>
        {info}
      </div>
    );
  }

  renderSuggestion (suggestion) {
    const content = this.renderTooltipContent(suggestion);
    return (
      <div className="item">
        <FixedTooltip
          className="name"
          onMouseEnter={this.setSelecetedItemIndex}
          visible={suggestion.suggestTitle}
        >
          {content}
        </FixedTooltip>
      </div>
    );
  }

  setSelecetedItemIndex (event) {
    this.selectedItemIndex = +event.target.parentNode.parentNode.dataset.suggestionIndex;
  }

  renderFooter () {
    let searchString;
    let adviceString;
    const {
      loading,
      value,
      selectedSection,
      suggestions,
    } = this.state;
    const suggestionSection = suggestions[this.selectedSectionIndex];
    const title = (suggestionSection) ? suggestionSection.title : selectedSection;
    if (loading) {
      searchString = `Searching for '${value}'`;
      adviceString = 'Press enter to search';
    } else {
      if (!suggestionSection) {
        return;
      }

      const options = this.findSelectedSuggestions(this.props.options, title);
      const sectionCount = suggestionSection.count;

      searchString = `${Format.number(sectionCount)} ${title.toLowerCase()}
                      found for '${value}'`;
      adviceString = options.showAllCallback ? 'Press Enter to show all' : '';
    }

    // eslint-disable-next-line
    return (
      <div className="react-autosuggest__footer">
        <span className="react-autosuggest__footer-search-string">
          {searchString}
        </span>
        <span className="react-autosuggest__footer-advice">
          {title === this.props.mainSection ? adviceString : ''}
        </span>
      </div>
    );
  }

  switchActiveSectionClass () {
    const newActiveSectionTitle = this.state.suggestions[this.selectedSectionIndex].title;
    const sectionTitleClass = '.searchbarTrigger';
    document.querySelector(`${sectionTitleClass}.-active`)
      .classList.remove('-active');
    document.querySelector(`${sectionTitleClass}[data-value="${newActiveSectionTitle}"]`)
      .classList.add('-active');
  }

  resetListContainerAuxData () {
    this.selectedSectionIndex = this.nextSelectedSectionIndex;
    this.selectedItemIndex = this.nextSelectedItemIndex;
    this.toBottomOfList = this.possiblenNeedUpdateContainerToLeft;
    this.possiblenNeedUpdateContainerToRight = !this.possiblenNeedUpdateContainerToRight;
    this.possiblenNeedUpdateContainerToLeft = !this.possiblenNeedUpdateContainerToLeft;
  }

  renderListContainer (suggestions) {
    if ((this.possiblenNeedUpdateContainerToRight && this.lastButtonPressed === KEY_CODE.DOWN) ||
       (this.possiblenNeedUpdateContainerToLeft && this.lastButtonPressed === KEY_CODE.UP)) {
      this.resetListContainerAuxData();
      this.switchActiveSectionClass();
    }

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

    function getSelectedSectionSuggestions (suggestionsArray, selectedSectionIndex) {
      return suggestionsArray[selectedSectionIndex].sectionSuggestions;
    }

    let content;

    if (this.state.loading) {
      content = createLoadingDivs();
    } else if (!this.state.loading && suggestions) {
      content = getSelectedSectionSuggestions(suggestions, this.selectedSectionIndex);
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
    const btnActive = this.findSelectedSuggestions(this.props.options).settings;
    const currentSectionTitle = this.findSelectedSuggestions(this.props.options).title;
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
    const settings = this.findSelectedSuggestions(this.props.options).settings;
    let forceSearchToolsPanel = false;

    if (settings) {
      const settingsDropdowns = settings.map((dropdownData, i) => {
        if (dropdownData.open) {
          forceSearchToolsPanel = true;
        }
        const dropdownOptions = dropdownData.options.map((option) => ({
          text: option.text,
          cb: option.cb,
        }));
        const onSelect = (text) => {
          for (const option of dropdownOptions) { // eslint-disable-line
            if (option.text === text) {
              this.onSuggestionsUpdateRequested({ value: this.state.value });
              option.cb(this.state.value, text);
            }
          }
        };
        return (
          <SelectDropdown
            key={i}
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
      // if we have less then 3 default categories,
      // set categories amount to 3 (prevent width shrinking)
      const coeff = categoriesCount > 3 ? categoriesCount : 3;
      const categoryWidth = 90;
      const gap = 60;
      const properWidth = (coeff * categoryWidth) + gap;
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
    const { fixedWidth, ignoreLoadingClearBtn } = this.props; // eslint-disable-line

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
        {(!noClearBtn && value && (!loading || ignoreLoadingClearBtn)) ? inputBtn : ''}
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
      placeholder = this.props.placeholder || 'Search'; // eslint-disable-line
    }

    if (this.props.label) {
      label = (
        // eslint-disable-next-line
        label = <label className={classNames('form__label', { '-required': this.props.required })}>{this.props.label}</label>
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
      value: value || '',
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
          highlightFirstSuggestion
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

AutosuggestSearchbar.displayName = 'AutosuggestSearchbar';

AutosuggestSearchbar.propTypes = {
  value: PropTypes.string,
  options: PropTypes.array.isRequired,
  noPlaceholder: PropTypes.bool,
  mainSection: PropTypes.string,
  id: PropTypes.string,
  fixedWidth: PropTypes.bool,
  label: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  noClearBtn: PropTypes.bool, // not actually used
};

export default AutosuggestSearchbar;
