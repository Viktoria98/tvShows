import _immutable from 'immutable';
import './plugin.css';

import _Mention from './Mention';
import _MentionSuggestions from './MentionSuggestions';
import _MentionSuggestionsPortal from './MentionSuggestionsPortal';
import _mentionStrategy from './mentionStrategy';
import _mentionSuggestionsStrategy from './mentionSuggestionsStrategy';
import _decorateComponentWithProps from 'decorate-component-with-props';

const _mentionStyles2 = {
  mention: 'draftJsMentionPlugin__mention__29BEd',
};

const _mentionSuggestionsStyles = {
  mentionSuggestions: 'draftJsMentionPlugin__mentionSuggestions__2DWjA',
};

const _mentionSuggestionsEntryStyles = {
  mentionSuggestionsEntry: 'draftJsMentionPlugin__mentionSuggestionsEntry__3mSwm',
  mentionSuggestionsEntryFocused:
    'draftJsMentionPlugin__mentionSuggestionsEntryFocused__3LcTd draftJsMentionPlugin__mentionSuggestionsEntry__3mSwm',
  mentionSuggestionsEntryText: 'draftJsMentionPlugin__mentionSuggestionsEntryText__3Jobq',
  mentionSuggestionsEntryAvatar: 'draftJsMentionPlugin__mentionSuggestionsEntryAvatar__1xgA9',
};

import _defaultSuggestionsFilter from './utils/defaultSuggestionsFilter';
import _positionSuggestions from './utils/positionSuggestions';

const createMentionPlugin = function createMentionPlugin () {
  const config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  const defaultTheme = {
    mention: _mentionStyles2.mention,
    mentionSuggestions: _mentionSuggestionsStyles.mentionSuggestions,
    mentionSuggestionsEntry: _mentionSuggestionsEntryStyles.mentionSuggestionsEntry,
    mentionSuggestionsEntryFocused: _mentionSuggestionsEntryStyles.mentionSuggestionsEntryFocused,
    mentionSuggestionsEntryText: _mentionSuggestionsEntryStyles.mentionSuggestionsEntryText,
    mentionSuggestionsEntryAvatar: _mentionSuggestionsEntryStyles.mentionSuggestionsEntryAvatar,
  };

  const callbacks = {
    keyBindingFn: undefined,
    handleKeyCommand: undefined,
    onDownArrow: undefined,
    onUpArrow: undefined,
    onTab: undefined,
    onEscape: undefined,
    handleReturn: undefined,
    onChange: undefined,
  };

  const ariaProps = {
    ariaHasPopup: 'false',
    ariaExpanded: 'false',
    ariaOwneeID: undefined,
    ariaActiveDescendantID: undefined,
  };

  let searches = (0, _immutable.Map)();
  let escapedSearch;
  let clientRectFunctions = (0, _immutable.Map)();

  const store = {
    getEditorState: undefined,
    setEditorState: undefined,
    getPortalClientRect: function getPortalClientRect (offsetKey) {
      return clientRectFunctions.get(offsetKey)();
    },
    getAllSearches: function getAllSearches () {
      return searches;
    },
    isEscaped: function isEscaped (offsetKey) {
      return escapedSearch === offsetKey;
    },
    escapeSearch: function escapeSearch (offsetKey) {
      escapedSearch = offsetKey;
    },

    resetEscapedSearch: function resetEscapedSearch () {
      escapedSearch = undefined;
    },

    register: function register (offsetKey) {
      searches = searches.set(offsetKey, offsetKey);
    },

    updatePortalClientRect: function updatePortalClientRect (offsetKey, func) {
      clientRectFunctions = clientRectFunctions.set(offsetKey, func);
    },

    unregister: function unregister (offsetKey) {
      searches = searches.delete(offsetKey);
      clientRectFunctions = clientRectFunctions.delete(offsetKey);
    },
  };

  const _config$mentionPrefix = config.mentionPrefix;
  const mentionPrefix = _config$mentionPrefix === undefined ? '' : _config$mentionPrefix;
  const _config$theme = config.theme;
  const theme = _config$theme === undefined ? defaultTheme : _config$theme;
  const _config$positionSugge = config.positionSuggestions;
  const positionSuggestions =
    _config$positionSugge === undefined ? _positionSuggestions : _config$positionSugge;

  const mentionSearchProps = {
    ariaProps,
    callbacks,
    theme,
    store,
    entityMutability: config.entityMutability ? config.entityMutability : 'SEGMENTED',
    positionSuggestions,
  };

  return {
    MentionSuggestions: (0, _decorateComponentWithProps)(_MentionSuggestions, mentionSearchProps),
    decorators: [
      {
        strategy: _mentionStrategy,
        component: (0, _decorateComponentWithProps)(_Mention, {
          theme,
          mentionPrefix,
        }),
      },
      {
        strategy: _mentionSuggestionsStrategy,
        component: (0, _decorateComponentWithProps)(_MentionSuggestionsPortal, {
          store,
        }),
      },
    ],
    getAccessibilityProps: function getAccessibilityProps () {
      return {
        role: 'combobox',
        ariaAutoComplete: 'list',
        ariaHasPopup: ariaProps.ariaHasPopup,
        ariaExpanded: ariaProps.ariaExpanded,
        ariaActiveDescendantID: ariaProps.ariaActiveDescendantID,
        ariaOwneeID: ariaProps.ariaOwneeID,
      };
    },

    initialize: function initialize (_ref) {
      const getEditorState = _ref.getEditorState;
      const setEditorState = _ref.setEditorState;

      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },

    onDownArrow: function onDownArrow (keyboardEvent) {
      return callbacks.onDownArrow && callbacks.onDownArrow(keyboardEvent);
    },
    onTab: function onTab (keyboardEvent) {
      return callbacks.onTab && callbacks.onTab(keyboardEvent);
    },
    onUpArrow: function onUpArrow (keyboardEvent) {
      return callbacks.onUpArrow && callbacks.onUpArrow(keyboardEvent);
    },
    onEscape: function onEscape (keyboardEvent) {
      return callbacks.onEscape && callbacks.onEscape(keyboardEvent);
    },
    handleReturn: function handleReturn (keyboardEvent) {
      return callbacks.handleReturn && callbacks.handleReturn(keyboardEvent);
    },
    onChange: function onChange (editorState) {
      if (callbacks.onChange) {
        return callbacks.onChange(editorState);
      }
      return editorState;
    },
  };
};

export default createMentionPlugin;

export const defaultSuggestionsFilter = _defaultSuggestionsFilter;
