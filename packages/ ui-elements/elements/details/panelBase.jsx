import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './detailsPanel.styl';

const DetailsTemplateBase = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentWillMount () {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown (event) {
    const { closePanel } = this.props;
    switch (event.key) {
      case 'Escape':
        return closePanel();

      default:
    }
  }

  render () {
    const {
      type,
      className,
      // open,
      children,
      closePanel,
    } = this.props;
    return (
      <div
        className={classNames(
          'details-panel',
          type,
          className
          // { '-open': open }
        )}
      >
        <div className="details-panel__close-btn" onClick={closePanel} />
        {children}
      </div>
    );
  }
};

DetailsTemplateBase.propTypes = {
  children: PropTypes.array,
  className: PropTypes.string,
  open: PropTypes.bool,
  type: PropTypes.string,
  closePanel: PropTypes.func,
};

export default DetailsTemplateBase;
