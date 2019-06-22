import _ from 'lodash';

import { applyCharMeta, getWithNoFormatting, exportFunc } from '../helper.js';

const globalLines = {
  link: /\[([^\]][\s\S]*)\]\(([^\)][\s\S]*)\)/,
  bold: /__([\s\S]+?)__(?!_)|\*\*([\s\S]+?)\*\*(?!\*)/,
  italic: /\b_((?:__|[\s\S])+?)_\b|\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  scratched: /~~([\s\S]+?)~~(?!~)/,
  code: /(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
};
const lines = {
  link: /^\[([^\]][\s\S]*)\]\(([^\)][\s\S]*)\)/,
  bold: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  italic: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  scratched: /^~~([\s\S]+?)~~(?!~)/,
  code: /^`\s*([\s\S]*?[^`])\s*`(?!`)/,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/,
};

const blocks = {
  newline: /^\n+/,
  text: /^[^\n]+/,
  headline: /^ *(#{1,6}) *([^\n]+?) *(?:\n+|$)/,
  code: /^```([a-zA-Z]+)?([\S\s]+)```/,
  blockquote: /^( *>[^\n]+(\n[^\n]+)*)+/,
  list: /^(?: *(\* {1,}|[1-9]+\. {1,})([^\n]+))+/,
  image: /^!\[([\s\S]*?[^\]]?)\]\(([\s\S]*?[^\)]?)\)/,
  paragraph: /^((?:[^\n]+\n?)+)\n*/,
};

