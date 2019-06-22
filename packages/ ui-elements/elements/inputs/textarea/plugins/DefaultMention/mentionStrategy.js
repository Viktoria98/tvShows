Object.defineProperty(exports, '__esModule', {
  value: true,
});

const _draftJs = require('draft-js');

const findMention = function findMention (character) {
  const entityKey = character.getEntity();
  return entityKey !== null && _draftJs.Entity.get(entityKey)
    .getType() === 'mention';
};

const findMentionEntities = function findMentionEntities (contentBlock, callback) {
  contentBlock.findEntityRanges(findMention, callback);
};

exports.default = findMentionEntities;
