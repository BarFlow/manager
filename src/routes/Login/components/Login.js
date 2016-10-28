import React, { Component } from 'react'
import LoginForm from './LoginForm'

class Login extends Component {
  constructor (props) {
    super(props)
    this.formSubmit = this.formSubmit.bind(this)
  }

  formSubmit (values) {
    return this.props.userLogin(values)
  }

  render () {
    return (
      <div>
        <LoginForm onSubmit={this.formSubmit} />
      </div>
    )
  }
}

Login.propTypes = {
  userLogin   : React.PropTypes.func.isRequired
}

export default Login