const fromMarkdown = class {
  constructor (data) {
    this.data = data.parserData;
    this.fullData = data;
    this.charList = {
      style: [],
      entity: [],
      _entityList: {},
    };
    this.inc = {
      offset: 0,
    };
  }

  init (markdown) {
    const content = markdown
      .replace(/\r\n|\r/g, '\n')
      .replace(/\t/g, '    ')
      .replace(/\u00a0/g, ' ')
      .replace(/\u2424/g, '\n');

    this.parseBlocks(content);
  }

  parseBlocks (content) {
    let cap;
    let text;

    while (content) {
      if ((cap = blocks.newline.exec(content))) {
        content = content.substring(cap[0].length);
        // if (cap[0].length > 1) {
        //   this.data.blocks.push({
        //     type: 'space',
        //   });
        // }
      }

      if ((cap = blocks.headline.exec(content))) {
        content = content.substring(cap[0].length);
        this.data.blocks.push({
          type: 'heading',
          text: cap[2],
          data: {},
          depth: cap[1].length,
        });
        continue;
      }

      if ((cap = blocks.code.exec(content))) {
        content = content.substring(cap[0].length);
        cap[2]
          .trim()
          .split(/\n/)
          .forEach((item) => {
            this.data.blocks.push({
              type: 'code-block',
              text: item.trim(),
              data: {
                lang: cap[1] || '',
              },
              depth: 0,
            });
          });
        continue;
      }

      if ((cap = blocks.blockquote.exec(content))) {
        content = content.substring(cap[0].length);
        this.data.blocks.push({
          type: 'blockquote',
          text: cap[1].replace(/^>( *)/, ''),
          depth: 0,
        });
        continue;
      }

      if ((cap = blocks.list.exec(content))) {
        content = content.substring(cap[0].length);
        this.data.blocks.push({
          type: /^ *\* */.test(cap[1]) ? 'unordered-list-item' : 'ordered-list-item',
          text: cap[2].trim(),
          depth: parseInt(cap[1]) || 0,
        });
        continue;
      }

      if ((cap = blocks.image.exec(content))) {
        content = content.substring(cap[0].length);
        this.data.blocks.push({
          type: 'image',
          data: {
            thumbUrl: cap[2], // src
            commonUrl: cap[1].search('http') >= 0 ? cap[1] : cap[2], // alt; For back compatibility, i.e. if alt (common) is a link then use it, otherwise use src (thumb) link.
          },
          depth: 0,
        });
        this.data.blocks.push({
          type: 'space',
        });
        continue;
      }

      if ((cap = blocks.paragraph.exec(content))) {
        content = content.substring(cap[0].length);
        text = this.parseLine(cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1]);
        this.data.blocks.push({
          type: 'paragraph',
          text: this.processText(text),
          data: {},
          depth: 0,
          characterMetadata: {
            styles: this.charList.style.slice(),
            entities: this.charList.entity.slice(),
          },
        });
        this.data.entities = this.charList._entityList;
        this.charList.style = [];
        this.charList.entity = [];
        this.inc.offset = 0;
        continue;
      }

      if ((cap = blocks.text.exec(content))) {
        content = content.substring(cap[0].length);
        this.data.blocks.push({
          type: 'text',
          depth: 0,
          text: cap[0],
        });
        continue;
      }

      if (content) {
        throw new Error(`Infinite loop on byte: ${content.charCodeAt(0)}`);
      }
    }

    return content;
  }

  parseLine (line = '') {
    const out = [];

    while (line) {
      if ((cap = lines.bold.exec(line))) {
        line = line.substring(cap[0].length);
        applyCharMeta(
          this.charList,
          this.inc.offset,
          getWithNoFormatting(cap[2] || cap[1], globalLines).length,
          'BOLD',
          null
        );
        out.push({
          type: 'bold',
          text: this.parseLine(cap[2] || cap[1]),
        });
        continue;
      }

      // italic
      if ((cap = lines.italic.exec(line))) {
        line = line.substring(cap[0].length);
        applyCharMeta(
          this.charList,
          this.inc.offset,
          getWithNoFormatting(cap[2] || cap[1], globalLines).length,
          'ITALIC',
          null
        );
        out.push({
          type: 'italic',
          text: this.parseLine(cap[2] || cap[1]),
        });
        continue;
      }

      // code
      if ((cap = lines.code.exec(line))) {
        line = line.substring(cap[0].length);
        applyCharMeta(
          this.charList,
          this.inc.offset,
          getWithNoFormatting(cap[1], globalLines).length,
          'CODE',
          null
        );
        this.inc.offset += cap[1].length;
        out.push({
          type: 'code',
          text: cap[1],
        });
        continue;
      }

      // link
      if ((cap = lines.link.exec(line))) {
        line = line.substring(cap[0].length);
        const { entity } = applyCharMeta(
          this.charList,
          this.inc.offset,
          getWithNoFormatting(cap[0], globalLines).length,
          null,
          {
            type: 'LINK',
            data: {
              href: cap[2],
              alt: cap[1],
            },
            mutability: 'MUTABLE',
          }
        );
        this.inc.offset += cap[0].length;
        out.push({
          _entity: entity,
          type: 'link',
          text: cap[1],
        });
        continue;
      }

      if ((cap = lines.text.exec(line))) {
        line = line.substring(cap[0].length);
        applyCharMeta(
          this.charList,
          this.inc.offset,
          getWithNoFormatting(cap[0], globalLines).length,
          null,
          null
        );
        this.inc.offset += cap[0].length;
        out.push({
          type: 'text',
          text: cap[0],
        });
        continue;
      }

      if (line) {
        throw new Error(`Infinite loop on byte: ${content.charCodeAt(0)}`);
      }
    }

    return out;
  }

  processText (text, styles = []) {
    const repeat = (inline, styles = []) => {
      if (typeof inline === 'object' && !Array.isArray(inline)) {
        styles.push(inline.type);
        return repeat(inline.text, styles);
      } else if (Array.isArray(inline)) {
        return inline
          .map((item) => {
            styles.push(inline.type);
            return repeat(item.text, styles);
          })
          .join('');
      }
      return inline || '';
    };
    return repeat(text);
  }
};

module.exports = function (markdown) {
  this.parserData = {
    blocks: [],
    entities: {},
  };

  new fromMarkdown(this)
    .init(markdown);

  // console.log('_fromMarkdown', Object.assign({}, this));
  return exportFunc(this._renders, this);
};
