@ListingExportCSVPopupMixin =

  composeCSV: ->
    selectedData = @props.store.getSelectedData()
    selectedColumns = @props.store.getPopupSelectedData()
    popupData = Object.keys(@props.store.getPopupData('csvReport'));
    sortedSelectedColumns = _.sortBy(selectedColumns, (item) => popupData.indexOf('_' + item.id));

    listingItems = _.map selectedData, (data) =>
      row = @prepareRow data
      newRow = {}
      for k, col of sortedSelectedColumns
        newRow[col.id] = row[col.id]
      newRow
    header = {
      fields: [],
      fieldNames: [],
    }
    for k, col of sortedSelectedColumns
      header.fieldNames.push col.label
      header.fields.push col.id

    @downloadCSV listingItems, header

  render: ->
    listingItems = []
    popupData = {}
    for column in @props.columns
      continue unless column.visible
      if column.items?
        for innerKey, innerColumn of column.items
          data = {label: innerColumn.label, checked: true}
          popupData[innerKey] = data
      else
        data = {label: column.label, checked: true}
        popupData[column.name] = data
    @props.store.setPopupData('csvReport', popupData)
    <ListingExportCSVPopup id={@props.id} store={@props.store} newData={@props.store.getPopupData('csvReport')} isPopup={true}
     sortedColumns={[{label: 'Column', name: 'label', visible: true}]} cb={@composeCSV} popupBtn="Export" popupTitle="Export CSV" />

module.exports = @ListingExportCSVPopupMixin
