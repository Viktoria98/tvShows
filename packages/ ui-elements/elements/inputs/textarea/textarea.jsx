import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { List, OrderedMap, fromJS } from 'immutable';

import { calculateUploading } from '../../../helpers/general.js';

import SimpleProgressBar from '../../progress/simpleProgressBar';
import TextareaDropzone from './textareaDropzone.jsx';
import Editor from 'draft-js-plugins-editor';
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';

// draft-js
import {
  CompositeDecorator,
  SelectionState,
  Modifier,
  ContentBlock,
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
  convertFromRaw,
  genKey,
} from 'draft-js';

// Draft.JS settings
import {
  DraftJSConverter,
  DraftJSImage,
  markdownShortcutsPlugin,
  hotKeyFixPlugin,
  imagePlugin,
  linkifyPlugin,
  inlineToolbarPlugin,
  sideToolbarPlugin,
  createMentionPlugin,
  defaultSuggestionsFilter,
  decorators,
} from './settings.js';

// css
import 'draft-js/dist/Draft.css';
import 'draft-js-linkify-plugin/lib/plugin.css';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import 'draft-js-side-toolbar-plugin/lib/plugin.css';
import './textarea.styl';

// Custom CSS for inline styling
const customStyleMap = {
  CODE: {
    padding: '2px 4px',
    borderRadius: 3,
    backgroundColor: '#fcefed',
    color: '#c0341d',
  },
};

// Custom block rendering
import { blockRenderMap, blockRendererFn } from './blocks.js';

