import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { Dispatch as dispatch } from 'meteor/meteorflux:meteorflux';

const Form = class extends Component {
  constructor (props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {
      children: null,
    };
  }

  submit (event) {
    const submitProp = this.props.submit;

    event.preventDefault();
    if (typeof submitProp === 'function') {
      submitProp(event);
    }
    if (!submitProp) {
      dispatch('FORM_SUBMIT');
    }
  }

  render () {
    return (
      <form onSubmit={this.submit} className={classNames(this.props.class, 'form')}>
        {this.props.children}
      </form>
    );
  }
};

Form.displayName = 'Form';

Form.propTypes = {
  children: PropTypes.node,
  class: PropTypes.string,
  submit: PropTypes.func,
};

export default Form;
