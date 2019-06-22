/* global Package, Npm */

// https://github.com/reactjs/react-meteor/issues/40
Package.describe({
  name: 'ff:ui',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md',
});

Package.onUse((api) => {
  /**
   * Dependecies - meteor packages
   */
  api.use([
    'ecmascript',
    'coffeescript-cjsx',
    'mrt:nprogress',
    'stylus',
    'mizzao:jquery-ui',
    'raix:eventemitter',
  ]);

  api.mainModule('main.js', ['client']);

  Npm.depends({
    clipboard: '1.5.12',
    moment: '2.17.1',
    'moment-range': '3.0.2',
    'react-autosuggest': '5.1.2',
    'moment-timezone': '0.5.11',
    'ff-react-daterange-picker': '1.0.1',
    d3: '3.5.17',
    underscore: '1.8.3',
  });

  /**
  * General
  */
  api.addFiles([
    'elements/general/mixins/BaseMixin.js',
    'elements/general/components/ConditionalRenderer.jsx',
    'elements/general/stores/globalEvents.coffee',
    'elements/general/stores/globalStore.coffee',
    'elements/general/dispatchers/envDispatcher.coffee',
  ], ['client']);

  /**
   * Listing
   */
  api.addFiles([
    'elements/listing/listing.import.styl',
    'elements/listing/mixins/listingBaseMixin.cjsx',
    'elements/listing/mixins/listingCheckAllMixin.cjsx',
    'elements/listing/mixins/listingCheckItemMixin.cjsx',
    'elements/listing/mixins/listingInfiniteScrollMixin.js',
    'elements/listing/mixins/listingPrepopulatePopupMixin.cjsx',
    'elements/listing/mixins/listingContainerMixin.jsx',
    'elements/listing/mixins/listingDateRangeMixin.cjsx',
    'elements/listing/mixins/listingWordWrap.cjsx',
    'elements/listing/mixins/listingExportCSV.js',
    'elements/listing/mixins/listingExportCSVPopupMixin.cjsx',
    'elements/listing/mixins/listingPrepareData.cjsx',
    'elements/listing/stores/listingEvents.js',
    'elements/listing/stores/listingStore.js',
    'elements/listing/stores/listingStore.coffee',
    'elements/listing/dispatchers/listingDispatcher.coffee',
    'elements/listing/dispatchers/popupListingDispatcher.coffee',
    'elements/listing/components/listingHeaderDropdownItem.cjsx',
    'elements/listing/components/listingHeaderItem.cjsx',
    'elements/listing/components/listingItem.cjsx',
    'elements/listing/components/cell.jsx',
    'elements/listing/components/labels.jsx',
    'elements/listing/components/tag.cjsx',
    'elements/listing/components/listingExportCSVPopup.cjsx',
  ], ['client']);

  /**
   * Notifications
   */
  api.addFiles([
    'elements/notifications/notifications.import.styl',
    'elements/notifications/stores/NotificationsEvents.js',
    'elements/notifications/stores/NotificationsStore.js',
    'elements/notifications/dispatchers/NotificationsDispatcher.js',
    'elements/notifications/components/Notifications.jsx',
    'elements/notifications/components/NotificationsApp.jsx',
  ], ['client']);

  /**
   * Authentication
   */
  api.addFiles([
    'elements/auth/auth.import.styl',
    'elements/auth/components/SignIn.jsx',
    'elements/auth/components/SignUp.jsx',
    'elements/auth/components/RestorePassword.jsx',
    'elements/auth/components/SetNewPassword.jsx',
    'elements/auth/components/AccountTypeIcons.jsx',
  ], ['client']);

  /**
   * Storage
   */
  api.addFiles([
    'elements/storage/storage.coffee',
  ], ['client']);

  /**
   * Formatters
   */
  api.addFiles([
    'elements/formatters/Format.js',
  ], ['client']);

  /**
   * Validators
   */
  api.addFiles([
    'elements/validators/validate.coffee',
  ], ['client']);

  /**
   * Datepickers
   */
  api.addFiles([
    'elements/datepickers/datepickers.import.styl',
    'elements/datepickers/components/simpleDatepicker.cjsx',
    'elements/datepickers/components/rangeDatepicker.cjsx',
  ], ['client']);

  /**
   * Tooltips
   */
  api.addFiles([
    'elements/tooltips/tooltips.import.styl',
    'elements/tooltips/components/Tooltip.jsx',
    'elements/tooltips/components/DateTooltip.jsx',
  ], ['client']);

  /**
   * Dropdowns
   */
  api.addFiles([
    'elements/dropdowns/dropdowns.import.styl',
    'elements/dropdowns/components/Dropdown.jsx',
    'elements/dropdowns/components/LinkDropdown.jsx',
    'elements/dropdowns/components/MultiSelectDropdown.jsx',
    'elements/dropdowns/components/MultiSelectDropdownItem.jsx',
    'elements/dropdowns/components/MultiSelectDropdownGroup.jsx',
    'elements/dropdowns/components/rangeDatepickerDropdown.cjsx',
  ], ['client']);

  /**
   * Graph
  */

  api.addFiles([
    'elements/graph/graph.import.styl',
    'elements/graph/components/lineGraph.cjsx',
    'elements/graph/components/lineGraphSimplified.cjsx',
    'elements/graph/components/xAxis.cjsx',
    'elements/graph/components/yAxis.cjsx',
    'elements/graph/components/line.cjsx',
    'elements/graph/components/grid.cjsx',
    'elements/graph/components/dots.cjsx',
    'elements/graph/components/graphTooltip.cjsx',
    'elements/graph/components/statsApp.cjsx',
  ], ['client']);

  /**
   * Old Graph

  api.addFiles([
    'elements/graph/graph.import.styl',
    'elements/graph/stores/graphEvents.coffee',
    'elements/graph/stores/graphStore.coffee',
    'elements/graph/dispatchers/graphDispatcher.coffee',
    'elements/graph/components/area.cjsx',
    'elements/graph/components/circles.cjsx',
    'elements/graph/components/gradient.cjsx',
    'elements/graph/components/graphApp.cjsx',
    'elements/graph/components/line.cjsx',
    'elements/graph/components/lines.cjsx',
    'elements/graph/components/mainGraph.cjsx',
    'elements/graph/components/statGraph.cjsx',
    'elements/graph/components/statsApp.cjsx',
    'elements/graph/components/tooltip.cjsx',
    'elements/graph/components/xAxis.cjsx',
    'elements/graph/components/yAxis.cjsx',,
  ], ['client']);

  */

  /**
   * Forms
   */
  api.addFiles([
    'elements/form/form.import.styl',
    'elements/form/dispatchers/formDispatcher.coffee',
    'elements/form/components/FormRadioGroup.jsx',
    'elements/form/components/FormMultiDropdown.jsx',
    'elements/form/components/FormDropdown.jsx',
    'elements/form/components/Form.jsx',
    'elements/form/components/FormTextfield.jsx',
    'elements/form/components/formSimpleDatepicker.cjsx',
    'elements/form/components/FormTextarea.jsx',
    'elements/form/components/FormCheckbox.jsx',
  ], ['client']);

  /**
   * Filters
   */
  api.addFiles([
    'elements/filters/filterDropdown.cjsx',
    'elements/filters/filterMultipleDropdown.cjsx',
    'elements/filters/filterSearchbar.cjsx',
    'elements/filters/filterDate.cjsx',
  ], ['client']);

  /**
   * Popups
   */
  api.addFiles([
    'elements/popups/popups.import.styl',
    'elements/popups/mixins/BasePopupMixin.jsx',
    'elements/popups/stores/popupsEvents.coffee',
    'elements/popups/stores/popupsStore.coffee',
    'elements/popups/dispatchers/popupsDispatcher.coffee',
    'elements/popups/components/popup.cjsx',
    'elements/popups/components/infoPopup.cjsx',
  ], ['client']);

  /**
   * Checkboxes
   */
  api.addFiles([
    'elements/checkboxes/checkboxes.import.styl',
    'elements/checkboxes/components/Checkbox.jsx',
  ], ['client']);

  /**
   * Searchbars
   */
  api.addFiles([
    'elements/searchbars/searchbars.import.styl',
    'elements/searchbars/components/searchbar.cjsx',
    'elements/searchbars/components/minimalSearchbar.cjsx',
    'elements/searchbars/components/AutocompleteSearchbar.jsx',
  ], ['client']);

  /**
   * Core stylesheets
   */
  api.addFiles([
    'stylesheets/core.bundle.import.styl',
    'stylesheets/core/mixins.import.styl',
    'stylesheets/core/typography.import.styl',
    'stylesheets/core/general.import.styl',
    'stylesheets/core/helpers.import.styl',
    'stylesheets/core/variables.import.styl',
    'stylesheets/core/fonts.import.styl',
  ], ['client']);

  /**
   * Components stylesheets
   */

  api.addFiles([
    'stylesheets/buttons.import.styl',
    'stylesheets/controls.import.styl',
    'stylesheets/navigation.import.styl',
    'stylesheets/icons.import.styl',
  ], ['client']);

  /**
   * Plugin styling stylesheets
   */

  api.addFiles([
    'stylesheets/plugins/perfect-scrollbar.import.styl',
  ], ['client']);

  /**
   * Uncategorized
   */

  /**
   * Assets
   */
  api.addAssets([
    'assets/fonts/gotham-medium/gotham-medium-webfont.eot',
    'assets/fonts/gotham-medium/gotham-medium-webfont.svg',
    'assets/fonts/gotham-medium/gotham-medium-webfont.ttf',
    'assets/fonts/gotham-medium/gotham-medium-webfont.woff',
    'assets/fonts/gotham-medium/gotham-medium-webfont.woff2',
    'assets/fonts/whitney-medium/whitney-medium-webfont.eot',
    'assets/fonts/whitney-medium/whitney-medium-webfont.svg',
    'assets/fonts/whitney-medium/whitney-medium-webfont.ttf',
    'assets/fonts/whitney-medium/whitney-medium-webfont.woff',
    'assets/fonts/whitney-medium/whitney-medium-webfont.woff2',
    'assets/fonts/whitney-semibold/whitney-semibold-webfont.eot',
    'assets/fonts/whitney-semibold/whitney-semibold-webfont.svg',
    'assets/fonts/whitney-semibold/whitney-semibold-webfont.ttf',
    'assets/fonts/whitney-semibold/whitney-semibold-webfont.woff',
    'assets/fonts/whitney-semibold/whitney-semibold-webfont.woff2',
    'assets/images/logo.svg',
    'assets/images/arrow-down.png',
    'assets/images/arrow-up.png',
    'assets/images/basket.svg',
    'assets/images/basket-hovered.svg',
    'assets/images/checkbox.png',
    'assets/images/check.png',
    'assets/images/check.svg',
    'assets/images/check-white.svg',
    'assets/images/check-disabled.svg',
    'assets/images/spinner.png',
    'assets/images/search-icon.svg',
    'assets/images/stylus.svg',
    'assets/images/stylus-hovered.svg',
    'assets/images/stylus-white.svg',
    'assets/images/wrench.svg',
    'assets/images/wrench-hovered.svg',
    'assets/images/star.svg',
  ], ['client'], { isAsset: true });

  /**
   * v2
   */
  api.addFiles([
    'elements/v2/bundle.js',
  ], ['client']);

  /**
   * inline elements
   */
  api.addFiles([
    'elements/inline-field/inline-field.import.styl',
    'elements/inline-dropdown/inline-dropdown.import.styl',
    'elements/inline-field/components/inline-field.jsx',
    'elements/inline-dropdown/components/inline-dropdown.jsx',
    'elements/inline-dropdown/components/dropdown-base.jsx',
    'elements/inline-dropdown/components/dropdown-item.jsx',
  ], ['client']);
});
