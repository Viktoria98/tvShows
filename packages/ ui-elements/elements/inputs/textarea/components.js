import React, { Component } from 'react';
import createInlineStyleButton from 'draft-js-buttons/lib/utils/createInlineStyleButton';
import PropTypes from 'prop-types';

export const Link = (props) => {
  const { href, target, children } = props;

  return (
    <a
      className="draftJSCustomEntity__link"
      href={href}
      target={target}
      rel="noopener"
      onClick={() => {
        window.open(href, '_blank');
      }}
      children={children}
    />
  );
};

Link.propTypes = {
  href: PropTypes.string,
  target: PropTypes.string,
  children: PropTypes.any, // how is it passed to 'a' tag?
};

export const Image = (props) => {
  const { block } = props;
  const { commonUrl, thumbUrl } = block.getData()
    .toObject();
  return (
    <a href={commonUrl} target="_blank" rel="noopener">
      <img className="draftJSCustomBlock__image" alt="Image" src={thumbUrl} />
    </a>
  );
};

export const StrikethroughButton = createInlineStyleButton({
  style: 'STRIKETHROUGH',
  children: 'S',
});

Image.propTypes = {
  block: PropTypes.object,
};
