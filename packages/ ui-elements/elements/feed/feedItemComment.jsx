import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import RelativeTime from '../time/relativeTime.jsx';
import Avatars from '../avatars/avatars.jsx';
import DraftJSConverter from '../inputs/textarea/plugins/DraftJSConverter/index.js';

import '../inputs/textarea/plugins/DraftJSConverter/renderers/toHTML.styl';

const FeedItemComment = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.deleteComment = this.deleteComment.bind(this);
  }

  deleteComment () {
    const { deleteCb, data } = this.props;
    if (deleteCb) {
      deleteCb(data.id);
    }
  }

  render () {
    const {
      data,
      currentUserEmail,
      user,
      disableTextarea,
      disableCommentRemove,
      deleteCb,
    } = this.props;
    const userEmail = user ? user.email : '';
    const isCurrentUser = currentUserEmail === userEmail;
    const renderDeleteBtn = () => {
      const passedOneHour = Date.now() - data.created_at < 3600000;
      if (!disableCommentRemove && passedOneHour && isCurrentUser) {
        return <div className="comment__remove" onClick={this.deleteComment} />;
      }
    };
    const userName = _.get(user, 'name', 'No user');
    const userAvatar = _.get(user, 'avatar');
    const deleteButton = renderDeleteBtn();
    const createdAt = <RelativeTime value={data.created_at} timeDirection="from" />;
    const parseMarkdown = (text) => ({
      __html: DraftJSConverter.fromMarkdown(text)
        .toHTML(),
    });

    return (
      <div className={classNames('comment', { '-own': isCurrentUser })}>
        <Avatars className="comment__avatar" data={userName} avatar={userAvatar} size={30} />
        <div className="comment__content">
          <div className="comment__header">
            <b className="comment__author">{isCurrentUser ? 'You' : userName}</b>
            {deleteButton}
          </div>
          <div className="comment__text" dangerouslySetInnerHTML={parseMarkdown(data.comment)} />
          <span className="comment__date">{createdAt}</span>
        </div>
      </div>
    );
  }
};

FeedItemComment.propTypes = {
  allowCommentRemove: PropTypes.bool,
  deleteCb: PropTypes.func,
  data: PropTypes.object,
  currentUserEmail: PropTypes.string,
  user: PropTypes.object,
  disableActions: PropTypes.bool,
};

FeedItemComment.defaultProps = {
  user: {},
};

export default FeedItemComment;
