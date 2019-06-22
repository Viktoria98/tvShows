import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import anchorme from 'anchorme';

import RelativeTime from '../time/relativeTime.jsx';
import Avatars from '../avatars/avatars.jsx';

const FeedItemLog = (props) => {
  const { data, user, currentUserEmail } = props;
  const userName = _.get(user, 'name', 'No user');
  const userAvatar = _.get(user, 'avatar');
  const userEmail = _.get(user, 'email', '');
  const isCurrentUser = currentUserEmail === userEmail;
  const createdAt = <RelativeTime value={data.created_at} timeDirection="from" />;

  const linkify = (text) => ({
    __html: anchorme(text, {
      attributes: [
        {
          name: 'target',
          value: '_blank',
        },
      ],
    }),
  });

  return (
    <div className="log">
      <Avatars className="log__avatar" data={userName} avatar={userAvatar} size={30} />
      <div className="log__content">
        <div className="log__header">
          <b className="log__author">{isCurrentUser ? 'You' : userName}</b>
        </div>
        <div className="log__text" dangerouslySetInnerHTML={linkify(data.updates)} />
        <span className="log__date">{createdAt}</span>
      </div>
    </div>
  );
};

FeedItemLog.propTypes = {
  data: PropTypes.object,
  user: PropTypes.object,
};

FeedItemLog.defaultProps = {
  user: {},
};

export default FeedItemLog;
