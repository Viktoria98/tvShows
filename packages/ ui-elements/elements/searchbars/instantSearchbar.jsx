import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './searchbars.styl';

const InstantSearchbar = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      string: props.value || '',
    };
    this.timeout = false;

    this.updateSearch = this.updateSearch.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.clear = this.clear.bind(this);
  }

  componentWillReceiveProps (props) {
    this.setState({ string: props.value || '' });
  }

  updateSearch (e) {
    const val = e.target.value;
    this.setState({ string: val });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.props.updateSearch(val);
    }, 600);
  }

  keydownHandler (e) {
    const keyCodes = {
      ESC: 27,
    };
    if (e.keyCode === keyCodes.ESC) {
      this.clear();
    }
  }

  clear () {
    const { resetSearch } = this.props;
    if (typeof resetSearch === 'function') {
      resetSearch();
    }
  }

  render () {
    console.log(this.props);
    const { string } = this.state;
    const { resetSearch } = this.props;
    const clearBtn =
      string.length && resetSearch ? (
        <div onClick={this.clear} className="searchbar__clear-btn" />
      ) : (
        false
      );
    return (
      <div className="searchbar">
        <input
          type="text"
          className="searchbar__input"
          placeholder="Search"
          value={string}
          onChange={this.updateSearch}
          onKeyDown={this.keydownHandler}
        />
        {clearBtn}
      </div>
    );
  }
};

InstantSearchbar.propTypes = {
  value: PropTypes.string,
  updateSearch: PropTypes.func,
  resetSearch: PropTypes.func,
};

export default InstantSearchbar;
