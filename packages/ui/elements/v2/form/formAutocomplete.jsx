/* eslint-disable react/prop-types */

import React, { Component } from 'react';
import classNames from 'classnames';

import AutosuggestSearchbar from '../searchbars/AutosuggestSearchbar.jsx';

const FormAutocomplete = class extends Component {
  componentWillReceiveProps (nextProps) {
    if (nextProps !== this.props) {
      this.refs.search.setState({ value: nextProps.value || '' });
    }
  }

  render () {
    return (
      <div
        id={this.props.id}
        className={
          classNames(
            'form__element form__autosuggest',
            this.props.className
          )
        }
      >
        <label>{this.props.label}</label>
        <div className="container">
          <AutosuggestSearchbar
            ref="search"
            name="search"
            options={this.props.options}
            value={this.props.value}
            placeholder={this.props.placeholder || ''}
            ignoreLoadingClearBtn
            searchWithoutFilters
          />
          <span className="input__hint">{this.props.value ? this.props.value.hint : ''}</span>
        </div>
      </div>
    );
  }
};

FormAutocomplete.displayName = 'FormAutocomplete';

FormAutocomplete.propTypes = {

};

export default FormAutocomplete;
