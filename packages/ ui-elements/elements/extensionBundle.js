// Temporary solution for gmail extension UI components, since we have problems with webpack bundle
import Listing from './listing/listing.jsx';

import RenderRow from './listing/render/renderRow.jsx';
import RenderHeader from './listing/render/renderHeader.jsx';

import MultiselectDropdown from './dropdowns/menuDropdowns/components/multiselectDropdown.jsx';

const UI_elements = {
  Listing,
  RenderRow,
  RenderHeader,
  MultiselectDropdown,
};

// Separate styles
import '../styles/extensionFonts.styl';

export default UI_elements;
