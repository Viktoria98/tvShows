import _ from 'lodash';

import { getEntityRanges, convertToCharMeta, encodeContent } from '../helper.js';

// const globalLines = {
//   link: /\[([^\]][\s\S]*)\]\(([^\)][\s\S]*)\)/,
//   bold: /(?:__|\*\*)([\s\S]+?)(?:__|\*\*)(?!_\*)/,
//   em: /\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
//   code: /(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
// };

const toMarkdown = class {
  constructor (data) {
    this.data = data.renderData;
    this.fullData = data;
    this.blocks = [];
    this.content = '';
  }

  init () {
    const { blocks, entities } = this.fullData.parserData;
    const blocksEx = this.splitBlocks(blocks);
    this.processBlocks(blocksEx, entities);
    return this.content;
  }

  // eslint-disable-next-line class-methods-use-this
  splitBlocks (blocks) {
    let blocksCopy = blocks;
    const loop = (type, blocksEx, t) => {
      const blocksExTemp = blocksEx;
      if (blocksExTemp[t + 1] && blocksExTemp[t + 1].type === type) {
        const cutedBlock = blocksExTemp.splice(t + 1, 1)[0];
        blocksExTemp[t] = {
          ...blocksExTemp[t],
          text: `${blocksExTemp[t].text}\n${cutedBlock.text.trim()}`,
        };
        return loop(type, blocksExTemp, t);
      }
      return blocksExTemp;
    };
    const listLoop = (type, blocksEx, t, num) => {
      const blocksExTemp = blocksEx;
      blocksExTemp[t] = {
        ...blocksExTemp[t],
        text:
          type === 'unordered-list-item' ? `${blocksExTemp[t].text}` : `${blocksExTemp[t].text}`,
        depth: num,
      };
      if (blocksExTemp[t + 1] && blocksExTemp[t + 1].type === type) {
        return listLoop(type, blocksExTemp, t + 1, num + 1);
      }
      return {
        blocks: blocksExTemp,
        i: t,
      };
    };
    let listLoopOutput = {};

    for (let i = 0; i < blocksCopy.length; i += 1) {
      switch (blocksCopy[i].type) {
        case 'code-block':
          blocksCopy = loop(blocksCopy[i].type, blocksCopy, i);
          break;
        case 'unordered-list-item':
        case 'ordered-list-item':
          listLoopOutput = listLoop(blocksCopy[i].type, blocksCopy, i, 1);
          blocksCopy = listLoopOutput.blocks;
          ({ i } = listLoopOutput);
          break;
        default:
          break;
      }
    }

    return blocksCopy;
  }

  processBlocks (blocks, entities) {
    blocks.forEach((block) => {
      if (block.type !== 'space') {
        this.blocks.push(this.processLine(block, entities));
      }
    });
    this.content = this.blocks.join('\n\n');
  }

  processLine (block) {
    let output;
    switch (block.type) {
      case 'paragraph': {
        const { styles, entities } = block.characterMetadata;
        const outputEnt = convertToCharMeta(block.text || '', styles, entities);
        const entityPieces = getEntityRanges(block.text, outputEnt);
        output = this.processText(entityPieces);
        break;
      }
      case 'heading': {
        let depth = '';
        for (let i = 0; i < block.depth; i += 1) {
          depth += '#';
        }
        output = `${depth} ${block.text}`;
        break;
      }
      case 'blockquote': {
        output = `> ${block.text}`;
        break;
      }
      case 'code-block': {
        output = `\`\`\`${block.data.lang}\n${block.text}\n\`\`\``;
        break;
      }
      case 'unordered-list-item': {
        output = `* ${block.text}`;
        break;
      }
      case 'ordered-list-item': {
        output = `${block.depth}. ${block.text}`;
        break;
      }
      case 'image': {
        output = `![${block.data.commonUrl}](${block.data.thumbUrl})`;
        break;
      }
      default: {
        output = block.text;
        break;
      }
    }

    return output;
  }

  processText (entityPieces) {
    return entityPieces
      .map(([entityKey, stylePieces]) => {
        const resultContent = stylePieces
          .map(([text, style]) => {
            if (!text) {
              return '';
            }
            let content = encodeContent(text);
            if (style.indexOf('BOLD') >= 0) {
              content = `**${content}**`;
            }
            if (style.indexOf('ITALIC') >= 0) {
              content = `_${content}_`;
            }
            if (style.indexOf('STRIKETHROUGH') >= 0) {
              content = `~~${content}~~`;
            }
            if (style.indexOf('CODE') >= 0) {
              content = `\`${content}\``;
            }
            return content;
          })
          .join('');

        const entity = entityKey ? this.fullData.parserData.entities[entityKey] : null;
        switch (_.get(entity, 'type', null)) {
          case 'LINK':
            return `[${entity.data.alt}](${entity.data.href})`;
          case 'mention':
            return `@${entity.data.mention.get('name')}`;
          default:
            break;
        }

        return resultContent;
      })
      .join('');
  }
};

module.exports = function () {
  this.renderData = {
    blocks: [],
  };

  const output = new toMarkdown(this) // eslint-disable-line new-cap
    .init();

  // console.log('_toMarkdown', {output});
  return output;
};
