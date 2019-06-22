import React from 'react';
import PropTypes from 'prop-types';

import AutosuggestSuggestion from './autosuggestSuggestion.jsx';

// TODO: uncomment when logical error will be solved on AAD side
// import { ListKeyActionsContainer } from '../../helperComponents/';

const AutosuggestSuggestionsContainer = (props) => {
  const { suggestions, suggestionCallback } = props;

  const renderSuggestions = (hovered) =>
    suggestions.map((item, i) => (
      <AutosuggestSuggestion
        key={i}
        hovered={hovered === i}
        callback={suggestionCallback}
        text={item.text}
        value={item.value}
      />
    ));

  const suggestionsToRender = renderSuggestions();
  return (
    <div className="autosuggest-simple__suggestions-container">
      {suggestionsToRender}
      {/* <ListKeyActionsContainer
        items={suggestions}
        onSelect={suggestionCallback}
      >
        {({ hovered }) => renderSuggestions(hovered)}
      </ListKeyActionsContainer> */}
    </div>
  );
};

AutosuggestSuggestionsContainer.propTypes = {
  suggestions: PropTypes.array,
};

AutosuggestSuggestionsContainer.defaultProps = {
  suggestions: [],
};

export default AutosuggestSuggestionsContainer;
