import _ from 'lodash';
import ReactDOM from 'react-dom';
import { Dispatch as dispatch } from 'meteor/meteorflux:meteorflux';
import Classes from '../../../constants/classes';

export default function BasePopupMixin (...targets) {
  return {
    getInitialState () {
      return {
        open: (
          this.store().popup.open
          && this.isTargeted()
        ),
      };
    },

    // find all tabbable elements in popup
    // return object
    findTabbableElements (popup) {
      // find first tabbable element, that was rendered (recursive)
      function findFirstElement (nodeList, index) {
        const i = index || 0;
        const firstEl = nodeList[index];
        if (!firstEl) {
          return false;
        }
        if (firstEl.getBoundingClientRect().width) {
          return firstEl;
        }
        return findFirstElement(nodeList, i + 1);
      }

      const tabElements = {};
      tabElements.list = popup.querySelectorAll('a, input:not(:disabled), textarea, button:not(:disabled), select');
      tabElements.firstElement = findFirstElement(tabElements.list, 0);
      tabElements.lastElement = tabElements.list[tabElements.list.length - 1];
      return tabElements;
    },

    // lock tabs in popup only
    lockTabs (event, keyCodes) {
      const popup = event.currentTarget;
      const tabbedEls = this.findTabbableElements(popup);

      // if user tabbed forward on last element (pressed TAB)
      if (
        event.keyCode === keyCodes.TAB
        && event.target === tabbedEls.lastElement
        && !event.shiftKey
      ) {
        event.preventDefault();
        tabbedEls.firstElement.focus();
      }
      // if user tabbed backward on first element (pressed SHIFT+TAB)
      if (
        event.keyCode === keyCodes.TAB
        && event.target === tabbedEls.firstElement
        && event.shiftKey
      ) {
        event.preventDefault();
        tabbedEls.lastElement.focus();
      }
    },

    keydownHandler (event) {
      const keyCodes = {
        TAB: 9,
      };
      if (event.keyCode === keyCodes.TAB) {
        this.lockTabs(event, keyCodes);
      }
    },

    componentDidMount () {
      const popup = this.store().popup;
      if (!popup.fromRedirect && !popup.open) {
        popup.open = false;
        this.store().form = {};
        this.onPopupChangeState();
      }

      this
        .store()
        .addElementListener(this.onPopupChangeState);

      ReactDOM
        .findDOMNode(this)
        .addEventListener('keydown', this.keydownHandler);
    },

    componentWillUnmount () {
      this
        .store()
        .removeElementListener(this.onPopupChangeState);

      const node = ReactDOM
        .findDOMNode(this);
      if (node) {
        node
          .removeEventListener('keydown', this.keydownHandler);
      }
    },

    focusFirst () {
      const popup = ReactDOM.findDOMNode(this);
      if (!popup) {
        return;
      }
      const tabbedEls = this.findTabbableElements(popup);
      if (tabbedEls.firstElement) {
        tabbedEls.firstElement.focus();
      }
      this.state.focusFirst = false;
    },

    componentDidUpdate (prevProps, prevState) {
      if (!prevState.open && this.state.open) {
        this.focusFirst();
      }
    },

    isTargeted () {
      const target = _.get(this.store(), ['popup', 'target']);
      return _.includes(targets, target);
    },

    isEdit () {
      return _.get(this.store(), ['popup', 'target']) === 'edit';
    },

    onPopupChangeState () {
      if (targets.length && !this.isTargeted()) {
        return;
      }
      this.setState({
        open: this.store().popup.open,
      }, () => {
        const needReopen = (
          !this.state.open
          || (
            this.state.open
            && this.state.allowReopenOpened
          )
        );
        if (
          _.isFunction(this.onOpenClose)
          && needReopen
        ) {
          this.onOpenClose(this.state.open);
        }
      });
    },

    scrollToFirstErrorField () {
      this.scrollToFirstSelector(`.${Classes.FORM_GROUP_ERROR}`);
    },

    scrollToFirstSelector (selector) {
      const firstEl = document.querySelector(selector);
      if (firstEl) {
        firstEl.scrollIntoView();
      }
    },

    close () {
      dispatch('CLOSE_POPUP');
    },
  };
}
