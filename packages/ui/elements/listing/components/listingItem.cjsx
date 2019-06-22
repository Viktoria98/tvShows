`import React from 'react';`

`import Cell from '../../listing/components/cell.jsx';`
`import SelectableCellWrapper from '../../listing/components/SelectableCellWrapper.jsx';`
`import Checkbox from '../../v2/checkboxes/checkbox.jsx';`
`import BaseMixin from '../../general/mixins/BaseMixin.js';`
`import ListingCheckItemMixin from '../../listing/mixins/listingCheckItemMixin.cjsx';`

@ListingItem = React.createClass
  displayName: 'ListingItem'

  mixins: [BaseMixin(), ListingCheckItemMixin]

  render: ->
    columns = []
    onclick = undefined
    colNum = 0
    for columnKey, column of @props.items
      continue if columnKey in ['id', 'checked', 'key', 'isGroupName']
      if column and typeof column is 'object'
        #console.log(column)
        tooltip = column.tooltip
        copyValue = column.copyValue
        editable = column.editable
        edit = column.edit
        remove = column.remove
        value = column.value
        dropdown = column.dropdown
        width = column.width
        right = column.right
        freezed = column.freezed
        expired = if column.expired then true else false
      else
        dropdown = null
        value = column
        freezed = false
      freezed = (colNum < @props.freezedColumnsCount)
      cellRef = if(@props.areCellsSelectable) then "#{colNum}_wrapped_cell" else colNum

      cell = <Cell
                id={columnKey}
                key={columnKey}
                itemId={@props.id}
                className={columnKey}
                value={value}
                copyValue={copyValue}
                ref={cellRef}
                xPos={colNum}
                tooltip={tooltip}
                wrapped={@props.wrapped}
                editable={editable}
                expired={expired}
                edit={edit}
                remove={remove}
                width={width}
                right={right}
                dropdown={dropdown}
                freezed={freezed}
                listingCell={true}
                doubleClick={@props.doubleClick}/>
      if @props.areCellsSelectable
        columns.push(
          <SelectableCellWrapper
            id={columnKey}
            yPos={@props.position}
            xPos={colNum}
            ref={colNum}
            key={columnKey}
            freezed={freezed}>
            {cell}
          </SelectableCellWrapper>
        )
      else
        columns.push cell

      colNum++
    unless @props.checkbox is false
      checkbox =
      <Cell
         id="listingCheckbox"
         key={columnKey}
         className="cell checkboxOuter"
         dontWrapContent={true}
         freezed={!!@props.freezedColumnsCount}
         value={<Checkbox ref="checkboxItem"
                   key={'checkbox' + @props.id}
                   onCheck={@itemClick}
                   checked={@state.checked} />}
         ref={'checkboxCell'} />
      onclick = @itemClick
    if @props.checkbox is false and @props.isGroupName
      checkbox =
        <div className="cell checkboxOuter" />
    unless onclick?
      onclick = -> return false
    (<div
        id={@props.position}
        className={classNames('listing__item', {'-checked': @state.checked}, {'-warning': @props.warning}, {'groupName': @props.items.isGroupName})}
        onClick={(event) -> onclick(event)}>
        {checkbox}
        {columns}
    </div>)

module.exports = @ListingItem
