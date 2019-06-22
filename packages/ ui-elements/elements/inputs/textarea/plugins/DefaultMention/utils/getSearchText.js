Object.defineProperty(exports, '__esModule', {
  value: true,
});

const _getWordAt = require('./getWordAt');

const _getWordAt2 = _interopRequireDefault(_getWordAt);

function _interopRequireDefault (obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const getSearchText = function getSearchText (editorState, selection) {
  const anchorKey = selection.getAnchorKey();
  const anchorOffset = selection.getAnchorOffset() - 1;
  const currentContent = editorState.getCurrentContent();
  const currentBlock = currentContent.getBlockForKey(anchorKey);
  const blockText = currentBlock.getText();
  return (0, _getWordAt2.default)(blockText, anchorOffset);
};

exports.default = getSearchText;
