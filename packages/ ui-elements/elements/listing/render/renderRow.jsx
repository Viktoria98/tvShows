import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ListingItem from '../listingItem.jsx';

import Cell from '../cells/cell.jsx';
import SystemCheckbox from '../cells/systemCheckbox.jsx';

import ColoredCell from '../cells/coloredCell.jsx';
import SystemIndicator from '../../indicators/indicator.jsx';
import Link from '../../links/link.jsx';
import UploadableLink from '../../uploadable/uploadableLink';
import RelativeTime from '../../time/relativeTime.jsx';
import InlineTextarea from '../../inputs/inlineTextarea/inlineTextarea.jsx';
import { LabelsContainer } from '../../labels/';
import Button from '../cells/cellButton.jsx';
// dropdowns
import Dropdown from '../../dropdowns/contentDropdowns/dropdown.jsx';
import DropdownAutosuggest from '../../dropdowns/contentDropdowns/dropdownAutosuggest.jsx';
import DropdownAutosuggestPromise from '../../dropdowns/contentDropdowns/dropdownAutosuggestPromise.jsx';
import DropdownFeed from '../../dropdowns/contentDropdowns/dropdownFeed.jsx';
import DropdownDatepicker from '../../dropdowns/contentDropdowns/datepicker/dropdownDatepicker.jsx';
import DropdownTooltip from '../../dropdowns/contentDropdowns/tooltip/dropdownTooltip.jsx';
import DropdownTagEditor from '../../dropdowns/contentDropdowns/tagEditor/'; // old version
import DropdownLabelsEditor from '../../dropdowns/contentDropdowns/labelsEditor/'; // new version

import { findComponentProps } from '../helpers.js';

