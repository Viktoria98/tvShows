@ListingLocalSaveCSV =
  downloadCSV: (data, fileName = "export.csv", header = {}) ->
    csv = @convertArrayToCSV data, header
    unless csv == null
      csv = "data:text/csv;charset=utf-8," + csv unless csv.match /^data:text\/csv/i
      output = encodeURI csv
      link = document.createElement "a"
      document.body.appendChild(link);
      link.setAttribute("type", "hidden");
      link.setAttribute "href", output
      link.setAttribute "download", fileName
      link.click()

  convertArrayToCSV: (args, header) ->
    data = args or null
    columnDelimiter = args.columnDelimiter or ','
    lineDelimiter = args.lineDelimiter or '\n'
    cellDelimiter = args.cellDelimiter or '"'
    keys = Object.keys data[0]
    result = ''
    if header.length
      result +=  cellDelimiter + header.join(cellDelimiter + columnDelimiter + cellDelimiter) + cellDelimiter
    else
      result +=  cellDelimiter + keys.join(cellDelimiter + columnDelimiter + cellDelimiter) + cellDelimiter
    result += lineDelimiter
    for item in data
      ctr = 0
      for key in keys
        if item[key] instanceof Object
          exception = item[key].value if item[key].value isnt "undefined"
          if item[key].value instanceof Object
            if item[key].value.props instanceof Object
              exception = item[key].value.props.children if item[key].value.props.children
              exception = item[key].value.props.date if item[key].value.props.date
              if item[key].value.props.labels
                labels = []
                for label in item[key].value.props.labels
                  labels.push if label.name then label.name else label
                exception = labels.join(', ')
          item[key] = exception
        item[key] = '' if item[key] == null or typeof item[key] is 'undefined'
        result += columnDelimiter if (ctr > 0)
        result += cellDelimiter + item[key] + cellDelimiter
        ctr++
      result += lineDelimiter
    result

module.exports = @ListingLocalSaveCSV
