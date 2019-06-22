import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TagCreator from './tagCreator.jsx';

import './tagEditor.styl';

class TagEditor extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.addLabel = this.addLabel.bind(this);
    this.removeLabel = this.removeLabel.bind(this);
  }

  addLabel (value) {
    const {
      labels, addLabel, getLabels, data,
    } = this.props;
    value = value.trim();
    // return if user is trying to add label which already exists
    if (labels.find((label) => label.value === value)) {
      return;
    }
    addLabel(value, data);
    getLabels();
  }

  removeLabel (value, labelId) {
    const { data } = this.props;
    this.props.deleteLabel(value, labelId, data);
  }

  render () {
    const { getLabels, allLabels, labels } = this.props;

    const editableLabels = labels.map((label, key) => (
      <li className="tag tag--editable" key={key}>
        <span className="tag__text">{label.value || label}</span>
        <div
          className="tag__delete-btn"
          onClick={() => {
            this.removeLabel(label.value, label.id);
          }}
        />
      </li>
    ));

    return (
      <div className="tag-editor">
        <ul className="tag-editor__tags-list">{editableLabels}</ul>
        <div className="tag-editor__input-container">
          <TagCreator getLabels={getLabels} addLabel={this.addLabel} allLabels={allLabels} />
        </div>
      </div>
    );
  }
}

TagEditor.propTypes = {
  labels: PropTypes.array,
  allLabels: PropTypes.array,
  addLabel: PropTypes.func,
  getLabels: PropTypes.func,
  data: PropTypes.object,
  deleteLabel: PropTypes.func,
};

export default TagEditor;
