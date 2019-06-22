import _ from 'lodash';

import { getEntityRanges, convertToCharMeta, encodeContent } from '../helper.js';

const globalLines = {
  link: /\[([^\]][\s\S]*)\]\(([^\)][\s\S]*)\)/,
  bold: /(?:__|\*\*)([\s\S]+?)(?:__|\*\*)(?!_\*)/,
  em: /\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
};

const toHTML = class {
  constructor (data) {
    this.data = data.renderData;
    this.fullData = data;
    this.blocks = [];
    this.content = '';
  }

  init () {
    const { blocks, entities } = this.fullData.parserData;
    this.processBlocks(blocks, entities);
    return this.content;
  }

  processBlocks (blocks, entities) {
    blocks.forEach((block) => {
      if (block.type !== 'space') {
        this.blocks.push(this.processLine(block, entities));
      }
    });
    this.content = this.blocks.join('\n');
  }

  processLine (block, entitiesEx) {
    let output;
    switch (block.type) {
      case 'paragraph': {
        const { styles, entities } = block.characterMetadata;
        const outputEnt = convertToCharMeta(block.text || '', styles, entities);
        const entityPieces = getEntityRanges(block.text, outputEnt);
        output = `<p>${this.processText(entityPieces)}</p>`;
        break;
      }
      case 'heading': {
        output = `<h${block.depth}>${block.text}</h${block.depth}>`;
        break;
      }
      case 'code-block': {
        output = `<pre class="html-markup__codeblock"><code data-lang='${block.data.lang}'>${
          block.text
        }</code></pre>`;
        break;
      }
      case 'image': {
        output = `<figure class="html-markup__image">
          <a href="${block.data.commonUrl}" target="_blank">
            <img class="html-markup__image-tag" alt="Image" src="${block.data.thumbUrl}"/>
          </a>
        </figure>`;
        break;
      }
      default: {
        output = `<p>${block.text}</p>`;
        break;
      }
    }

    return output;
  }

  processText (entityPieces) {
    return entityPieces
      .map(([entityKey, stylePieces]) => {
        const content = stylePieces
          .map(([text, style]) => {
            if (!text) {
              return '';
            }
            let content = encodeContent(text);
            if (style.indexOf('BOLD') >= 0) {
              content = `<strong>${content}</strong>`;
            }
            if (style.indexOf('ITALIC') >= 0) {
              content = `<em>${content}</em>`;
            }
            if (style.indexOf('CODE') >= 0) {
              content = `<code class="html-markup__codeline">${content}</code>`;
            }
            return content;
          })
          .join('');

        const entity = entityKey ? this.fullData.parserData.entities[entityKey] : null;
        switch (_.get(entity, 'type')) {
          case 'LINK':
            return `<a class="html-markup__link" href="${entity.data.href}" target="_blank">${
              entity.data.alt
            }</a>`;
          case 'mention':
            return `<span class="html-markup__mention">@${entity.data.mention.get('name')}</span>`;
        }
        return content;
      })
      .join('');
  }
};

module.exports = function (options) {
  this.renderData = {
    blocks: [],
  };

  const output = new toHTML(this)
    .init();

  // console.log('_toHTML', {output});
  return output;
};
