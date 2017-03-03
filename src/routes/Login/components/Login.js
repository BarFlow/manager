import React, { Component } from 'react'
import { Link } from 'react-router'

import SubHeader from '../../../components/SubHeader'
import LoginForm from './LoginForm'
import './Login.scss'

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
      <div className='row login'>
        <SubHeader
          className='bg-grey'
          left={<h3>Log In</h3>}
          />
        <div className='col-sx-12 col-sm-6 col-sm-offset-3'>
          <LoginForm onSubmit={this.formSubmit} />
          <div className='text-center'>
            <span>Or if you do not have an account:</span>
            <Link to='/signup'>Sign up now</Link>
          </div>
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  userLogin   : React.PropTypes.func.isRequired
}

export default Login
