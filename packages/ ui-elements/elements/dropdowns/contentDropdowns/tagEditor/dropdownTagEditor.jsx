import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import TagEditor from './tagEditor.jsx';
import DropdownBase from '../base/dropdownBase.jsx';

// TODO: make it stateless after refactoring
const DropdownTagEditor = class extends PureComponent {
  constructor (props) {
    super(props);
  }

  render () {
    const {
      dropdownWidth, // not used
      expandDirection, // not used
      btnTags,
      data,
      getLabels, // func
      addLabel, // func
      deleteLabel, // func
      allLabels, // array for autosuggest
      tooltipContentFunc,
    } = this.props;

    // create labels to display inside btn
    const labelsArray = btnTags.map((label, key) => (
      <span key={key} className="tag">
        {label.value}
      </span>
    ));

    const tooltipContent =
      typeof tooltipContentFunc === 'function' ? tooltipContentFunc(btnTags) : null;

    return (
      <DropdownBase
        {...this.props}
        labelsArray={labelsArray}
        btnComponent={labelsArray}
        className="dropdown-tag-editor"
        ref={(base) => (this.base = base)}
        tooltipContent={tooltipContent}
      >
        <TagEditor
          data={data}
          labels={btnTags}
          addLabel={addLabel}
          deleteLabel={deleteLabel}
          getLabels={getLabels}
          allLabels={allLabels}
        />
      </DropdownBase>
    );
  }
};

DropdownTagEditor.propTypes = {
  width: PropTypes.number,
  right: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.number,
    PropTypes.object,
  ]),
  name: PropTypes.string,
  getLabels: PropTypes.func,
  addLabel: PropTypes.func,
  deleteLabel: PropTypes.func,
  allLabels: PropTypes.array,
  btnTags: PropTypes.array,
  data: PropTypes.object,
};

DropdownTagEditor.defaultProps = {
  btnTags: [],
};

export default DropdownTagEditor;
