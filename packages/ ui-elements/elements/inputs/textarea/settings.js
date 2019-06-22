import React, { Component } from 'react';

// Additional components
import { Link, StrikethroughButton } from './components.js';

// External Draft.JS plugins
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
import createMentionPlugin, { defaultSuggestionsFilter } from './plugins/DefaultMention/index.js';
import createImagePlugin from 'draft-js-image-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin';

import './buttonStyles.css';
import './toolbarStyles.css';

import {
  ItalicButton,
  BoldButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from 'draft-js-buttons';

// Internal Draft.JS plugins
import DraftJSConverter from './plugins/DraftJSConverter/index.js';
import DraftJSImage from './plugins/DraftJSImage/index.js';
import createHotKeyFixPlugin from './plugins/HotKeyFix/index.js';

// Draft.JS decorators array
const decorators = [
  // Links
  {
    strategy: (contentBlock, callback, contentState) => {
      contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        let data = {};

        if (entityKey !== null) {
          data = contentState.getEntity(entityKey)
            .getData();
        }
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey)
            .getType() === 'LINK' &&
          !data.noVisual
        );
      }, callback);
    },
    component: (props) => {
      const { href, alt } = props.contentState.getEntity(props.entityKey)
        .getData();
      const url = href.indexOf('http') < 0 ? `http://${href}` : href;
      return <Link href={url} target="_blank" children={props.children} />;
    },
  },
];

module.exports = {
  DraftJSConverter,
  DraftJSImage,

  markdownShortcutsPlugin: createMarkdownShortcutsPlugin(),
  hotKeyFixPlugin: createHotKeyFixPlugin(),
  createMentionPlugin,
  defaultSuggestionsFilter,
  imagePlugin: createImagePlugin(),
  linkifyPlugin: createLinkifyPlugin({
    target: '_blank',
    component: (props) => {
      const { href, target, children } = props;
      return <Link href={href} target={target} children={children} />;
    },
  }),
  inlineToolbarPlugin: createInlineToolbarPlugin({
    structure: [
      BoldButton,
      ItalicButton,
      StrikethroughButton,
      CodeButton,
      HeadlineOneButton,
      HeadlineTwoButton,
      UnorderedListButton,
      OrderedListButton,
      BlockquoteButton,
      CodeBlockButton,
    ],
    theme: {
      toolbarStyles: {
        toolbar: 'inline-toolbar',
      },
      buttonStyles: {
        button: 'inline-toolbar-button',
        buttonWrapper: 'inline-toolbar-button-wrapper',
        active: 'inline-toolbar-button-active',
      },
    },
  }),
  sideToolbarPlugin: createSideToolbarPlugin(),

  decorators,
};
