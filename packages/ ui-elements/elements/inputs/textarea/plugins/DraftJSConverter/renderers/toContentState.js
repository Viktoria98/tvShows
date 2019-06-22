import { CharacterMetadata, ContentBlock, ContentState, genKey } from 'draft-js';
import { BLOCK_TYPE, ENTITY_TYPE, INLINE_STYLE } from 'draft-js-utils';
import { List, Map, OrderedSet, Repeat, Seq } from 'immutable';

const NO_STYLE = OrderedSet();
const NO_ENTITY = null;
const EMPTY_BLOCK = new ContentBlock({
  key: genKey(),
  text: '',
  type: BLOCK_TYPE.UNSTYLED,
  characterList: List(),
  depth: 0,
});

const toContentState = class {
  constructor (data) {
    this.data = data.renderData;
    this.fullData = data;
    this.entities = {};
    this.contentStateForEntities = ContentState.createFromBlockArray([]);
    this.inc = {
      image: 0,
    };
  }

  init (options) {
    this.options = options || {};

    this.fullData.parserData.blocks.forEach((block) => {
      block = this.processBlock(block);
      this.data.contentBlocks.push(new ContentBlock({
        key: genKey(), // Generate unic key for this block
        text: block.text, // Text that will be rednered
        type: block.type, // Block type
        characterList: block.characterMeta.toList(), // Charasters info
        depth: 0, // Only for list items and headers
        data: block.data ? Map(block.data) : Map(), // Additional custom information
      }));
    });

    if (!this.data.contentBlocks.length) {
      this.data.contentBlocks = [EMPTY_BLOCK];
    }

    return ContentState.createFromBlockArray(
      this.data.contentBlocks,
      this.contentStateForEntities.getEntityMap()
    );
  }

  createEntity (type, data, mutability = 'MUTABLE', oldId) {
    this.contentStateForEntities = this.contentStateForEntities.createEntity(
      type,
      mutability,
      data
    );
    const entityKey = this.contentStateForEntities.getLastCreatedEntityKey();
    this.entities[oldId || Object.keys(this.entities).length.toString()] = {
      _oldId: oldId,
      id: entityKey,
      type,
      data,
      mutability,
    };
    return entityKey;
  }

  processBlock (block) {
    const text = this.processText(block);
    const type = this.processBlockType(block);
    const charMetadata = this.processCharMetadata(block, text);

    if (this.options.noClickableLinks && block.type === 'LINK') {
      block.data.noVisual = true;
    }

    return {
      _rest: block,
      _type: block.type,
      text,
      type,
      characterMeta: text.length > 0 ? charMetadata : Seq(),
      data: block.data || {},
    };
  }

  processText (block, styles = []) {
    switch (block.type) {
      case 'image':
        return ' ';
      default:
        return block.text || '';
    }
  }

  processBlockType (block) {
    switch (block.type) {
      case 'heading':
        switch (block.depth) {
          default:
          case 1:
            return BLOCK_TYPE.HEADER_ONE;
          case 2:
            return BLOCK_TYPE.HEADER_TWO;
          case 3:
            return BLOCK_TYPE.HEADER_THREE;
          case 4:
            return BLOCK_TYPE.HEADER_FOUR;
          case 5:
            return BLOCK_TYPE.HEADER_FIVE;
          case 6:
            return BLOCK_TYPE.HEADER_SIX;
        }
        break;
      case 'image':
      case 'blockquote':
      case 'code-block':
      case 'unordered-list-item':
      case 'ordered-list-item':
        return block.type;
      default:
        return BLOCK_TYPE.UNSTYLED;
    }
  }

  processCharMetadata (block, text) {
    const entity = this.fullData.parserData.entities;
    let charMetadata = [];

    switch (block.type) {
      case 'paragraph': {
        for (let i = 0; i < text.length; i++) {
          if (
            block.characterMetadata.entities[i] &&
            !this.entities[block.characterMetadata.entities[i]]
          ) {
            const curEntity = entity[block.characterMetadata.entities[i]];
            this.createEntity(
              curEntity.type,
              curEntity.data,
              curEntity.mutability,
              block.characterMetadata.entities[i]
            );
          }

          charMetadata.push(CharacterMetadata.create({
            style: block.characterMetadata.styles[i]
              ? block.characterMetadata.styles[i]
              : NO_STYLE,
            entity: this.entities[block.characterMetadata.entities[i]]
              ? this.entities[block.characterMetadata.entities[i]].id
              : NO_ENTITY,
          }));
        }
        charMetadata = List(charMetadata);
        break;
      }
      default: {
        charMetadata = Repeat(
          CharacterMetadata.create({
            style: NO_STYLE,
            entity: NO_ENTITY,
          }),
          text.length
        );
        break;
      }
    }
    return charMetadata;
  }
};

module.exports = function (options) {
  this.renderData = {
    contentBlocks: [],
  };

  const output = new toContentState(this)
    .init(options);

  // console.log('_toContentState', Object.assign({}, this));
  return output;
};
