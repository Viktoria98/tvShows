/* disable eslint for long paragraph */
/* eslint-disable max-len */

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const RestorePassword = (props) => ( // eslint-disable-line
  <form className="auth" onSubmit={props.submit}>
    <div className={classNames('form', { '-visible': props.visible })}>
      <div className="logo" />
      <div className="name">Reset password</div>
      <div className="divider" />
      <p>Enter the email address you used when you joined and we’ll send you instructions to reset your password.</p>
      <input
        className="form__input"
        type="email"
        placeholder="Your email"
        onChange={props.onEmailChange}
      />
      <button className="button -primary submit">Send reset instructions</button>
      <button className="button -ghost" onClick={props.showSignIn}>Return</button>
    </div>
  </form>
);

RestorePassword.propTypes = {
  visible: PropTypes.bool,
  submit: PropTypes.func,
  showSignIn: PropTypes.func,
  onEmailChange: PropTypes.func,
};

export default RestorePassword;
