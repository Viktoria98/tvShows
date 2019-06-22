React = require 'react'

@ListingSelectableMixin =

  verticalCopyBuffer: {}

  areCellsSelectable: ->
    true

  getChildContext: ->
    vCopyBufferSetBeggining: this.vCopyBufferSetBeggining,
    vCopyBufferGetFormatted: this.vCopyBufferGetFormatted,
    vCopyBufferClean: this.vCopyBufferClean,
    vCopyBufferGetRectangle: this.vCopyBufferGetRectangle,
    isOngoingVCopying: this.isOngoingVCopying,
    getColumnOfValues: this.getColumnOfValues,
    canStartVCopying: this.canStartVCopying,
    setOngoingCopying: this.setOngoingCopying,
    setCanStartVCopying: this.setCanStartVCopying,

  childContextTypes:
    vCopyBufferSetBeggining: React.PropTypes.func,
    vCopyBufferGetFormatted: React.PropTypes.func,
    vCopyBufferClean: React.PropTypes.func,
    vCopyBufferGetRectangle: React.PropTypes.func,
    isOngoingVCopying: React.PropTypes.func,
    getColumnOfValues: React.PropTypes.func,
    canStartVCopying: React.PropTypes.func,
    setOngoingCopying: React.PropTypes.func,
    setCanStartVCopying: React.PropTypes.func,

  vCopyBufferSetBeggining: (xPos, yPos) ->
    @verticalCopyBuffer.startX = xPos
    @verticalCopyBuffer.startY = yPos
    @verticalCopyBuffer.canStartVCopying = true

  vCopyHandleCellData: (cellData) ->
    if(@verticalCopyBuffer.cellTexts[cellData.id])
      @verticalCopyBuffer.cellTexts[cellData.id].push(cellData.text)
    else
      @verticalCopyBuffer.cellTexts.colNames.push(cellData.id)
      @verticalCopyBuffer.cellTexts[cellData.id] = [cellData.text]

  vCopyBufferGetRectangle: (endX, endY) ->
    @unselectAllCells({})
    @verticalCopyBuffer.cellTexts = { colNames: [] }
    i = 0
    for rowNum in [@verticalCopyBuffer.startY..endY]
      j = 0
      for colNum in [@verticalCopyBuffer.startX..endX]
        cell = @refs[rowNum].refs[colNum]
        cellData = cell.getDataForCopy()
        cell.setSelected()
        @vCopyHandleCellData(cellData)
        j++
      i++

  vCopyBufferGetFormatted: (wordDelimiter, lineDelimiter, addHeaders) ->
    colNames = @verticalCopyBuffer.cellTexts.colNames
    lastColIndex = colNames.length - 1
    rowLen = @verticalCopyBuffer.cellTexts[colNames[0]].length - 1
    str = ""
    if(addHeaders)
      str += colNames.join(wordDelimiter) + lineDelimiter
    for i in [0..rowLen]
      for colName, j in colNames
        word = @verticalCopyBuffer.cellTexts[colName][i].replace(/(\r\n|\n|\r)/gm,"")
        delimiter = if(j == lastColIndex) then '' else wordDelimiter
        str += word + delimiter
      str += lineDelimiter
    str

  vCopyBufferClean: (opts) ->
    if(!opts.dontTouchDOM)
      @unselectAllCells({withTransition: true})
    @verticalCopyBuffer = {}

  unselectAllCells: (opts) ->
    for rowId, row of @refs
      if +rowId >= 0
        for cellId, cell of row.refs
          if cell.selected
            cell.unsetSelected(opts.withTransition)

  isOngoingVCopying: () ->
    @verticalCopyBuffer.ongoingCopying

  setOngoingCopying: (bool) ->
    @verticalCopyBuffer.ongoingCopying = bool

  setCanStartVCopying: (bool) ->
    @verticalCopyBuffer.canStartVCopying = bool

  canStartVCopying: () ->
    @verticalCopyBuffer.canStartVCopying

  getColumnOfValues: (xPos) ->
    @verticalCopyBuffer.cellTexts = { colNames: [] }
    for id, row of @refs
      if +id >= 0
        cell = row.refs[xPos]
        cell.setSelected()
        cellData = cell.getDataForCopy()
        @vCopyHandleCellData(cellData)



module.exports = @ListingSelectableMixin
