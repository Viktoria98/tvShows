Object.defineProperty(exports, '__esModule', {
  value: true,
});

const _extends =
  Object.assign ||
  function (target) {
    for (let i = 1; i < arguments.length; i++) {
      const source = arguments[i];
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

const _createClass = (function () {
  function defineProperties (target, props) {
    for (let i = 0; i < props.length; i++) {
      const descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) {
        descriptor.writable = true;
      }
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) {
      defineProperties(Constructor.prototype, protoProps);
    }
    if (staticProps) {
      defineProperties(Constructor, staticProps);
    }
    return Constructor;
  };
}());

const _react = require('react');

const _react2 = _interopRequireDefault(_react);

const _Entry = require('./Entry');

const _Entry2 = _interopRequireDefault(_Entry);

const _addMention = require('../modifiers/addMention');

const _addMention2 = _interopRequireDefault(_addMention);

const _decodeOffsetKey = require('../utils/decodeOffsetKey');

const _decodeOffsetKey2 = _interopRequireDefault(_decodeOffsetKey);

const _draftJs = require('draft-js');

const _PropTypes = require('prop-types');

const _getSearchText2 = require('../utils/getSearchText');

const _getSearchText3 = _interopRequireDefault(_getSearchText2);

function _interopRequireDefault (obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _possibleConstructorReturn (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
}

function _inherits (subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(`Super expression must either be null or a function, not ${typeof superClass}`);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  if (superClass) {
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
  }
}

const MentionSuggestions = (function (_Component) {
  _inherits(MentionSuggestions, _Component);

  function MentionSuggestions () {
    let _Object$getPrototypeO;

    let _temp,
      _this,
      _ret;

    _classCallCheck(this, MentionSuggestions);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (
      (_ret = ((_temp = ((_this = _possibleConstructorReturn(
        this,
        (_Object$getPrototypeO = Object.getPrototypeOf(MentionSuggestions)).call.apply(
          _Object$getPrototypeO,
          [this].concat(args)
        )
      )),
      _this)),
      (_this.state = {
        isActive: false,
        focusedOptionIndex: 0,
      }),
      (_this.componentDidUpdate = function (prevProps, prevState) {
        if (_this.refs.popover) {
          (function () {
            // In case the list shrinks there should be still an option focused.
            // Note: this might run multiple times and deduct 1 until the condition is
            // not fullfilled anymore.
            const size = _this.props.suggestions.size;
            if (size > 0 && _this.state.focusedOptionIndex >= size) {
              _this.setState({
                focusedOptionIndex: size - 1,
              });
            }

            const decoratorRect = _this.props.store.getPortalClientRect(_this.activeOffsetKey);
            const newStyles = _this.props.positionSuggestions({
              decoratorRect,
              prevProps,
              prevState,
              props: _this.props,
              state: _this.state,
              popover: _this.refs.popover,
            });
            Object.keys(newStyles)
              .forEach((key) => {
                _this.refs.popover.style[key] = newStyles[key];
              });
          }());
        }
      }),
      (_this.componentWillUnmount = function () {
        _this.props.callbacks.onChange = undefined;
      }),
      (_this.onEditorStateChange = function (editorState) {
        const searches = _this.props.store.getAllSearches();

        // if no search portal is active there is no need to show the popover
        if (searches.size === 0) {
          return editorState;
        }

        const removeList = function removeList () {
          _this.props.store.resetEscapedSearch();
          _this.closeDropdown();
          return editorState;
        };

        // get the current selection
        const selection = editorState.getSelection();
        const anchorOffset = selection.getAnchorOffset();

        // the list should not be visible if a range is selected or the editor has no focus
        if (!selection.isCollapsed() || !selection.getHasFocus()) {
          return removeList();
        }

        // identify the start & end positon of each search-text
        const offsetDetails = searches.map((offsetKey) =>
          (0, _decodeOffsetKey2.default)(offsetKey));

        // a leave can be empty when it is removed due e.g. using backspace
        const leaves = offsetDetails.map((_ref) => {
          const blockKey = _ref.blockKey;
          const decoratorKey = _ref.decoratorKey;
          const leafKey = _ref.leafKey;
          return editorState.getBlockTree(blockKey)
            .getIn([decoratorKey, 'leaves', leafKey]);
        });

        // if all leaves are undefined the popover should be removed
        if (leaves.every((leave) => leave === undefined)) {
          return removeList();
        }

        // Checks that the cursor is after the @ character but still somewhere in
        // the word (search term). Setting it to allow the cursor to be left of
        // the @ causes troubles due selection confusion.
        const selectionIsInsideWord = leaves.filter((leave) => leave !== undefined)
          .map((_ref2) => {
            const start = _ref2.start;
            const end = _ref2.end;
            return (
              (start === 0 && anchorOffset === 1 && anchorOffset <= end) || // @ is the first character
            (anchorOffset > start + 1 && anchorOffset <= end) // @ is in the text or at the end
            );
          });

        if (selectionIsInsideWord.every((isInside) => isInside === false)) {
          return removeList();
        }

        _this.activeOffsetKey = selectionIsInsideWord
          .filter((value) => value === true)
          .keySeq()
          .first();

        _this.onSearchChange(editorState, selection);

        // make sure the escaped search is reseted in the cursor since the user
        // already switched to another mention search
        if (!_this.props.store.isEscaped(_this.activeOffsetKey)) {
          _this.props.store.resetEscapedSearch();
        }

        // If none of the above triggered to close the window, it's safe to assume
        // the dropdown should be open. This is useful when a user focuses on another
        // input field and then comes back: the dropdown will again.
        if (!_this.state.isActive && !_this.props.store.isEscaped(_this.activeOffsetKey)) {
          _this.openDropdown();
        }

        // makes sure the focused index is reseted every time a new selection opens
        // or the selection was moved to another mention search
        if (
          _this.lastSelectionIsInsideWord === undefined ||
          !selectionIsInsideWord.equals(_this.lastSelectionIsInsideWord)
        ) {
          _this.setState({
            focusedOptionIndex: 0,
          });
        }

        _this.lastSelectionIsInsideWord = selectionIsInsideWord;

        return editorState;
      }),
      (_this.onSearchChange = function (editorState, selection) {
        const _getSearchText = (0, _getSearchText3.default)(editorState, selection);

        const word = _getSearchText.word;

        const searchValue = word.substring(1, word.length);
        if (_this.lastSearchValue !== searchValue) {
          _this.lastSearchValue = searchValue;
          _this.props.onSearchChange({ value: searchValue });
        }
      }),
      (_this.onDownArrow = function (keyboardEvent) {
        keyboardEvent.preventDefault();
        const newIndex = _this.state.focusedOptionIndex + 1;
        _this.onMentionFocus(newIndex >= _this.props.suggestions.size ? 0 : newIndex);
      }),
      (_this.onTab = function (keyboardEvent) {
        keyboardEvent.preventDefault();
        _this.commitSelection();
      }),
      (_this.onUpArrow = function (keyboardEvent) {
        keyboardEvent.preventDefault();
        if (_this.props.suggestions.size > 0) {
          const newIndex = _this.state.focusedOptionIndex - 1;
          _this.onMentionFocus(Math.max(newIndex, 0));
        }
      }),
      (_this.onEscape = function (keyboardEvent) {
        keyboardEvent.preventDefault();

        const activeOffsetKey = _this.lastSelectionIsInsideWord
          .filter((value) => value === true)
          .keySeq()
          .first();
        _this.props.store.escapeSearch(activeOffsetKey);
        _this.closeDropdown();

        // to force a re-render of the outer component to change the aria props
        _this.props.store.setEditorState(_this.props.store.getEditorState());
      }),
      (_this.onMentionSelect = function (mention) {
        _this.closeDropdown();
        const newEditorState = (0, _addMention2.default)(
          _this.props.store.getEditorState(),
          mention,
          _this.props.entityMutability
        );
        _this.props.store.setEditorState(newEditorState);
      }),
      (_this.onMentionFocus = function (index) {
        const descendant = `mention-option-${_this.key}-${index}`;
        _this.props.ariaProps.ariaActiveDescendantID = descendant;
        _this.state.focusedOptionIndex = index;

        // to force a re-render of the outer component to change the aria props
        _this.props.store.setEditorState(_this.props.store.getEditorState());
      }),
      (_this.commitSelection = function () {
        _this.onMentionSelect(_this.props.suggestions.get(_this.state.focusedOptionIndex));
        return true;
      }),
      (_this.openDropdown = function () {
        // This is a really nasty way of attaching & releasing the key related functions.
        // It assumes that the keyFunctions object will not loose its reference and
        // by this we can replace inner parameters spread over different modules.
        // This better be some registering & unregistering logic. PRs are welcome :)
        _this.props.callbacks.onDownArrow = _this.onDownArrow;
        _this.props.callbacks.onUpArrow = _this.onUpArrow;
        _this.props.callbacks.onEscape = _this.onEscape;
        _this.props.callbacks.handleReturn = _this.onTab;
        _this.props.callbacks.onTab = _this.onTab;

        const descendant = `mention-option-${_this.key}-${_this.state.focusedOptionIndex}`;
        _this.props.ariaProps.ariaActiveDescendantID = descendant;
        _this.props.ariaProps.ariaOwneeID = `mentions-list-${_this.key}`;
        _this.props.ariaProps.ariaHasPopup = 'true';
        _this.props.ariaProps.ariaExpanded = 'true';
        _this.setState({
          isActive: true,
        });

        if (_this.props.onOpen) {
          _this.props.onOpen();
        }
      }),
      (_this.closeDropdown = function () {
        // make sure none of these callbacks are triggered
        _this.props.callbacks.onDownArrow = undefined;
        _this.props.callbacks.onUpArrow = undefined;
        _this.props.callbacks.onTab = undefined;
        _this.props.callbacks.onEscape = undefined;
        _this.props.callbacks.handleReturn = undefined;
        _this.props.ariaProps.ariaHasPopup = 'false';
        _this.props.ariaProps.ariaExpanded = 'false';
        _this.props.ariaProps.ariaActiveDescendantID = undefined;
        _this.props.ariaProps.ariaOwneeID = undefined;
        _this.setState({
          isActive: false,
        });

        if (_this.props.onClose) {
          _this.props.onClose();
        }
      }),
      _temp)),
      _possibleConstructorReturn(_this, _ret)
    );
  }

  _createClass(MentionSuggestions, [
    {
      key: 'componentWillMount',
      value: function componentWillMount () {
        this.key = (0, _draftJs.genKey)();
        this.props.callbacks.onChange = this.onEditorStateChange;
      },
    },
    {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps (nextProps) {
        if (nextProps.suggestions.size === 0 && this.state.isActive) {
          this.closeDropdown();
        }
      },
    },
    {
      key: 'render',
      value: function render () {
        const _this2 = this;

        if (!this.state.isActive) {
          return _react2.default.createElement('noscript', null);
        }

        const _props$theme = this.props.theme;
        const theme = _props$theme === undefined ? {} : _props$theme;

        return _react2.default.createElement(
          'div',
          _extends({}, this.props, {
            className: theme.mentionSuggestions,
            role: 'listbox',
            id: `mentions-list-${this.key}`,
            ref: 'popover',
          }),
          this.props.suggestions
            .map((mention, index) =>
              _react2.default.createElement(_Entry2.default, {
                key: mention.get('name'),
                onMentionSelect: _this2.onMentionSelect,
                onMentionFocus: _this2.onMentionFocus,
                isFocused: _this2.state.focusedOptionIndex === index,
                mention,
                index,
                id: `mention-option-${_this2.key}-${index}`,
                theme,
              }))
            .toJS()
        );
      },
    },
  ]);

  return MentionSuggestions;
}(_react.Component));

MentionSuggestions.propTypes = {
  entityMutability: _PropTypes.oneOf(['SEGMENTED', 'IMMUTABLE', 'MUTABLE']),
};
exports.default = MentionSuggestions;
