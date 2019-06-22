import React, { Component } from 'react';
import PropTypes from 'prop-types';

const List = class extends Component {
  constructor (props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.transformToHTML = this.transformToHTML.bind(this);
  }

  renderRow (title, content) {
    let className = 'dropdown-tooltip-content';

    switch (content) {
      case 'Yes':
        className += ' dropdown-tooltip-content-yes';
        break;
      case 'No':
        className += ' dropdown-tooltip-content-no';
        break;
      default:
        break;
    }

    const transformData = (data) => {
      if (data.indexOf('http://') === 0 || data.indexOf('https://') === 0) {
        return (
          <a href={data} target="_blank">
            {data}
          </a>
        );
      }

      return data;
    };

    return (
      <div key={Math.random()}>
        <div className="dropdown-tooltip-title">
          {typeof title === 'string' ? transformData(title) : title}
        </div>
        <div className={className}>
          {typeof content === 'string' ? transformData(content) : content}
        </div>
      </div>
    );
  }

  transformToHTML (obj) {
    return Object.keys(obj)
      .map((title) => {
        let content = obj[title];

        if (content && typeof content === 'object') {
          content = this.transformToHTML(content);
        }

        return this.renderRow(title, content);
      });
  }

  render () {
    return <div>{this.transformToHTML(this.props.data)}</div>;
  }
};

List.propTypes = {
  data: PropTypes.object,
};

export default List;
