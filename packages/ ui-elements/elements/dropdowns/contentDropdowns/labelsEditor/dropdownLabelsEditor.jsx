import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Base from '../base/dropdownBase.jsx';
import { Label, LabelsContainer } from '../../../labels/';
import { AutosuggestSimple } from '../../../autosuggest/';

const DropdownLabelsEditor = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      suggestions: [],
    };

    this.onDeleteLabel = this.onDeleteLabel.bind(this);
    this.onAddLabel = this.onAddLabel.bind(this);
    this.fetchLabels = this.fetchLabels.bind(this);
  }

  onDeleteLabel (value) {
    const { onUpdate, field, labels } = this.props;
    const updatedLabels = labels.filter((label) => label !== value);

    onUpdate({ value: updatedLabels, targetField: field });
  }

  onAddLabel (value) {
    const { onUpdate, field, labels } = this.props;
    const updatedLabels = labels.concat(value);

    onUpdate({ value: updatedLabels, targetField: field });
  }

  fetchLabels (value) {
    const { onFetch } = this.props;

    try {
      onFetch(value)
        .then((res) => this.setState({ suggestions: res }));
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  render () {
    const {
      labels, onFetch, onUpdate, prepareSuggestions, ...rest
    } = this.props;

    let { suggestions } = this.state;

    if (prepareSuggestions) {
      suggestions = prepareSuggestions(suggestions);
    }

    // we don't use LabelsContainer here only because we don't need wrapper, as well as disabled callback
    // wrapper will be provided by dropdownBase button component
    // after migration to React 16 we should use LabelsContainer exporting labels as fragments
    const renderedLabels = labels.map((label, key) => <Label key={key} value={label} />);

    return (
      <Base {...rest} btnComponent={renderedLabels}>
        <LabelsContainer labels={labels} onDisable={this.onDeleteLabel} />
        <AutosuggestSimple
          suggestions={suggestions}
          onFetch={this.fetchLabels}
          onSuggestionSelect={this.onAddLabel}
        />
      </Base>
    );
  }
};

DropdownLabelsEditor.propTypes = {
  labels: PropTypes.array,
  onFetch: PropTypes.func,
  onUpdate: PropTypes.func,
  prepareSuggestions: PropTypes.func,
};

export default DropdownLabelsEditor;
