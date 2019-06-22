#LEGEND
**Text** - header, most of the time name of component
* PropName - this prop is required either way component won't work without it, or will work with bugs


**DropdownBase**
DropdownBase is a parent component, each dropdown is wrapping base component, hence sharing its functionality.
These props are shared between each dropdown component, which is nesting from base.

<DropdownBase
  * btnText {str} -- string which will be passed inside dropdown btn (required)
  * btnComponent {array of React components} -- instead of string we can pass component, or array of components
    it works in such way with dropdownTagEditor
  * btnPlaceholder {str} -- this prop will be used only if dropdown has no value to show inside btn
  * dropdownWidth {number} -- used to define dropdown body width
    data {obj} -- object representing top level data layer (e.g. issue, recruit, etc)
    expandDirection {string} -- defines in which way dropdown will expand (i.e. to left/right) default -- center
    disableChevronIcon {bool} -- you can disable chevron icon if its redundant. Keep in mind that it will also change
      styles inside dropdownBtn, and positioning(in future) (otherwise dropdown will be pointing on empty space)
    dontCalculateHeight {bool} -- by default dropdowns are calculating their height, so they can expand to top
      bottom if there are no space. This functionality was added bcs of listings, but sometimes we don't need to calculate height, for example if dropdown will be placed inside simple div on the page, i.e. it is not restricted with scrollbars, in that case we can disable calculations.
/>


**Dropdown**
Simple dropdown with options

<Dropdown
  * options {arr} -- array of options --- [ { text: 'text', value: 'value', className: 'className' } ]
  defaultOption {obj} -- we can pass defaultOption inside, which will be rendered as a first option
  computeTooltipText {func} -- we can compute tooltip text, which will be rendered on dropdownBtn hovered
    func receives open argument - selected option, if func is not defined - tooltip won't be rendered
/>


**DropdownAutosuggest**
Basically the same dropdown, but with autosuggest functionality

<DropdownAutosuggest
  * options {arr} -- array of options --- [ { text: 'text', value: 'value', className: 'className' } ]
      most of the time options for autosuggest are passed from server, bcs array will contain at least
      dozens of options
    defaultOption {obj} -- we can pass defaultOption inside, which will be rendered as a first option
/>


**DropdownFeed**
Dropdown wich contains feed with comments or logs etc...

<DropdownFeed
  * updates {arr} -- array of updates, structure can be customizible, but feedItem should undestand which props it
    should require and where to find them
  * itemType {str} -- type of item to render (comment,log)
    disableAction {bool} -- with this flag component will render itself without input, so user won't be able to add
      new commment, also affects abillity to delete comments
    computeTooltipText {func} -- we can compute tooltip text, which will be rendered on dropdownBtn hovered
      func receives open argument - selected option, if func is not defined or there are no comments/logs - tooltip won't be rendered
/>


**DropdownDatepicker**
Dropdown with datepicker, render logic is the same with

<DropdownDatepicker
  * dateConfig {obj} -- represents config options for datepicker, such as should we allow to pick past years
      as well as date boundaries
      dateConfig: {
        allowPastYears: true,
        fromMonth: new Date(2000, 0),
        toMonth: new Date(2087, 11),
      },
/>

**DropdownTagEditor**
Dropdown with labels/tags editor, allows to display labels, add labels, etc

<DropdownTagEditor

/>
