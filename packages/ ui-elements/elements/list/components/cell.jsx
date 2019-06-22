import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ItemComponent = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const { config, data, children } = this.props;
    const style = {
      width: config.width,
      flexGrow: config.grow,
      textAlign: config.align,
    };

    return (
      <div
        style={style}
        className={classNames(`item__cell ${config.name}`, {
          overflow: config.overflow,
        })}
      >
        {children || data}
      </div>
    );
  }
};

ItemComponent.propTypes = {
  config: PropTypes.object,
  data: PropTypes.any,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default ItemComponent;
