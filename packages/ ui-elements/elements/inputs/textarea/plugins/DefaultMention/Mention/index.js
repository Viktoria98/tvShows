import _react2 from 'react';
import _draftJs from 'draft-js';
import _immutable from 'immutable';

const Mention = function Mention (props) {
  const entityKey = props.entityKey;
  const _props$theme = props.theme;
  const theme = _props$theme === undefined ? {} : _props$theme;

  const mention = (0, _immutable.fromJS)(_draftJs.Entity.get(entityKey)
    .getData().mention);

  if (mention.has('link')) {
    return _react2.createElement(
      'a',
      {
        href: mention.get('link'),
        className: theme.mention,
        spellCheck: false,
      },
      props.mentionPrefix,
      props.children
    );
  }

  return _react2.createElement(
    'span',
    {
      className: theme.mention,
      spellCheck: false,
    },
    props.mentionPrefix,
    props.children
  );
};

export default Mention;
