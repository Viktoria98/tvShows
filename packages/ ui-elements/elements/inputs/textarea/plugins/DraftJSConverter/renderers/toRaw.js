import _ from 'lodash';

import { getEntityRanges, convertToCharMeta, encodeContent } from '../helper.js';

const toRaw = class {
  constructor (data) {
    this.data = data.renderData;
    this.fullData = data;
    this.blocks = [];
    this.content = '';
  }

  init (options) {
    const { blocks, entities } = this.fullData.parserData;
    this.options = options || {};
    this.processBlocks(blocks, entities);
    return this.content;
  }

  processBlocks (blocks, entities) {
    blocks.forEach((block) => {
      if (block.type !== 'space') {
        this.blocks.push(this.processLine(block, entities));
      }
    });
    const emptyLineBetween = _.get(this.options, 'emptyLineBetween');
    this.content = this.blocks.join(emptyLineBetween ? '\n\n' : '\n');
  }

  processLine (block, entitiesEx) {
    let output;
    switch (block.type) {
      case 'paragraph': {
        const { styles, entities } = block.characterMetadata;
        const outputEnt = convertToCharMeta(block.text || '', styles, entities);
        const entityPieces = getEntityRanges(block.text, outputEnt);
        output = this.processText(entityPieces);
        break;
      }
      case 'image': {
        if (this.options.imagesToMarkdown) {
          output = `![${block.data.commonUrl}](${block.data.thumbUrl})`;
          break;
        }
      }
      default: {
        output = block.text;
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
            return text;
          })
          .join('');

        const entity = entityKey ? this.fullData.parserData.entities[entityKey] : null;
        switch (_.get(entity, 'type')) {
          case 'LINK':
            return entity.data.href;
          case 'mention':
            return `@${entity.data.mention.get('name')}`;
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

  // console.log('_toRaw', this);
  return new toRaw(this)
    .init(options);
};
