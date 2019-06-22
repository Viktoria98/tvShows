import NotificationsEvents from './NotificationsEvents';

export default class extends NotificationsEvents {
  static notification (message, type, loading, shutdown = false, force) {
    this.notificationsEvent(message, type, loading, shutdown, force);
  }

  static notificationHide () {
    this.notificationsEvent(null, null, null, true);
  }
}
