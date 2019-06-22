import React, { Component } from 'react';
import { Map } from 'immutable';

import { DefaultDraftBlockRenderMap } from 'draft-js';

import { Link, Image } from './components.js';

// Custom block wrapper/element
const blockRenderMap = Map({
  image: {
    element: 'figure',
  },
  'code-block': {
    element: 'code',
    wrapper: <pre className="draftJSCustomBlock__codeblock" />,
  },
});

// Merge with the default blocks (for not replacing them)
const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

// Custom block rendering
const blockRendererFn = (contentBlock) => {
  switch (contentBlock.getType()) {
    case 'image': {
      return {
        component: Image,
        editable: false,
        // props: {}
      };
    }
  }
};

module.exports = {
  blockRenderMap: extendedBlockRenderMap,
  blockRendererFn,
};
