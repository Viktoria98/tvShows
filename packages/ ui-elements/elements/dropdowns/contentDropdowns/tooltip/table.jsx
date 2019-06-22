import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Table = class extends Component {
  constructor (props) {
    super(props);
    this.transformToHTML = this.transformToHTML.bind(this);
  }

  transformToHTML (arr) {
    return arr.map((obj) => (
      <table key={Math.random()}>
        <caption>{obj.tableName}</caption>
        <tr>{obj.titles.map((title) => <th key={Math.random()}>{title}</th>)}</tr>
        {obj.rows.map((row) => (
          <tr key={Math.random()}>{row.map((cell) => <td key={Math.random()}>{cell}</td>)}</tr>
        ))}
      </table>
    ));
  }

  render () {
    return <div>{this.transformToHTML(this.props.data)}</div>;
  }
};

Table.propTypes = {
  data: PropTypes.array,
};

export default Table;
