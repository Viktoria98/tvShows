Object.defineProperty(exports, '__esModule', {
  value: true,
});

const _draftJs = require('draft-js');

const _getSearchText2 = require('../utils/getSearchText');

const _getSearchText3 = _interopRequireDefault(_getSearchText2);

function _interopRequireDefault (obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const addMention = function addMention (editorState, mention, entityMutability) {
  const entityKey = _draftJs.Entity.create('mention', entityMutability, {
    mention,
  });

  const currentSelectionState = editorState.getSelection();

  const _getSearchText = (0, _getSearchText3.default)(editorState, currentSelectionState);

  const begin = _getSearchText.begin;
  const end = _getSearchText.end;

  // get selection of the @mention search text
  const mentionTextSelection = currentSelectionState.merge({
    anchorOffset: begin,
    focusOffset: end,
  });

  let mentionReplacedContent = _draftJs.Modifier.replaceText(
    editorState.getCurrentContent(),
    mentionTextSelection,
    mention.get('name'),
    null, // no inline style needed
    entityKey
  );

  // If the mention is inserted at the end, a space is appended right after for
  // a smooth writing experience.
  const blockKey = mentionTextSelection.getAnchorKey();
  const blockSize = editorState
    .getCurrentContent()
    .getBlockForKey(blockKey)
    .getLength();
  if (blockSize === end) {
    mentionReplacedContent = _draftJs.Modifier.insertText(
      mentionReplacedContent,
      mentionReplacedContent.getSelectionAfter(),
      ' '
    );
  }

  const newEditorState = _draftJs.EditorState.push(
    editorState,
    mentionReplacedContent,
    'insert-mention'
  );
  return _draftJs.EditorState.forceSelection(
    newEditorState,
    mentionReplacedContent.getSelectionAfter()
  );
};

exports.default = addMention;
