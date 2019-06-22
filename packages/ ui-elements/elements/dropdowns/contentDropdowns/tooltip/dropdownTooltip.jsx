import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './dropdownTooltip.styl';

import DropdownBase from '../base/dropdownBase.jsx';
import Table from './table.jsx';
import List from './list.jsx';

const DropdownTooltip = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      dropdownHeight: 260,
    };
    this.renderElement = this.renderElement.bind(this);
    this.createMarkup = this.createMarkup.bind(this);
  }

  createMarkup (data) {
    // TODO: sanitize data
    return data;
  }

  renderElement (data) {
    if (!data || typeof data === 'string') {
      return <div dangerouslySetInnerHTML={this.createMarkup(data)} />;
    }

    switch (data.type) {
      case 'table':
        return <Table data={data.content} />;
      case 'list':
        return <List data={data.content} />;
      default:
        return <div>{JSON.stringify(data)}</div>;
    }
  }

  render () {
    console.log(this.props);
    return (
      <DropdownBase
        {...this.props}
        dropdownHeight={this.dropdownHeight}
        ref={(base) => (this.base = base)}
        className="dropdown-tooltip"
      >
        {this.renderElement(this.props.data)}
      </DropdownBase>
    );
  }
};

DropdownTooltip.propTypes = {
  width: PropTypes.number,
  right: PropTypes.string,
  content: PropTypes.string,
  cellClass: PropTypes.string,
  name: PropTypes.string,
  data: PropTypes.object,
};

export default DropdownTooltip;
