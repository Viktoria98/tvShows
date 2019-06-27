import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Provider } from 'react-redux'
import { render } from 'react-dom';
import App from '../imports/ui/components/App';
import store from '../imports/store/store';

Meteor.startup(() => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root'),
  );
});
