import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Form from '../../form/components/Form';
import FormCheckbox from '../../form/components/FormCheckbox';
import FormTextfield from '../../form/components/FormTextfield';
import GoogleSignIn from './GoogleSignIn';

const SignIn = class extends Component { // eslint-disable-line
  constructor (props) {
    super(props);
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      passwordTooltipIsVisible: false,
    };
  }

  change (value, name) {
    SignIn.data[name] = value;
  }

  submit () {
    if (typeof this.props.submit === 'function') {
      this.props.submit(SignIn.data);
    }
  }

  reset () {
    SignIn.data = {
      email: '',
      password: '',
      remember: false,
    };
  }

  showSignUp (event) {
    if (this.props.signUpLink) {
      this.refs.signUpLink.click();
    } else {
      event.preventDefault();
      window.location.href = '/signup';
    }
  }

  render () {
    let rememberMe;
    let googleSignIn;
    let forgotYourPassword;
    let signUp = '';
    let signUpLink = '';
    let loginPasswordForm;
    let orDivider;

    if (this.props.rememberMe) {
      rememberMe = (
        <div className="remember">
          <FormCheckbox
            key="signIn"
            ref="remember"
            label="Remember me"
            name="remember"
            change={this.change}
          />
        </div>
      );
    }

    if (this.props.forgotYourPassword) {
      forgotYourPassword = (
        <div>
          <span className="link" onClick={this.props.showRestorePassword}>
            Forgot your password?
          </span>
        </div>
      );
    }

    if (this.props.signUp) {
      if (this.props.signUpLink) {
        signUpLink = (
          <a ref="signUpLink" className="blue" href={this.props.signUpLink}> Sign up</a>
        );
      } else {
        signUpLink = (<span className="blue"> Sign up</span>);
      }
      signUp = (
        <button className="button -ghost" onClick={(event) => this.showSignUp(event)}>
          Don&prime;t have an account?
          {signUpLink}
        </button>
      );
    }

    if (this.props.googleSignIn) {
      googleSignIn = (
        <div className="google-signin" style={{ marginBottom: '1.8em' }}>
          <GoogleSignIn
            onsuccess={this.props.submitGoogleSignIn}
            width={362}
            height={52}
            theme={'light'}
            longtitle
            googleMeta={this.props.googleMeta}
          />
        </div>
      );
    }

    if (this.props.loginPasswordForm) {
      loginPasswordForm = (
        <div>
          <FormTextfield
            key="email"
            name="email"
            placeholder="Your email"
            change={this.change}
            chromeAutofillAllowed
          />
          <FormTextfield
            key="password"
            name="password"
            type="password"
            placeholder="Password"
            change={this.change}
            chromeAutofillAllowed
          />
          <div className="form__row">
            {rememberMe}
            {forgotYourPassword}
          </div>
          <button
            className="button -primary submit"
            onClick={this.props.submitSignIn}
          >
            Sign in
          </button>
        </div>
      );
    }

    if (this.props.googleSignIn && this.props.loginPasswordForm) {
      orDivider = (<div className="or-divider">or</div>);
    }

    return (
      <Form class="auth" submit={this.submit}>
        <div className="logo" />
        <div className="name">Sign in</div>
        <div className="divider" />
        {googleSignIn}
        {orDivider}
        {loginPasswordForm}
        {signUp}
      </Form>
    );
  }
};

SignIn.data = {
  email: '',
  password: '',
  remember: false,
};

SignIn.propTypes = {
  submit: PropTypes.func,
  signUp: PropTypes.string,
  signUpLink: PropTypes.string,
  rememberMe: PropTypes.string,
  googleSignIn: PropTypes.string,
  forgotYourPassword: PropTypes.string,
  showSignUp: PropTypes.func, // eslint-disable-line
  submitSignIn: PropTypes.func,
  submitGoogleSignIn: PropTypes.func,
  showRestorePassword: PropTypes.func,
  chromeAutofillAllowed: PropTypes.bool, // eslint-disable-line
  loginPasswordForm: PropTypes.bool,
  googleMeta: PropTypes.string,
};

export default SignIn;
