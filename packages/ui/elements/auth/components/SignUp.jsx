import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Checkbox from '../../checkboxes/components/Checkbox';

export default class SignUp extends React.Component { // eslint-disable-line
  constructor (props) {
    super(props);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.state = {
      passwordTooltipIsVisible: false,
    };
  }

  toggleTooltip () {
    if (!this.state.passwordTooltipIsVisible) {
      this.setState({ passwordTooltipIsVisible: true });
    } else {
      this.setState({ passwordTooltipIsVisible: false });
    }
  }

  render () {
    return (<form className="auth" onSubmit={this.props.submit}>
      <div className={classNames('form', { '-visible': 'true' })}>
        <div className="logo" />
        <div className="name">request a demo</div>
        <div className="divider" />
        <input
          className="form__input"
          type="email"
          placeholder="Your email"
          onChange={this.props.onEmailChange}
        />
        <input
          className="form__input"
          type="string"
          placeholder="First name"
          onChange={this.props.onFirstNameChange}
        />
        <input
          className="form__input"
          type="string"
          placeholder="Last name"
          onChange={this.props.onLastNameChange}
        />
        <input
          className="form__input"
          type="string"
          placeholder="Phone"
          onChange={this.props.onPhoneChange}
          onFocus={this.toggleTooltip}
          onBlur={this.toggleTooltip}
        />
        <input
          className="form__input"
          type="password"
          placeholder="Password"
          onChange={this.props.onPasswordChange}
        />

        {/* Password tooltip */}
        <div className={classNames('tooltip -phone', { '-visible': this.state.passwordTooltipIsVisible })} >
          <span>
            Used for on-boarding and widget installation guidance.
            Customer on-boarding is much faster and smoother over a quick voice call.
          </span>
        </div>

        <div className="remember">
          <Checkbox label="I agree with" onCheck={(value) => this.props.onCheckbox(value)} />
          <a href={this.props.termsLink} className="terms">{this.props.termsName}</a>
        </div>
        <button className="button -primary submit" >request a demo</button>
        <button className="button -ghost" onClick={(event) => this.props.showSignIn(event)}>
          Already have an account?
          <span className="blue"> Sign in</span>
        </button>
      </div>
    </form>);
  }
}

SignUp.propTypes = {
  showSignIn: PropTypes.func,
  termsLink: PropTypes.string,
  termsName: PropTypes.string,
  submit: PropTypes.func,
  onCheckbox: PropTypes.func,
  onEmailChange: PropTypes.func,
  onPhoneChange: PropTypes.func,
  onFirstNameChange: PropTypes.func,
  onLastNameChange: PropTypes.func,
  onPasswordChange: PropTypes.func,
};
