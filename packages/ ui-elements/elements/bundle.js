/** React components * */

// infinite scroll examples, we'll delete them after listings and calendar refactoring
import InfiniteList from './infiniteScrollList/verticalList.jsx';
import InfiniteHorizontalList from './infiniteScrollList/horizontalList.jsx';
// auth
import GoogleSignIn from './auth/googleSignIn.jsx';
// autosuggest
import { Autosuggest } from './autosuggest/';
// avatars
import Avatars from './avatars/avatars.jsx';
// buttons
import Button from './buttons/button.jsx';
// tooltips
import Tooltip from './tooltips/tooltip.jsx';
import FixedTooltip from './tooltips/components/fixedTooltip.jsx';
// icon
import Icon from './icons/icon.jsx';
// switches
import Switch from './switches/switch.jsx';
// menu dropdowns
import DropdownBase from './dropdowns/menuDropdowns/_dropdownBase.jsx';
import Dropdown from './dropdowns/menuDropdowns/components/dropdown.jsx';
import SelectDropdown from './dropdowns/menuDropdowns/components/selectDropdown.jsx';
import MultiselectDropdown from './dropdowns/menuDropdowns/components/multiselectDropdown.jsx';
import RangeDatepickerDropdown from './dropdowns/menuDropdowns/components/rangeDatepickerDropdown.jsx';
// content dropdowns
import ContentDropdown from './dropdowns/contentDropdowns/dropdown.jsx';
import DropdownAutosuggest from './dropdowns/contentDropdowns/dropdownAutosuggest.jsx';
import DropdownFeed from './dropdowns/contentDropdowns/dropdownFeed.jsx';
import DropdownTagEditor from './dropdowns/contentDropdowns/tagEditor/';
import DropdownDatepicker from './dropdowns/contentDropdowns/datepicker/dropdownDatepicker.jsx';
// datepickers
import SimpleDate from './datepickers/formatters/simpleDate.js';
import SimpleDatepicker from './datepickers/simpleDatepicker.jsx';
import RangeDatepicker from './datepickers/rangeDatepicker.jsx';
// inputs
import RadioGroup from './radiogroups/radioGroup.jsx';
import FormInput from './inputs/formInput/formInput.jsx';
import FormDropdown from './inputs/formDropdown/formDropdown.jsx';
import FormSwitchInput from './inputs/formSwitchInput/formSwitchInput.jsx';
import Textarea from './inputs/textarea/textarea.jsx';
import Input from './inputs/input/input.jsx';
import Field from './inputs/field/field.jsx';
// checkbox
import Checkbox from './checkboxes/checkbox.jsx';
// popups
import Popup from './popups/components/popup.jsx';
// notifications
import Notification from './notif/notif.jsx';
import Warning from './notif/warning.jsx';
// searchbars
import InstantSearchbar from './searchbars/instantSearchbar.jsx';
import AutocompleteSearchbar from './searchbars/autocompleteSearchbar.jsx';
// list
import List from './list/list.jsx';
import RenderItem from './list/render/renderItem.jsx';
// list details panel templates
import DetailsPanelScrollable from './details/variations/panelScrollable.jsx';
// listing

import Listing from './listing/';
// import Listing from './listing/listing.jsx';
// import ListingItem from './listing/listingItem.jsx';
// import ListingHeader from './listing/listingHeader.jsx';
// import Labels from './listing/labels.jsx';
// import RenderRow from './listing/render/renderRow.jsx';
// import RenderHeader from './listing/render/renderHeader.jsx';
// time
import RelativeTime from './time/relativeTime.jsx';
// feed
import Feed from './feed/feed.jsx';
import FeedTextarea from './feed/feedTextarea.jsx';
// links
import Link from './links/link.jsx';
import UploadableLink from './uploadable/uploadableLink.jsx';
import UploadableBase from './uploadable/uploadableBase.jsx';
// calendar
import Calendar from './calendar/calendar.jsx';
// kanban
import Kanban from './kanban/kanban.jsx';
// formatNumber helper function
import formatNumber from '../helpers/formatNumber.js';
// graph
import Statistic from './graphs/statistic.jsx';
// global styles
import '../styles/helpers.styl';
import '../styles/fonts.styl';

const UI_elements = {
  // these are infinite scroll examples
  InfiniteList,
  InfiniteHorizontalList,
  // auth
  GoogleSignIn,
  // avatars,
  Avatars,
  // buttons
  Button,
  // tooltips
  Tooltip,
  FixedTooltip,
  // dropdowns
  DropdownBase,
  Dropdown,
  SelectDropdown,
  MultiselectDropdown,
  RangeDatepickerDropdown,
  FormDropdown,
  FormSwitchInput,
  // icons
  Icon,
  // datepickers
  SimpleDate,
  SimpleDatepicker,
  RangeDatepicker,
  // inputs
  Textarea,
  FormInput,
  Input,
  Field,
  // radiogroups
  RadioGroup,
  // list
  List,
  RenderItem,
  // details panel
  DetailsPanelScrollable,
  // listing
  Listing,
  // ListingItem,
  // ListingHeader,
  // Labels,
  // RenderRow,
  // RenderHeader,
  // switches
  Switch,
  // checkboxes
  Checkbox,
  // popups
  Popup,
  // notifications
  Notification,
  Warning,
  // searchbars
  InstantSearchbar,
  AutocompleteSearchbar,
  // content dropdowns
  ContentDropdown,
  DropdownAutosuggest,
  DropdownTagEditor,
  DropdownFeed,
  DropdownDatepicker,
  // time
  RelativeTime,
  // feed
  Feed,
  FeedTextarea,
  Autosuggest,
  helpers: {
    formatNumber,
  },
  // links
  Link,
  UploadableLink,
  UploadableBase,
  // calendar
  Calendar,
  // kanban
  Kanban,
  // avatar
  Avatar: Avatars,
  // graph
  Statistic,
};

export default UI_elements;
