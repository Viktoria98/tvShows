UI = require 'meteor/ff:ui'
BaseMixin = UI.BaseMixin
BasePopupMixin = UI.BasePopupMixin

`import ListingContainerMixin from '../mixins/listingContainerMixin.jsx';`

@ListingExportCSVPopup = React.createClass
  displayName: 'ListingExportCSVPopup'

  mixins: [BaseMixin(), BasePopupMixin('csvReport'), ListingCheckAllMixin, ListingContainerMixin, ListingPrepareData]

  prepareRow: (data) ->
    item = {}
    item.label = data.label
    item
