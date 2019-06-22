import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PanelBase from '../panelBase.jsx';

const DetailsPanelScrollableTemplate = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showDetails: false,
    };

    this.timeoutID = null;
    this.currentCommentsCount = props.data._comments ? props.data._comments.length : 0;

    this.onScroll = this.onScroll.bind(this);
    this.debouncedScroll = this.debouncedScroll.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  componentDidUpdate (prevProps) {
    const comments = prevProps.data._comments;
    if (comments && comments.length && comments.length !== this.currentCommentsCount) {
      this.scrollToBottom();
      this.currentCommentsCount = comments.length;
    }
  }

  onScroll (target) {
    const { showDetails } = this.state;
    const contentHeight = target.clientHeight / 2;

    if (target.scrollTop > contentHeight && !showDetails) {
      this.setState({ showDetails: true });
    } else if (target.scrollTop < contentHeight && showDetails) {
      this.setState({ showDetails: false });
    }
  }

  debouncedScroll (event) {
    event.persist();
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => {
      this.onScroll(event.target);
    }, 20);
  }

  scrollToTop () {
    this.scrollContainer.scrollTop = 0;
  }

  scrollToBottom () {
    this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
  }

  render () {
    const {
      className, open, closePanel, content,
    } = this.props;
    const { showDetails } = this.state;
    const showBtnEl = (
      <div className="scrollable__show-btn" onClick={this.scrollToTop}>
        Show details
      </div>
    );
    const shouldRendeShowBtn = showDetails ? showBtnEl : null;
    return (
      <PanelBase type="scrollable" open={open} className={className} closePanel={closePanel}>
        <div className="scrollable__top-container">
          {content.topContainer}
          {shouldRendeShowBtn}
        </div>
        <div
          className="scrollable__scroll-container --helpers-custom-scrollbar"
          onScroll={this.debouncedScroll}
          ref={(scrollContainer) => (this.scrollContainer = scrollContainer)}
        >
          <div className="scrollable__scroll-content">{content.scrollContainer}</div>
        </div>
        <div className="scrollable__bottom-container">{content.bottomContainer}</div>
      </PanelBase>
    );
  }
};

DetailsPanelScrollableTemplate.propTypes = {
  content: PropTypes.object,
  additionalProps: PropTypes.object,
  allLabels: PropTypes.array,
  callbacks: PropTypes.object,
  className: PropTypes.string,
  closePanel: PropTypes.func,
  data: PropTypes.object,
  open: PropTypes.bool,
};
DetailsPanelScrollableTemplate.defaultProps = {
  content: {},
};

export default DetailsPanelScrollableTemplate;
