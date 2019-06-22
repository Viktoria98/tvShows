export default function (store) {
  switch (Action.type()) {
    case 'NOTIFICATION':
      if (Action.kind === 'error') {
        NProgress.done();
      }
      store.notification(Action.message, Action.kind, Action.loading, false, Action.force);
      break;
    case 'HIDE_NOTIFICATION':
      store.notificationHide();
      break;
    default:
      break;
  }
}
