import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import DndIssue from '../dnd/dndIssue.jsx';

import ListCell from '../components/listCell.jsx';
import Tags from '../components/tags.jsx';
import RelativeTime from '../../time/relativeTime.jsx';
import Avatars from '../../avatars/avatars.jsx';
import DropdownFeed from '../../dropdowns/contentDropdowns/dropdownFeed.jsx';

const RenderItem = (props) => {
  const {
    itemData,
    structure,
    preparedProps,
    index,
    selected,
    selectedItems,
    sortContainerCb,
    group,
    ...restProps
  } = props;

  const renderContent = () =>
    structure.map(({
      content, componentProps, type, config, value,
    }) => {
      const data = get(itemData, content);
      const extendedProps = {
        ...preparedProps[type],
        ...componentProps,
      };

      const componentsGenerator = {
        tags () {
          return content.map((el, i) => (
            <Tags {...extendedProps} key={i} options={el.config} tags={itemData[el.path]} />
          ));
        },

        feed () {
          return (
            <DropdownFeed
              {...extendedProps}
              data={itemData}
              btnText={data}
              updates={get(itemData, componentProps.updates)}
            />
          );
        },

        avatars () {
          // better would be to expand list structure so that we are able to pass inside as many props as we want
          const avatar = get(itemData, 'assignee.avatar');
          return <Avatars data={data} avatar={avatar} />;
        },

        time () {
          return <RelativeTime {...extendedProps} value={data} text={get(itemData, value)} />;
        },
      };

      const element = componentsGenerator[type] ? componentsGenerator[type]() : null;
      return (
        <ListCell
          key={`list-item-cell__${config.name}`}
          config={config}
          data={data}
          children={element}
          itemData={itemData}
          group={group}
        />
      );
    });

  const content = renderContent();

  return (
    <div className="list__item-wrapper">
      <DndIssue
        componentProps={{
          ...restProps,
          checkboxProps: preparedProps.checkbox,
          components: content,
        }}
        group={group}
        data={itemData}
        index={index}
        selected={selected}
        selectedItems={selectedItems}
        sortContainerCb={sortContainerCb}
      />
    </div>
  );
};

RenderItem.propTypes = {
  callbacks: PropTypes.object,
  dictionaries: PropTypes.object,
  index: PropTypes.number,
  itemClass: PropTypes.string,
  itemData: PropTypes.object,
  openItemCb: PropTypes.func,
  openedInDetails: PropTypes.bool,
  preparedProps: PropTypes.object,
  selectItem: PropTypes.func,
  selected: PropTypes.bool,
  selectedItems: PropTypes.array,
  sortContainerCb: PropTypes.func,
  structure: PropTypes.array,
};

export default RenderItem;
