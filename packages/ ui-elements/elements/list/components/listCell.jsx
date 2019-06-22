import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

const ListCell = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    function buildText (string) {
      if (!config.additionalData) {
        return string;
      }

      const pathToAdditionalData = _.get(config, 'additionalData.path');
      const disableInGroups = _.get(config, 'additionalData.disableInGroups');

      if (!disableInGroups.includes(group.type) && !_.isEmpty(pathToAdditionalData)) {
        const wrapperAdditionalData = pathToAdditionalData.map((path, i) => (
          <span key={i} className="item__cell--additional-data">
            {_.get(itemData, path)}
          </span>
        ));
        return (
          <span>
            {string}
            {wrapperAdditionalData}
          </span>
        );
      }
      return string;
    }

    const {
      config, data, children, itemData, group,
    } = this.props;
    const style = {
      width: config.width,
      flexGrow: config.grow,
      textAlign: config.align,
    };

    const text = buildText(data);

    return (
      <div
        style={style}
        className={classNames(`item__cell ${config.name}`, {
          overflow: config.overflow,
        })}
      >
        {children || text}
      </div>
    );
  }
};

ListCell.propTypes = {};

export default ListCell;
