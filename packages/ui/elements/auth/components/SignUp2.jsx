import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import AccTypeIcon from './AccountTypeIcons';

function findAncestor (el, cls) {
  let ell = el;
  while (ell.parentElement && !ell.classList.contains(cls)) {
    ell = ell.parentElement;
  }
  return ell;
}

export default class SignUp2 extends React.Component { // eslint-disable-line
  constructor (props) {
    super(props);
    this.selectAccType = this.selectAccType.bind(this);
    this.state = {
      checkedAccType: null,
    };
  }

  selectAccType (event) {
    let clickedBox = '';
    if (event.target.classList.contains('accType__type')) {
      clickedBox = event.target;
    } else {
      clickedBox = findAncestor(event.target, 'accType__type');
    }
    const selectedAccType = clickedBox.querySelector('h3').innerText.toLowerCase();
    if (this.state.checkedAccType !== selectedAccType) {
      if (this.props.onTypeChange) {
        this.props.onTypeChange(selectedAccType);
      }
      this.setState({ checkedAccType: selectedAccType });
    }
  }

  render () {
    return (
      <form className="auth" onSubmit={this.props.submit}>
        <div className={classNames('form', { '-visible': 'true' })}>
          <div className="logo" />
          <div className="name">request a demo</div>
          <div className="divider" />
          <p>What best describes you?</p>
          <div className="accType">
            <div
              className={classNames('accType__type', { '-checked': this.state.checkedAccType === 'author' })}
              onClick={this.selectAccType}
            >
              <div className="accType__type__icon">
                <AccTypeIcon iconType="author" />
              </div>
              <h3>Author</h3>
              <p>
                Researcher, professor, postdoc, grad student,physician, healthcare practitioner
              </p>
            </div>
            <div
              className={classNames('accType__type', { '-checked': this.state.checkedAccType === 'publisher' })}
              onClick={this.selectAccType}
            >
              <div className="accType__type__icon">
                <AccTypeIcon iconType="publisher" />
              </div>
              <h3>Publisher</h3>
              <p>Journal, website, blog, mobile app</p>
            </div>
            <div
              className={classNames('accType__type', { '-checked': this.state.checkedAccType === 'institution' })}
              onClick={this.selectAccType}
            >
              <div className="accType__type__icon">
                <AccTypeIcon iconType="institution" />
              </div>
              <h3>Institution</h3>
              <p>
                University, college, granting agency, library physician, healthcare practitioner
              </p>
            </div>
            <div
              className={classNames('accType__type', { '-checked': this.state.checkedAccType === 'industry' })}
              onClick={this.selectAccType}
            >
              <div className="accType__type__icon">
                <AccTypeIcon iconType="industry" />
              </div>
              <h3>Industry</h3>
              <p>Pharma, biotech, tech, ad agency</p>
            </div>
          </div>
          <p>What is your organization?</p>
          <input
            className="form__input"
            type="string"
            placeholder="Organization name"
            onChange={this.props.onCompanyChange}
          />
          <button className="button -primary submit" >finish</button>
        </div>
      </form>);
  }
}

SignUp2.propTypes = {
  submit: PropTypes.func,
  onCompanyChange: PropTypes.func,
  onTypeChange: PropTypes.func,
};
