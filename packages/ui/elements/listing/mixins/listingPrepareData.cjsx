`import _ from 'lodash';`

@ListingPrepareData =

  prepare: (data, haveCheckBox, position, availableColumns, areCellsSelectable, freezedColumnsCount) ->
    items = @prepareRow(data, availableColumns)
    <ListingItem
      key = {data.id || items.id}
      id = {data.id || items.id}
      ref= {position}
      position = {position}
      target = {data.target}
      checked = {data.checked}
      checkbox = {haveCheckBox}
      wrapped = {@props.wordWrap}
      freezedColumnsCount = {freezedColumnsCount}
      doubleClick = {@doubleClick}
      warning = {data.warning}
      areCellsSelectable = {areCellsSelectable}
      items = {items}
      store = {@props.store} />

module.exports = @ListingPrepareData
