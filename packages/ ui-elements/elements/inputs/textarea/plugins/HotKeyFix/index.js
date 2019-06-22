import React from 'react';

import { Modifier, EditorState } from 'draft-js';

import handleNewCodeBlock from 'draft-js-markdown-shortcuts-plugin/lib/modifiers/handleNewCodeBlock';
import insertEmptyBlock from 'draft-js-markdown-shortcuts-plugin/lib/modifiers/insertEmptyBlock';
import leaveList from 'draft-js-markdown-shortcuts-plugin/lib/modifiers/leaveList';
import insertText from 'draft-js-markdown-shortcuts-plugin/lib/modifiers/insertText';
import changeCurrentBlockType from 'draft-js-markdown-shortcuts-plugin/lib/modifiers/changeCurrentBlockType';

const checkReturnForState = (editorState, ev) => {
  let newEditorState = editorState;
  let newContentState;
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const currentBlock = contentState.getBlockForKey(key);
  const type = currentBlock.getType();
  const text = currentBlock.getText();
  if (/-list-item$/.test(type) && text === '') {
    newEditorState = leaveList(editorState);
  }
  if (newEditorState === editorState) {
    if (ev.ctrlKey || ev.metaKey || ev.altKey) {
      newEditorState = insertEmptyBlock(editorState);
    } else if (ev.shiftKey && !/^```([\w-]+)?$/.test(text)) {
      newContentState = Modifier.splitBlock(contentState, selection);
      newEditorState = EditorState.push(editorState, newContentState, 'split-block');
    }
  }
  if (newEditorState === editorState && type !== 'code-block' && /^```([\w-]+)?$/.test(text)) {
    newEditorState = handleNewCodeBlock(editorState);
  }
  if (newEditorState === editorState && type === 'code-block') {
    if (/```\s*$/.test(text)) {
      newEditorState = changeCurrentBlockType(newEditorState, type, text.replace(/\n```\s*$/, ''));
      newEditorState = insertEmptyBlock(newEditorState);
    } else {
      newEditorState = insertText(editorState, '\n');
    }
  }

  return newEditorState;
};

const createMarkdownShortcutsPlugin = () => {
  const store = {};
  return {
    store,
    initialize () {},
    handleReturn (ev, editorState, { setEditorState }) {
      const newEditorState = checkReturnForState(editorState, ev);
      if (editorState !== newEditorState) {
        setEditorState(newEditorState);
        return 'handled';
      }
      return 'not-handled';
    },
  };
};

export default createMarkdownShortcutsPlugin;
