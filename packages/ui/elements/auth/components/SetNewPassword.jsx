import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const SetNewPassword = (props) => ( // eslint-disable-line
  <form className="auth" onSubmit={props.submit}>
    <div className={classNames('form', { '-visible': props.visible })}>
      <div className="logo" />
      <div className="name">Choose a password</div>
      <div className="divider" />
      <input
        className="form__input"
        type="password"
        placeholder="Please choose a password"
        ref="password"
        onChange={props.onPasswordChange}
      />
      <button
        className="button -primary"
        onClick={props.submitSetNewPassword}
      >
        reset password
      </button>
    </div>
  </form>
);

SetNewPassword.propTypes = {
  visible: PropTypes.bool,
  submit: PropTypes.func,
  onPasswordChange: PropTypes.func,
  submitSetNewPassword: PropTypes.func,
};

export default SetNewPassword;
