import { EventEmitter } from 'meteor/raix:eventemitter';

const notificationEvent = new EventEmitter();
notificationEvent.setMaxListeners(0);

export default class {
  static notificationsEvent (message, type, loading, shutdown, force) {
    notificationEvent.emit('notification', message, type, loading, shutdown, force);
  }

  static addNotificationsListener (callback) {
    notificationEvent.on('notification', callback);
  }

  static removeNotificationsListener (callback) {
    notificationEvent.removeListener('notification', callback);
  }
}
