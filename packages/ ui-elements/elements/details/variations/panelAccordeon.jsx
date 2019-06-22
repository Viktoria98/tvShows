// Template for list details panel
// has three containers, middle container is hidden by default, open it with click on btn

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PanelBase from '../panelBase.jsx';

const DetailsPanelAccordeonTemplate = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      expand: false,
    };
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  toggleExpand () {
    this.setState({
      expand: !this.state.expand,
    });
  }

  render () {
    const renderMoreBtn = () => {
      const btnText = this.state.expand ? 'Hide details' : 'Show details';
      return (
        <button className="accordeon__more-btn" onClick={this.toggleExpand}>
          {btnText}
        </button>
      );
    };

    const {
      open, content, className, closePanel,
    } = this.props;
    const { expand } = this.state;
    const moreBtn = renderMoreBtn();

    return (
      <PanelBase type="accordeon" open={open} className={className} closePanel={closePanel}>
        <div className="accordeon__top-container">
          {content.topContainer}
          {moreBtn}
        </div>
        <div
          className={classNames('accordeon__more-container', {
            '-expand': expand,
          })}
        >
          {content.moreContainer}
        </div>
        <div className="accordeon__bottom-container">{content.bottomContainer}</div>
      </PanelBase>
    );
  }
};
DetailsPanelAccordeonTemplate.propTypes = {};
DetailsPanelAccordeonTemplate.defaultProps = {
  content: {},
};

export default DetailsPanelAccordeonTemplate;
