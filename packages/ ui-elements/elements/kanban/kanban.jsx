import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import DndList from './dnd/dndList.jsx';
import Resizer from '../helperComponents/componentHeightResizer.jsx';

import './kanban.styl';

const Kanban = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.saveIndexes = this.saveIndexes.bind(this);
  }

  saveIndexes (args) {
    const { callbacks } = this.props;
    callbacks.saveIndexes(args);
  }

  render () {
    const renderLists = () => {
      const {
        data, localIndexes, callbacks, selected, helpers, target,
      } = this.props;
      const els = [];

      _.each(data, (value, key) => {
        els.push(<DndList
          key={`${key}__list`}
          hasItems={!!value.items.length}
          dropCb={callbacks.editIssue}
          componentProps={{
            data: value.items,
            category: value,
            groupIndexes: localIndexes[`${target.field}:${key}`],
            callbacks,
            selected,
            helpers,
            target,
          }}
        />);
      });

      return els;
    };
    const lists = renderLists();

    const { data } = this.props;

    return (
      <Resizer offset={65}>
        {(style) => (
          <div>
            <div className="kanban__header">Grouped by: {this.props.target.field}</div>
            <div style={style} className="kanban --helpers-custom-scrollbar">
              {lists}
            </div>
          </div>
        )}
      </Resizer>
    );
  }
};

Kanban.propTypes = {
  data: PropTypes.object,
  callbacks: PropTypes.object,
  helpers: PropTypes.object,
  localIndexes: PropTypes.object,
  selected: PropTypes.string,
  target: PropTypes.object,
};

export default DragDropContext(HTML5Backend)(Kanban);
