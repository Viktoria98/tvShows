import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Tags = (props) => {
  // tag can be customizible, i.e. has different bg, color, borderColor, etc ...
  const getCustomizedTagProps = (item) => props.options.find((option) => item === option.value);

  const renderTags = () => {
    const { tags } = props;

    // tag can be single and passed as simple string
    if (typeof tags === 'string') {
      const customizedTag = getCustomizedTagProps(tags) || {};
      return <span className={`tag ${customizedTag.className}`}>{customizedTag.text}</span>;

      // or it can be an array of tags
    } else if (Object.prototype.toString.call(tags) === '[object Array]') {
      return tags.map((tag, i) => (
        <span key={i} className="tag">
          {tag.value}
        </span>
      ));
    }
  };

  const content = renderTags();
  return <span className="tags-container">{content}</span>;
};

Tags.propTypes = {
  options: PropTypes.array,
  tags: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

Tags.defaultProps = {
  tags: [],
  options: [],
};

export default Tags;
