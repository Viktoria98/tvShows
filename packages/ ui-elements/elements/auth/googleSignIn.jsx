import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './auth.styl';

const listenerAdded = false;
let googleSignInLoaded = false;

window.triggerGoogleSignInLoaded = () => {
  googleSignInLoaded = true;
  window.dispatchEvent(new Event('google-signin-loaded'));
};

const GoogleSignIn = class extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.renderGoogleLoginButton = this.renderGoogleLoginButton.bind(this);
  }

  renderGoogleLoginButton () {
    const props = { ...this.props };
    delete props.googleMeta;
    window.gapi.signin2.render('button', props);
  }

  componentDidMount () {
    if (!googleScriptEnabled) {
      googleScriptEnabled = true;
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

  render () {
    return (
      <div className="auth">
        { this.props.content ? this.props.content() : (<h1 className="auth__logo">FIREFLY</h1>) }
        <h3 className="auth__title">Sign in</h3>
        <div className="auth__separator" />
        <div id="button" className="auth__button" />
      </div>
    );
  }
};

GoogleSignIn.propTypes = {
  googleMeta: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  longtitle: PropTypes.bool,
  onsuccess: PropTypes.func,
  onfailure: PropTypes.func,
  theme: PropTypes.string,
  content: PropTypes.func,
};

export default GoogleSignIn;