const RenderRow = class extends Component {
  // TODO: get rid of this, doesn't make sence
  static getSelectedOption (searchValue, options) {
    // bcs we have boolean options where searchValue can be equal to false (e.g. External column)
    if (searchValue || typeof searchValue === 'boolean') {
      return options.find((option) => option.value === searchValue) || {};
    }
    return {};
  }

  constructor (props) {
    super(props);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.click = this.click.bind(this);
    this.doubleClick = this.doubleClick.bind(this);

    this.throttle = _.throttle(this.toggleCheckbox, 280, { leading: false });
  }

  rowIsSelected () {
    const { propsPackage } = this.props;
    return _.get(propsPackage, 'core.isSelected');
  }

  // used for row selection from any place (not only from checkbox)
  toggleCheckbox (args) {
    const { selected, propsPackage } = this.props;
    const { ctrlKey, metaKey, shiftKey } = args;
    const isSelected = this.rowIsSelected();
    const { multipleCheck } = propsPackage.core;

    if (
      !multipleCheck &&
      !(ctrlKey || metaKey || shiftKey) &&
      (selected.items.length > 1 || !isSelected) &&
      selected.items.length > 0
    ) {
      propsPackage.core.resetAllCheckboxes();
    }

    propsPackage.core.toggleCheckbox(shiftKey);
  }

  // This construction with click and doubleClick handlers needs for understanding
  // when a user made one single click, and prevent selecting by doubleclick action.
  click (event) {
    const {
      target,
      ctrlKey,
      altKey,
      shiftKey,
      metaKey,
    } = event;
    const { propsPackage } = this.props;
    const exception = [
      'inline-field__input',
      'dropdown-base__body',
      'link',
      'dropdown-base__btn-text',
      'dropdown-base__btn',
    ]; // ignore textarea, dropdown and links
    let isException = false;
    // Needs to prevent selecting by clicking somewhere inside the component
    // (by selecting an item in dropdown for example)
    exception.forEach((item) => {
      if (
        target.className === item ||
        target
          .parents()
          .map((domItem) => domItem.className)
          .indexOf(item) >= 0
      ) {
        if (!target.className.includes('--disabled')) {
          isException = true;
        }
      }
    });

    if (altKey) {
      propsPackage.core.copyToClipboard(event);
    } else {
      if (!isException) {
        this.throttle({ ctrlKey, metaKey, shiftKey });
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    }

  }

  doubleClick () {
    this.throttle.cancel();
  }

  // smart selection allows user to click on almost any component in the row (except immune ones)
  // and have row selected
  assignSmartSelectionListeners (component) {
    const { disableSmartSelection } = this.props;
    const immuneComponents = ['dropdown', 'feed', 'autosuggest', 'tagEditor', 'dropdownTooltip'];

    if (disableSmartSelection || immuneComponents.includes(component)) {
      return {};
    }

    return {
      onClick: this.click,
      onDoubleClick: this.onDoubleClick,
    };
  }

  renderRow () {
    const {
      data,
      structure,
      propsPackage,
      filterFunction,
      blocked,
      block,
      unblock,
      lockOffset,
      lockedCols,
      startCopy,
      continueCopy,
      endCopy,
      colsCopy,
      rowsCopy,
    } = this.props;

    return structure.map((columnProps) => {
      const colProps = filterFunction ? filterFunction(data, columnProps) : columnProps;

      const {
        id, component, valueField, displayField, config, componentProps,
      } = colProps;

      function constructProps (system) {
        const propsForComponent = findComponentProps(propsPackage, component, id);
        // system components such as checkbox or indicator don't need additionalProps
        // except those which are passed from prepareRow
        if (system) {
          return propsForComponent;
        }

        return {
          ...componentProps,
          field: valueField || displayField,
          data,
          blocked,
          block,
          unblock,
          ...propsForComponent,
        };
      }

      const componentsGeneratorBase = {
        checkboxSystem () {
          return <SystemCheckbox {...constructProps(true)} />;
        },

        indicatorSystem () {
          return <SystemIndicator {...constructProps(true)} />;
        },

        button () {
          return (
            <Button
              {...constructProps()}
              content={_.get(data, displayField)}
              cellText={config.cellText}
              showModal={config.showModal}
            />
          );
        },

        link () {
          return <Link {...constructProps()} data={data} href={valueField} text={displayField} />;
        },

        uploadableLink () {
          return (
            <UploadableLink
              data={data}
              href={valueField}
              text={displayField}
              {...constructProps()}
            />
          );
        },

        input () {
          return <InlineTextarea {...constructProps()} content={_.get(data, displayField)} />;
        },

        textarea () {
          return <InlineTextarea {...constructProps()} content={_.get(data, displayField)} />;
        },

        autosuggestPromise () {
          return (
            <DropdownAutosuggestPromise
              {...constructProps()}
              options={_.get(data, componentProps.options) || componentProps.options}
              btnText={_.get(data, displayField)}
              promiseMethod={componentProps.promiseMethod}
            />
          );
        },

        dropdown () {
          const selectedOption = RenderRow.getSelectedOption(
            _.get(data, displayField),
            componentProps.options
          );
          return (
            <Dropdown
              {...constructProps()}
              selectedOption={selectedOption}
              btnText={selectedOption.text}
              btnClassName={selectedOption.className}
            />
          );
        },

        autosuggest () {
          // remember about project cell extending with options from store
          return (
            <DropdownAutosuggest
              {...constructProps()}
              options={_.get(data, componentProps.options) || componentProps.options}
              btnText={_.get(data, displayField)}
            />
          );
        },

        feed () {
          return (
            <DropdownFeed
              {...constructProps()}
              updates={_.get(data, componentProps.updates)}
              btnText={_.get(data, displayField)}
            />
          );
        },

        datepicker () {
          return (
            <DropdownDatepicker
              {...constructProps()}
              btnText={_.get(data, displayField)}
              date={_.get(data, valueField)}
            />
          );
        },

        relativeTime () {
          return (
            <RelativeTime
              {...componentProps}
              value={_.get(data, valueField)}
              text={_.get(data, displayField)}
            />
          );
        },

        tagEditor () {
          return (
            <DropdownTagEditor
              {...constructProps()}
              btnText={_.get(data, displayField)} // nu
              btnTags={_.get(data, displayField)}
            />
          );
        },

        labelsEditor () {
          return <DropdownLabelsEditor {...constructProps()} labels={_.get(data, displayField)} />;
        },

        labels () {
          return <LabelsContainer {...constructProps()} labels={_.get(data, displayField)} />;
        },

        dropdownTooltip () {
          return <DropdownTooltip {...constructProps()} data={_.get(data, displayField)} />;
        },

        coloredCell () {
          return (
            <ColoredCell
              {...constructProps()}
              width={config.width}
              value={_.get(data, displayField, null)}
            />
          );
        },

        component () {
          const CustomComponent = _.get(config, 'component', null);
          return (<CustomComponent data={data} colProps={colProps} />);
        },
      };

      const componentsGenerator = {
        ...componentsGeneratorBase,

        custom () {
          return componentsGeneratorBase[config.type]();
        },
      };

      const smartSelectionListeners = this.assignSmartSelectionListeners();
      const cellCopyProps = {
        startCopy,
        continueCopy,
        endCopy,
        colsCopy,
        rowsCopy,
      };

      const cellContent = componentsGenerator[component]
        ? componentsGenerator[component].call(this)
        : null;
      const colLeftOffset = lockedCols && lockedCols.includes(id) ? lockOffset : 0;
      const cellToRender = (
        <Cell
          config={config}
          columnId={id}
          key={`${id}_${data._id}`}
          data={_.get(data, displayField)}
          itemData={data}
          lockOffset={colLeftOffset}
          {...smartSelectionListeners}
          {...cellCopyProps}
        >
          {cellContent}
        </Cell>
      );

      return cellToRender;
    });
  }

  render () {
    const { highlightRow, data } = this.props;

    const isSelected = this.rowIsSelected();
    const row = this.renderRow();

    return <ListingItem id={data.id} bold={data.bold} content={row} isSelected={isSelected} highlightRow={highlightRow} />;
  }
};

RenderRow.propTypes = {
  data: PropTypes.object,
  block: PropTypes.func,
  blocked: PropTypes.bool,
  disableSmartSelection: PropTypes.bool,
  lockOffset: PropTypes.number,
  lockedCols: PropTypes.array,
  filterFunction: PropTypes.func,
  highlightRow: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  propsPackage: PropTypes.object,
  selected: PropTypes.shape({
    all: PropTypes.bool,
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }),
  structure: PropTypes.array.isRequired,
  unblock: PropTypes.func,
};

RenderRow.defaultProps = {
  propsPackage: {},
};

export default RenderRow;
