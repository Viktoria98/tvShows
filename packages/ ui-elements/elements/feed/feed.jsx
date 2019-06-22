import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Comment from './feedItemComment.jsx';
import Log from './feedItemLog.jsx';
import FeedTextarea from './feedTextarea.jsx';

import './feed.styl';

const Feed = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this.scrollToBottom();
  }

  componentDidUpdate () {
    this.scrollToBottom();
  }

  scrollToBottom () {
    this.feedContainer.scrollTop = this.feedContainer.scrollHeight;
  }

  render () {
    const renderFeed = () => {
      const {
        updates,
        currentUserEmail,
        disableTextarea,
        disableCommentRemove,
        deleteComment,
      } = this.props;
      return updates.map((update, i) => {
        const itemProps = {
          key: i,
          data: update,
          user: update.user,
          currentUserEmail,
        };
        const commentProps = {
          disableTextarea,
          disableCommentRemove,
          deleteCb: deleteComment,
        };

        switch (update.type) {
          case 'comment':
            return <Comment {...itemProps} {...commentProps} />;
          case 'log':
            return <Log {...itemProps} />;
        }
      });
    };

    const renderTextarea = () => {
      const {
        disableTextarea, saveCb, data, textarea, mentions,
      } = this.props;
      if (!disableTextarea) {
        return <FeedTextarea data={data} cb={saveCb} mentions={mentions} {...textarea} />;
      }
    };

    const feed = renderFeed();
    const textarea = renderTextarea();

    return (
      <div className="feed">
        <div
          className="feed__container --helpers-custom-scrollbar-light"
          ref={(feedContainer) => (this.feedContainer = feedContainer)}
          style={this.props.style ? this.props.style : {}}
        >
          {feed}
        </div>
        {textarea}
      </div>
    );
  }
};

Feed.propTypes = {
  currentUserEmail: PropTypes.string,
  data: PropTypes.object,
  deleteComment: PropTypes.func,
  disableActions: PropTypes.bool,
  itemType: PropTypes.string,
  saveCb: PropTypes.func,
  style: PropTypes.object,
  textarea: PropTypes.object,
  updates: PropTypes.array,
};

Feed.defaultProps = {
  updates: [],
};

export default Feed;