const Textarea = class extends Component {
  constructor (props) {
    super(props);

    let editorState;
    if (props.content) {
      editorState = EditorState.createWithContent(this.getContentState(props.content));
    } else {
      editorState = EditorState.createEmpty();
    }

    this.mentions = _.isEmpty(props.mentions) ? null : fromJS(props.mentions);
    this.state = {
      editorState,
      sideToolbarStyle: {
        absolute: {},
        relative: {},
      },
      suggestions: this.mentions,
      saveOnEnter: props.saveOnEnter || false,
      loadingPercent: null,
    };

    this.focus = () => this.editor.focus();

    this.componentDidMount = this.componentDidMount.bind(this);
    this.getContentState = this.getContentState.bind(this);
    this.onChange = this.onChange.bind(this);
    this.saveValue = this.saveValue.bind(this);
    this.revertChanges = this.revertChanges.bind(this);
    this.keyBindingFn = this.keyBindingFn.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.insertFragment = this.insertFragment.bind(this);
    this.insertBlock = this.insertBlock.bind(this);
    this.handlePastedText = this.handlePastedText.bind(this);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handleFilePaste = this.handleFilePaste.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (typeof nextProps.content !== 'undefined' && this.props.content !== nextProps.content) {
      this.setState({
        editorState: EditorState.createWithContent(this.getContentState(nextProps.content || '')),
      });
    }
    return nextProps;
  }

  componentDidMount () {
    if (this.props.focus) {
      setTimeout(() => {
        this.focus();
      }, 50);
    }
    if (this.editor) {
      ReactDOM.findDOMNode(this.editor)
        .addEventListener('paste', this.handleFilePaste);
    }
  }

  componentWillMount () {
    this.mentionPlugin = createMentionPlugin();
  }

  componentWillUnmount () {
    document.removeEventListener('paste', this.handleFilePaste);
  }

  getContentState (content) {
    const { markdown, convertOptions } = this.props;
    if (markdown) {
      return DraftJSConverter.fromMarkdown(content)
        .toContentState(convertOptions);
    }
    return ContentState.createFromText(content);
  }

  onChange (editorState) {
    this.setState({
      editorState,
    });

    // This construction need to calculate position of side toolbur button
    // Because default calculation algorithm doesn't work properly with textarea component
    if (!this.props.showToolbar) {
      return;
    }
    const selection = editorState.getSelection();
    if (!selection.getHasFocus()) {
      this.setState({
        sideToolbarStyle: {
          absolute: {},
          relative: {},
        },
      });
    } else {
      const currentContent = editorState.getCurrentContent();
      const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
      const offsetKey = DraftOffsetKey.encode(currentBlock.getKey(), 0, 0);
      setTimeout(() => {
        const textarea = ReactDOM.findDOMNode(this.editor);
        const node = Array.from(document.querySelectorAll(`[data-offset-key="${offsetKey}"]`))
          .slice(-1)[0];
        const textareaInfo = textarea.getBoundingClientRect();
        const nodeInfo = node.getBoundingClientRect();
        const relativeTop = -(textareaInfo.height - (nodeInfo.top - textareaInfo.top)) - 10;
        const centerOffset = nodeInfo.height < 36 ? 0 : (nodeInfo.height - 36) / 2;
        this.setState({
          sideToolbarStyle: {
            absolute: {
              left: -40,
              transform: 'scale(1)',
            },
            relative: {
              top: relativeTop + centerOffset,
            },
          },
        });
      }, 0);
    }
  }

  saveValue () {
    const { editorState } = this.state;
    const {
      content,
      data,
      blurOnEnter,
      markdown,
      convertOptions,
      multiedit,
      validationRegExp,
      validationErrMessage,
    } = this.props;
    const contentState = editorState.getCurrentContent();
    let value;

    if (contentState.hasText()) {
      if (markdown) {
        value = DraftJSConverter.fromContentState(contentState)
          .toMarkdown(convertOptions);
      } else {
        value = DraftJSConverter.fromContentState(contentState)
          .toRaw(convertOptions);
      }
    }

    value = value || '';

    if (validationRegExp && validationErrMessage && !validationRegExp.test(value)) {
      dispatch({
        type: 'UPDATE_NOTIFICATION',
        message: validationErrMessage,
        class: '-alert',
      });
      setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 3000);
      return { err: validationErrMessage };
    }

    if (content !== value) {
      this.props.cb(value, multiedit, data);
      if (blurOnEnter) {
        this.editor.blur();
      }
    }

    return value || content;
  }

  revertChanges () {
    this.setState({
      editorState: EditorState.push(
        this.state.editorState,
        this.getContentState(this.props.content)
      ),
    });
  }

  keyBindingFn (event) {
    const { keyCode } = event;
    const keyCodes = {
      ENTER: 13,
    };
    if (keyCode === keyCodes.ENTER && this.props.cb && !event.shiftKey && !event.ctrlKey) {
      return 'handleEnter';
    }
  }

  handleKeyCommand (command) {
    switch (command) {
      case 'handleEnter':
        if (this.state.saveOnEnter) {
          this.saveValue();
        }
        return 'handled';
      default:
        return 'not-handled';
    }
  }

  insertFragment (fragment = '') {
    const { editorState } = this.state;
    const { type } = this.props;
    if (type === 'number' && !/^[0-9.]/.test(fragment)) {
      fragment = '';
    }

    const blockMap = this.getContentState(fragment).blockMap;
    const newState = Modifier.replaceWithFragment(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      blockMap
    );
    this.onChange(EditorState.push(editorState, newState, 'insert-fragment'));
    return true;
  }

  insertBlock (direction, editorState, selection, contentState, currentBlock, newBlock) {
    const blockMap = contentState.getBlockMap();
    // Split the blocks
    const blocksBefore = blockMap.toSeq()
      .takeUntil((item) => item === currentBlock);
    const blocksAfter = blockMap
      .toSeq()
      .skipUntil((item) => item === currentBlock)
      .rest();
    const newBlocks =
      direction === 'before'
        ? [[newBlock.getKey(), newBlock], [currentBlock.getKey(), currentBlock]]
        : [[currentBlock.getKey(), currentBlock], [newBlock.getKey(), newBlock]];
    const newBlockMap = blocksBefore.concat(newBlocks, blocksAfter)
      .toOrderedMap();
    const newContentState = contentState.merge({
      blockMap: newBlockMap,
      selectionBefore: selection,
      selectionAfter: selection,
    });
    this.onChange(EditorState.push(editorState, newContentState, 'insert-fragment'));
    return true;
  }

  handlePastedText (text) {
    if (text) {
      this.insertFragment(text.trim());
    }
    return 'handled';
  }

  handleFileDrop (acceptedFiles) {
    if (_.isEmpty(acceptedFiles)) {
      return false;
    }

    const size =
      acceptedFiles.length > 1
        ? acceptedFiles.reduce((prev, curr) => prev.size + curr.size)
        : acceptedFiles[0].size;
    const { startCalculate, stopCalculate } = calculateUploading(size, (progress) => {
      this.setState({
        loadingPercent: progress,
      });
    });

    acceptedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (...rest) => {
        Meteor.callPromise('FilesAction.upload', {
          name: file.name,
          size: file.size,
          type: file.type,
          data: reader.result,
        })
          .then((res) => {
            if (index === acceptedFiles.length - 1) {
              stopCalculate(true);
            }

            if (['image/png', 'image/jpeg', 'image/gif'].indexOf(file.type) >= 0) {
              const currentBlockKey = this.state.editorState.getSelection()
                .getAnchorKey();
              const blocks = DraftJSImage.convertToBlocks(
                res.commonUrl,
                res.thumbUrl || res.commonUrl
              );
              let currentBlock = this.state.editorState
                .getCurrentContent()
                .getBlockMap()
                .get(currentBlockKey);
              blocks.getBlockMap()
                .forEach((block) => {
                  this.insertBlock(
                    'after',
                    this.state.editorState,
                    this.state.editorState.getSelection(),
                    this.state.editorState.getCurrentContent(),
                    currentBlock,
                    block
                  );
                  currentBlock = block;
                });
            } else if (this.props.markdown) {
              this.insertFragment(`File: [${file.name}](${res.commonUrl})`);
            } else {
              this.insertFragment(`File: ${res.commonUrl}`);
            }
          });
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onloadstart = () => {
        if (index === 0) {
          startCalculate();
        }
      };

      reader.readAsBinaryString(file);
    });
  }

  handleFilePaste (event) {
    const data = event.clipboardData || event.originalEvent.clipboardData;
    const list = [];
    for (let i = 0; i < data.files.length; i++) {
      list.push(data.files[i]);
    }
    this.handleFileDrop(list);
  }

  onSearchChange ({ value }) {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, this.mentions),
    });
  }

  render () {
    const { loadingPercent } = this.state;
    const {
      placeholder, uploading, markdown, showToolbar, convertOptions,
    } = this.props;
    let plugins = [imagePlugin];
    let inlineToolbarEx = '';
    const sideToolbarEx = '';
    let loadingPercentEx = '';

    if (!convertOptions.noClickableLinks) {
      plugins.push(linkifyPlugin);
    }

    let mentionSuggestions;
    if (this.mentionPlugin && this.mentions) {
      const { MentionSuggestions } = this.mentionPlugin;
      plugins.push(this.mentionPlugin);
      mentionSuggestions = (
        <MentionSuggestions
          suggestions={this.state.suggestions}
          onSearchChange={this.onSearchChange}
          onOpen={() => {
            this.setState({ saveOnEnter: false });
          }}
          onClose={() => {
            this.setState({ saveOnEnter: this.props.saveOnEnter });
          }}
        />
      );
    }

    if (markdown) {
      plugins = plugins.concat([hotKeyFixPlugin, markdownShortcutsPlugin]);
      if (showToolbar) {
        const { InlineToolbar } = inlineToolbarPlugin;
        // Remove sidebar plugin to debug error on prod
        // const { SideToolbar } = sideToolbarPlugin;
        // plugins = plugins.concat([inlineToolbarPlugin, sideToolbarPlugin]);
        plugins = plugins.concat([inlineToolbarPlugin]);
        inlineToolbarEx = <InlineToolbar />;
        // sideToolbarEx = (
        //   <div className="draftJsToolbar_position-absolute" style={this.state.sideToolbarStyle.absolute}>
        //     <div className="draftJsToolbar_position-relative" style={this.state.sideToolbarStyle.relative}>
        //       <SideToolbar/>
        //     </div>
        //   </div>
        // );
      }
    }

    if (loadingPercent) {
      loadingPercentEx = (
        <div className="Draft-centerPos-text" style={{ display: 'block' }}>
          <SimpleProgressBar className="Draft-centerPos-progressChild" progress={loadingPercent} />
        </div>
      );
    }

    return (
      <div className="textarea" onClick={this.focus}>
        <TextareaDropzone isUpload={uploading} onDrop={this.handleFileDrop}>
          {loadingPercentEx}
          <Editor
            plugins={plugins}
            decorators={decorators}
            editorState={this.state.editorState}
            customStyleMap={customStyleMap}
            blockRenderMap={blockRenderMap}
            blockRendererFn={blockRendererFn}
            readOnly={this.props.readOnly}
            customStyleFn={this.customStyleFn}
            onChange={this.onChange}
            placeholder={placeholder || ''}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.keyBindingFn}
            onEscape={this.revertChanges}
            ref={(editor) => {
              this.editor = editor;
            }}
            handlePastedText={this.handlePastedText}
            stripPastedStyles
          />
          {inlineToolbarEx}
          {/* {sideToolbarEx} */}
          {mentionSuggestions}
        </TextareaDropzone>
      </div>
    );
  }
};

Textarea.propTypes = {
  content: PropTypes.string,
  data: PropTypes.object,
  cb: PropTypes.func,
  focus: PropTypes.bool,
  saveOnEnter: PropTypes.bool,
  blurOnEnter: PropTypes.bool,
  uploading: PropTypes.bool,
  markdown: PropTypes.bool,
  showToolbar: PropTypes.bool,
  convertOptions: PropTypes.object,
  field: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
};

Textarea.defaultProps = {
  content: '',
  focus: false,
  uploading: true,
  markdown: false,
  multiedit: false,
  showToolbar: true,
  convertOptions: {},
};

export default Textarea;
