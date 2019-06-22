/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Spinner from '../../spinner/spinnerBase.jsx';
import './autosuggest.styl';
import PillsList from './pillsList';
import CategoriesList from './categoriesList';
import ItemsList from './itemsList';

const Autosuggest = class extends Component {
  constructor (props) {
    super(props);
    this.loaded = false;
    const { onSelectSuggestion, fetchSuggestions } = this.props;

    this.modes = ['input', 'category', 'item'];
    this.state = {
      showAutosuggest: false,
      categorySelected: props.categorySelected,
      itemSelected: null,
      filtersToDelete: [],
      mode: this.modes[0],
      value: props.value,
      categories: [],
      items: [],
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onKey = this.onKey.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.handleHoverItem = this.handleHoverItem.bind(this);
    this.handleSelectCategory = this.handleSelectCategory.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    this.getItems = this.getItems.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.setSelected = this.setSelected.bind(this);
    this.handleClearInput = this.handleClearInput.bind(this);
    this.shouldOpenSuggestions =
      props.shouldOpenSuggestions || this.shouldOpenSuggestions.bind(this);
    this.updateFilters = _.debounce(() => {
      onSelectSuggestion(this.state.chosenItems);
    }, 1000);
    this.updateSuggestions = _.debounce((clear) => {
      if (clear) {
        fetchSuggestions('');
      } else {
        fetchSuggestions(this.state.value);
      }
    }, 500);
  }

  componentWillMount () {
    const { categorySelected } = this.state;
    const { autosuggestData, multiFilters, forceFilters } = this.props;
    this.propsToState({
      categorySelected,
      autosuggestData,
      multiFilters,
      forceFilters,
    });
  }

  componentWillReceiveProps (nextProps) {
    const { fetchSuggestions } = this.props;
    const { categorySelected } = this.state;
    const {
      autosuggestData, value, multiFilters, forceFilters,
    } = nextProps;
    if (!this.loaded) {
      this.loaded = true;
      fetchSuggestions(value);
    }

    this.propsToState({
      categorySelected,
      autosuggestData,
      multiFilters,
      forceFilters,
    });
  }

  onKey (e) {
    const catchKeys = ['Escape', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Enter'];
    const { mode } = this.state;
    const { key } = e;
    if (catchKeys.includes(key) && mode !== 'input') {
      e.preventDefault();
    }
    if (key === 'Enter') {
      this.handleEnter();
    } else if (key === 'ArrowLeft') {
      this.handleLeft();
    } else if (key === 'ArrowRight') {
      this.handleRight();
    } else if (key === 'ArrowDown') {
      this.handleDown();
    } else if (key === 'ArrowUp') {
      this.handleUp();
    } else if (key === 'Escape') {
      this.close();
    }
  }

  setFocus () {
    return setTimeout(() => {
      this.input.focus();
    }, 100);
  }

  getMode (act) {
    const { mode } = this.state;
    const modeIndex = this.modes.indexOf(mode);
    if (act === 'up') {
      if (modeIndex !== 0) {
        return _.nth(this.modes, modeIndex - 1);
      }
    } else if (act === 'down') {
      const newMode = _.nth(this.modes, modeIndex + 1);
      if (newMode) {
        return newMode;
      }
    }
    return mode;
  }

  getItems () {
    const { categorySelected, items } = this.state;
    let categoryItems = [];
    items.forEach((i) => {
      if (i.name === categorySelected) {
        categoryItems = i.items;
      }
    });

    const sortItems = (a, b) => {
      if (a.value === null) {
        return 1;
      }
      if (b.value === null) {
        return -1;
      }
      const f1 = _.get(a, 'order', Number.MAX_SAFE_INTEGER);
      const f2 = _.get(b, 'order', Number.MAX_SAFE_INTEGER);
      if (f1 === f2) {
        return a.index > b.index ? 1 : -1;
      }
      return f1 > f2 ? 1 : -1;
    };
    categoryItems.sort(sortItems);

    return categoryItems;
  }

  setSelected (itemIndex, index) {
    const itemHeight = 32;
    const el = this.itemsList;
    const { clientHeight, scrollTop } = el;
    const elOffset = index * itemHeight;
    const fullHeight = elOffset + itemHeight;
    if (fullHeight - scrollTop > clientHeight) {
      el.scrollTop = fullHeight - clientHeight;
    } else if (elOffset - scrollTop < 0) {
      el.scrollTop = elOffset;
    }

    return this.setState({ itemSelected: itemIndex });
  }

  open (e) {
    // Open if rehydrate not work and first load
    if (!this.loaded) {
      const { fetchSuggestions, value } = this.props;
      this.loaded = true;
      fetchSuggestions(value);
    }

    if (e) {
      e.stopPropagation();
    }
    const shouldOpen = this.shouldOpenSuggestions();
    if (!shouldOpen) {
      return;
    }

    this.setState({ showAutosuggest: true });
    const { showAutosuggest } = this.state;
    if (!showAutosuggest) {
      this.setFocus();
    }
    document.removeEventListener('click', this.close, false);
    document.removeEventListener('keydown', this.onKey, false);
    document.addEventListener('click', this.close, false);
    document.addEventListener('keydown', this.onKey, false);
  }

  close () {
    this.setState({ showAutosuggest: false });
    document.removeEventListener('click', this.close, false);
    document.removeEventListener('keydown', this.onKey, false);
  }

  shouldOpenSuggestions () {
    const { readOnly } = this.props;
    return !readOnly;
  }

  prepareSuggests (autosuggestData) {
    return _.map(autosuggestData, (dataItem) => {
      const i = { ...dataItem };
      if (!_.isEmpty(i.undefinedValue)) {
        // dynamically add filter for empty values
        i.items = {
          '': {
            counter: 0,
            text: i.undefinedValue,
            value: '',
          },
          ...i.items,
        };
      }

      if (i.reset) {
        // dynamically add reset
        i.items = {
          null: {
            counter: 0,
            prompt: i.counter,
            text: i.reset,
            value: null,
          },
          ...i.items,
        };
      }

      const itemsList = _.map(i.items, (item) => ({
        ...item,
        type: i.type,
        index: `${i.name}:${item.value}`,
        category: i.name,
      }));

      const sortFunction = _.get(this.props.sortingFunctions, i.name);
      if (_.isFunction(sortFunction)) {
        itemsList.sort(sortFunction);
      }
      return { ...i, items: itemsList };
    });
  }

  handleEnter () {
    const {
      mode, categorySelected, itemSelected, items, value,
    } = this.state;
    const chooseItem = (selected) => {
      let category = items.find((i) => i.name === categorySelected);
      if (_.isEmpty(category)) {
        category = { items: [] };
      }
      const item = category.items.find((i) => i.index === selected);
      if (!_.isEmpty(item)) {
        this.handleSelectItem(item);
      }
    };

    if (categorySelected) {
      if (mode === 'category' || mode === 'input') {
        if (_.isFunction(this.props.onEnter)) {
          this.props.onEnter({ category: categorySelected, value });
        } else if (mode === 'input') {
          chooseItem(`${categorySelected}:${value}`);
        }
      } else if (mode === 'item') {
        chooseItem(itemSelected);
      }
    }
  }

  handleLeft () {
    const { mode } = this.state;
    if (mode === 'item') {
      this.setState({
        mode: this.getMode('up'),
        itemSelected: null,
      });
    }
  }

  handleRight () {
    const { mode } = this.state;
    if (mode === 'category') {
      this.selectItem('down');
      this.setState({ mode: this.getMode('down') });
    }
  }

  handleUp () {
    const { mode, categorySelected, categories } = this.state;
    if (mode === 'category') {
      const index = categories.findIndex((i) => i.name === categorySelected);
      if (index === 0) {
        this.setFocus();
      }
      this.selectCategory('prew');
    } else if (mode === 'item') {
      this.selectItem('prew');
    }
  }

  handleDown () {
    const { mode } = this.state;
    if (mode === 'input') {
      this.input.blur();
      this.selectCategory('next');
      this.setState({ mode: this.getMode('down') });
    } else if (mode === 'category') {
      this.selectCategory('next');
    } else if (mode === 'item') {
      this.selectItem('next');
    }
  }

  handleInputChange (e) {
    const { showAutosuggest } = this.state;
    if (!showAutosuggest) {
      this.open();
    }
    this.setState({ value: e.target.value });
    this.updateSuggestions();
    this.updateFilters();
  }

  handleInputFocus () {
    this.setState({ mode: 'input' });
  }

  handleSelectCategory (category) {
    this.setState({
      categorySelected: category.name,
      mode: 'category',
    });
  }

  handleSelectItem (item) {
    let { chosenItems } = this.state;
    const { value } = this.state;
    if (item.value === null) {
      // On click reset item
      chosenItems = chosenItems.filter((i) => i.category !== item.category);
      this.setState({ chosenItems });
      this.updateFilters();
      return;
    }

    const index = chosenItems.findIndex((i) => i.index === item.index);
    if (index !== -1) {
      chosenItems = chosenItems.filter((i) => i.index !== item.index);
      this.setState({ chosenItems });
      this.updateFilters();
      return;
    }
    if (item.opposite) {
      chosenItems = chosenItems.filter((i) => !(
        item.category === i.category && item.opposite.includes(i.value)
      ));
    }
    chosenItems.push(item);

    this.setState({
      chosenItems,
      value: this.props.keepValue ? value : '',
    });
    if (value !== '') {
      this.updateSuggestions();
    }
    this.updateFilters();
  }

  handleHoverItem (index) {
    this.setState({
      itemSelected: index,
      mode: 'item',
    });
  }

  handleRemoveFilter (filter) {
    if (!this.state.showAutosuggest) {
      return false;
    }
    const { chosenItems } = this.state;
    const newChosenItems = _.difference(chosenItems, [filter]);
    this.setState({ chosenItems: newChosenItems });
    return this.updateFilters();
  }

  handleClearInput () {
    this.updateSuggestions(true);
    this.setState({ value: '' });
    this.input.focus();
  }

  selectCategory (act) {
    const { categorySelected, categories } = this.state;
    if (_.isEmpty(categories)) {
      return;
    }
    if (_.isEmpty(categorySelected)) {
      this.setState({ categorySelected: _.first(categories).name });
      return;
    }
    const index = categories.findIndex((i) => i.name === categorySelected);
    if (act === 'prew') {
      if (index > 0) {
        this.setState({
          categorySelected: _.nth(categories, index - 1).name,
        });
      }
    } else if (act === 'next') {
      const nextItem = _.nth(categories, index + 1);
      if (nextItem) {
        this.setState({
          categorySelected: _.nth(categories, index + 1).name,
        });
      }
    }
  }

  propsToState ({
    categorySelected, autosuggestData, multiFilters, forceFilters,
  }) {
    if (_.isEmpty(autosuggestData)) {
      this.setState({
        categories: [],
        items: [],
        categorySelected: null,
        chosenItems: multiFilters,
      });
      return;
    }

    let categories = _.map(autosuggestData, (i) => ({
      name: i.name,
      isSearch: i.isSearch,
      counter: i.counter,
      index: i.index,
    }));

    categories = categories.sort((a, b) => parseInt(a.index, 10) - parseInt(b.index, 10));

    let selected = categorySelected;
    if (!Object.keys(autosuggestData)
      .includes(categorySelected)) {
      selected = Object.keys(autosuggestData)[0]; // eslint-disable-line
    }

    // set unique index to items;
    const items = this.prepareSuggests(autosuggestData);
    const filters = _.isEmpty(forceFilters) ? multiFilters : forceFilters;
    this.setState({
      categories,
      items,
      categorySelected: selected,
      chosenItems: filters,
    });
  }

  selectItem (act) {
    const { items, itemSelected, categorySelected } = this.state;
    const category = items.filter((i) => i.name === categorySelected);
    if (_.isEmpty(category)) {
      return;
    }
    const categoryItems = category[0].items;
    if (!itemSelected) {
      this.setSelected(_.first(categoryItems).index, 0);
      return;
    }
    const index = categoryItems.findIndex((i) => i.index === itemSelected);
    if (act === 'prew') {
      if (index > 0) {
        this.setSelected(_.nth(categoryItems, index - 1).index, index - 1);
      }
    } else if (act === 'next') {
      const nextItem = _.nth(categoryItems, index + 1);
      if (nextItem) {
        this.setSelected(nextItem.index, index + 1);
      }
    }
  }

  resetFilters () {
    const { clearInput } = this.props;
    this.setState({ chosenItems: [] });
    this.updateFilters();
    this.handleClearInput();
    clearInput();
  }

  render () {
    const {
      readOnly,
      multiFilters,
      forceFilters,
      customItemTemplates,
      loading,
      loadingIndicator,
    } = this.props;
    let disableFilters = [];
    if (!_.isEmpty(forceFilters)) {
      disableFilters = multiFilters;
    }

    const {
      showAutosuggest,
      categorySelected,
      value,
      categories,
      itemSelected,
      chosenItems,
      filtersToDelete,
    } = this.state;

    const icon =
      loadingIndicator && loading ? (
        <Spinner type="sk-fading-circle" />
      ) : (
        <i className="material-icons">search</i>
      );

    let inputPillsBlock = null;
    if (!_.isEmpty(chosenItems)) {
      inputPillsBlock = (
        <div className="autosuggesDropdown__input-block">
          <PillsList
            items={chosenItems}
            disabledItems={disableFilters}
            onClosing={this.handleRemoveFilter}
            checked={filtersToDelete}
          />
        </div>
      );
    }

    const showInput = () => showAutosuggest || _.isEmpty(chosenItems);

    const items = this.getItems();
    let suggestionsBlock = null;
    if (_.isEmpty(items) && _.isEmpty(categories)) {
      suggestionsBlock = (
        <div className="autosuggesDropdown__content-block">
          <p className="no-results">No results found. Please, put another value</p>
        </div>
      );
    } else {
      suggestionsBlock = (
        <div className="autosuggesDropdown__content-block">
          <CategoriesList
            items={categories}
            selected={categorySelected}
            chosen={chosenItems.map((item) => item.category)}
            onCheck={this.handleSelectCategory}
            ref={(i) => {
              this.categories = i;
            }}
          />
          <ItemsList
            items={items}
            customItemTemplates={customItemTemplates}
            onSelect={this.handleSelectItem}
            onHover={this.handleHoverItem}
            category={categorySelected}
            selected={itemSelected}
            checked={chosenItems}
            ref={(i) => {
              this.itemsList = i;
            }}
          />
        </div>
      );
    }

    return (
      <ul
        id={this.props.id}
        className={classNames(
          'autosuggesDropdown',
          { '-active': showAutosuggest },
          { disabled: readOnly }
        )}
        onClick={this.open}
        onKeyPress={() => {}}
      >
        <div>
          {icon}
          {inputPillsBlock}
          <input
            type="text"
            value={value}
            ref={(i) => {
              this.input = i;
            }}
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
            style={{ display: showInput() ? 'inherit' : 'none' }}
          />
          {value || chosenItems.length !== 0 ? (
            <button className="autosuggesDropdown__clear-btn" onClick={this.resetFilters} />
          ) : null}
        </div>
        <div
          className={classNames('autosuggesDropdown__content', {
            '-active': showAutosuggest,
          })}
        >
          {suggestionsBlock}
        </div>
      </ul>
    );
  }
};

Autosuggest.propTypes = {
  id: PropTypes.string,
  autosuggestData: PropTypes.instanceOf(Object).isRequired,
  categorySelected: PropTypes.string,
  clearInput: PropTypes.func.isRequired,
  onEnter: PropTypes.func,
  customItemTemplates: PropTypes.instanceOf(Object),
  sortingFunctions: PropTypes.instanceOf(Object),
  fetchSuggestions: PropTypes.func.isRequired,
  forceFilters: PropTypes.instanceOf(Array),
  loading: PropTypes.bool,
  loadingIndicator: PropTypes.bool,
  multiFilters: PropTypes.arrayOf((propValue, key) => {
    if (
      !_.has(propValue[key], 'category') ||
      !_.has(propValue[key], 'type') ||
      !_.has(propValue[key], 'value') ||
      !_.has(propValue[key], 'text')
    ) {
      throw new Error(`Invalid one of item props data:${JSON.stringify(propValue)}`);
    }
  }),
  onSelectSuggestion: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  keepValue: PropTypes.bool,
  value: PropTypes.string,
  shouldOpenSuggestions: PropTypes.func,
};

Autosuggest.defaultProps = {
  id: '',
  categorySelected: '',
  value: '',
  onEnter: () => {},
  multiFilters: [],
  customItemTemplates: {},
  sortingFunctions: {},
  forceFilters: [],
  loading: false,
  loadingIndicator: false,
  readOnly: false,
  keepValue: false,
  shouldOpenSuggestions: null,
};

export default Autosuggest;
