import PropTypes from 'prop-types';
import React, { Component } from 'react';

let listenerAdded = false;
let googleSignInLoaded = false;


/**
 * fix for bug https://trendmd.fireflylabs.co/firefly/admin-dashboard/issues/1093
 * this code should be removed when
 * https://bugs.chromium.org/p/chromium/issues/detail?id=723655 resolved
 */
const openex = window.open;
window.open = function (a, b, c) {
  if (a.startsWith('https://accounts.google.com/o/oauth2/auth')) {
    const openParams = 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=599,height=600,top=150,left=500.5';
    return openex(a, b, openParams);
  }
  return openex(a, b, c);
};
// end fix for bug https://trendmd.fireflylabs.co/firefly/admin-dashboard/issues/1093

window.triggerGoogleSignInLoaded = () => {
  googleSignInLoaded = true;
  window.dispatchEvent(new Event('google-signin-loaded'));
};

const GoogleSignIn = class extends Component { // eslint-disable-line
  constructor (props) {
    super(props);
    this.renderGoogleLoginButton = this.renderGoogleLoginButton.bind(this);
  }

  componentDidMount () {
    if (!listenerAdded) {
      listenerAdded = true;
      window.addEventListener('google-signin-loaded', this.renderGoogleLoginButton);
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://apis.google.com/js/platform.js?onload=triggerGoogleSignInLoaded';
      script.async = true;
      script.defer = true;
      document.getElementsByTagName('head')[0].appendChild(script);
      const meta = document.createElement('meta');
      meta.name = 'google-signin-client_id';
      meta.content = this.props.googleMeta;
      document.getElementsByTagName('head')[0].appendChild(meta);
    } else if (googleSignInLoaded) {
      this.renderGoogleLoginButton();
    }
  }

  componentWillUnmount () {
    document.getElementsByTagName('body')[0].appendChild(document.getElementById('my-signin2'));
    document.getElementById('my-signin2').style.display = 'none';
  }

  renderGoogleLoginButton () {
    const props = { ...this.props };
    delete props.googleMeta;
    if (!document.getElementsByClassName('abcRioButtonContentWrapper')[0]) {
      window.gapi.signin2.render('my-signin2', props);
    } else {
      document.getElementsByClassName('auth')[0].appendChild(document.getElementById('my-signin2'));
      document.getElementById('my-signin2').style.display = 'block';
    }
  }
  render () {
    return document.getElementById('my-signin2') ? null : <div id="my-signin2" />;
  }
};

GoogleSignIn.propTypes = {
  googleMeta: PropTypes.string,
};

export default GoogleSignIn;
