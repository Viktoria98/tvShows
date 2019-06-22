import _ from 'lodash';
import React from 'react';
import createReactClass from 'create-react-class';
import Notifications from './Notifications';
import BaseMixin from '../../general/mixins/BaseMixin';
import NotificationsStore from '../stores/NotificationsStore';

export default createReactClass({
  displayName: 'NotificationsApp',

  mixins: [BaseMixin(NotificationsStore)],

  getInitialState () {
    return {
      active: false,
      message: null,
      type: null,
    };
  },

  componentDidMount () {
    this.store()
      .addNotificationsListener(this.onNotification);
  },

  onNotification (message, kind, loading, shutdown, force) {
    if (this.lastMessageKind === `${message}${kind}` && !force) {
      return;
    }
    this.lastMessageKind = `${message}${kind}`;

    if (shutdown) {
      clearTimeout(this.timeout);
      this.resetState();
    } else {
      const alertTypes = ['alert', 'error', 'info', 'success'];
      let notificationMessage;


      if (this.state.active && this.state.type == '-error') { // eslint-disable-line
        if (kind !== 'alert') {
          return;
        }
      }
      clearTimeout(this.timeout);
      if (loading) {
        notificationMessage = 'Loading...';

        if (typeof loading === 'string') {
          notificationMessage = loading;
        }
      } else {
        notificationMessage = message;
      }

      this.setState({
        active: true,
        message: notificationMessage,
        type: _.includes(alertTypes, kind) ? `-${kind}` : '',
      }, () => {
        if (!loading) {
          this.timeout = setTimeout(() => this.resetState(), 5000);
        }
      });
    }
  },

  lastMessageKind: '',

  resetState () {
    this.setState({
      active: false,
      message: null,
      type: null,
    });
    this.lastMessageKind = '';
  },

  render () {
    return (
      <Notifications
        active={this.state.active}
        message={this.state.message}
        type={this.state.type}
      />
    );
  },
});
