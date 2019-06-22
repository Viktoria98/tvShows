const getRelativeParent = function (element) {
  if (!element) {
    return null;
  }
  const position = window.getComputedStyle(element)
    .getPropertyValue('position');
  if (position !== 'static') {
    return element;
  }
  return getRelativeParent(element.parentElement);
};

const positionSuggestions = function (_ref) {
  const popupWidth = 220;
  const itemHeight = 40;
  const decoratorRect = _ref.decoratorRect;
  const popover = _ref.popover;
  const state = _ref.state;
  const props = _ref.props;

  const relativeParent = getRelativeParent(popover.parentElement);
  const relativeRect = {};

  const absoluteHeight = decoratorRect.top;

  if (relativeParent) {
    relativeRect.scrollLeft = relativeParent.scrollLeft;
    relativeRect.scrollTop = relativeParent.scrollTop;

    const relativeParentRect = relativeParent.getBoundingClientRect();
    relativeRect.left = decoratorRect.left - relativeParentRect.left;
    relativeRect.top = decoratorRect.top - relativeParentRect.top;
  } else {
    relativeRect.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    relativeRect.scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    relativeRect.top = decoratorRect.top;
    relativeRect.left = decoratorRect.left;
  }

  relativeRect.height = props.suggestions.size * itemHeight + 8;

  const windowRect = {
    height: window.innerHeight,
    width: window.innerWidth,
  };

  let left = relativeRect.left + relativeRect.scrollLeft;
  let top = relativeRect.top + relativeRect.scrollTop;

  if (absoluteHeight + relativeRect.height > windowRect.height) {
    top = top - relativeRect.height - 40;
  }

  if (left + popupWidth > windowRect.width) {
    left = windowRect.width - popupWidth;
  }

  let transform = void 0;
  let transition = void 0;
  if (state.isActive) {
    if (props.suggestions.size > 0) {
      transform = 'scale(1)';
      transition = 'all 0.25s cubic-bezier(.3,1.2,.2,1)';
    } else {
      transform = 'scale(0)';
      transition = 'all 0.35s cubic-bezier(.3,1,.2,1)';
    }
  }

  return {
    left: `${left}px`,
    top: `${top}px`,
    transform,
    transformOrigin: '1em 0%',
    transition,
  };
};

export default positionSuggestions;
