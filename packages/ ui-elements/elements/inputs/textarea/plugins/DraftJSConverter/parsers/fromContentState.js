import _ from 'lodash';

import { exportFunc } from '../helper.js';

const fromContentState = class {
  constructor (data) {
    this.data = data.parserData;
    this.fullData = data;
    this.entities = {};
  }

  init (contentState) {
    this.parseBlocks(contentState);
  }

  parseBlocks (content) {
    const blocks = content.getBlockMap();
    blocks.forEach((block) => {
      const { type, depth } = this.parseBlockType(block);
      const characterList = block.getCharacterList();
      const { styles, entities } = this.parseCharacterMetadata(characterList, content);
      this.data.blocks.push({
        type,
        text: block.getText(),
        data: block.getData()
          .toJS(),
        depth: depth || 0,
        characterMetadata: {
          styles,
          entities,
        },
      });
    });
    this.data.entities = this.entities;
  }

  parseBlockType (block) {
    switch (block.getType()) {
      case 'header-one':
      case 'header-two':
      case 'header-three':
      case 'header-four':
      case 'header-five':
      case 'header-six':
        const depth = [undefined, 'one', 'two', 'three', 'four', 'five', 'six'];
        return {
          type: 'heading',
          depth: depth.indexOf(block.getType()
            .split('-')[1]) || 0,
        };
      case 'image':
      case 'blockquote':
      case 'code-block':
      case 'unordered-list-item':
      case 'ordered-list-item':
        return { type: block.getType() };
      default:
      case 'unstyled':
        return { type: block.getText().length >= 1 ? 'paragraph' : 'space' };
    }
  }

  parseCharacterMetadata (characterList, contentState) {
    const styles = [];
    const entities = [];
    let inc = 0;
    let currEntity;

    characterList.forEach((item) => {
      if (item.get('style').size) {
        styles[inc] = item.get('style')
          .toJS();
      }
      if (item.get('entity')) {
        const currEntity = item.get('entity');
        entities[inc] = currEntity;
        if (Object.keys(this.entities)
          .indexOf(currEntity) < 0) {
          this.entities[currEntity] = contentState.getEntity(currEntity)
            .toJS();
        }
      }

      inc++;
    });

    return {
      styles,
      entities,
    };
  }
};

module.exports = function (contentState) {
  this.parserData = {
    blocks: [],
    entities: {},
  };

  new fromContentState(this)
    .init(contentState);

  // console.log('_fromContentState', Object.assign({}, this), contentState);
  return exportFunc(this._renders, this);
};
