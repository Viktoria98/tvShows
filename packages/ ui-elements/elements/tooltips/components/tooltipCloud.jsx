import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TooltipCloud = class extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      align: '-up',
      cloudStyle: {
        visibility: 'hidden',
      },
    };
    this.maxCharactersLength = 200;

    this.checkCloudHeight = this.checkCloudHeight.bind(this);
  }

  checkCloudHeight () {
    setTimeout(() => {
      if (!this.cloud) {
        return false;
      }

      const cloudCoords = this.cloud.getBoundingClientRect();
      if (
        cloudCoords.top - (cloudCoords.bottom - cloudCoords.top) < 0 &&
        this.state.align !== '-down'
      ) {
        this.setState({ align: '-down' });
      }

      if (this.state.cloudStyle.visibility === 'hidden') {
        this.setState({ cloudStyle: { visibility: 'initial' } });
      }
    }, 50);
  }

  render () {
    const renderTooltipContent = () => {
      const { coords, content } = this.props;

      const textContent =
        content && content.length > this.maxCharactersLength
          ? `${content.slice(0, this.maxCharactersLength)}...`
          : content;

      const cloudContent = (
        <div
          className={classNames('cell-tooltip__cloud', this.state.align)}
          style={this.state.cloudStyle}
          ref={(cloud) => (this.cloud = cloud)}
        >
          {textContent}
        </div>
      );
      if (cloudContent) {
        this.checkCloudHeight();
      }
      return cloudContent;
    };

    const content = renderTooltipContent();
    return (
      <div style={this.props.coords} className="cell-tooltip__wrap">
        {content}
      </div>
    );
  }
};

TooltipCloud.propTypes = {
  coords: PropTypes.object,
  content: PropTypes.string,
};

export default TooltipCloud;
