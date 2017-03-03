import React, { Component } from 'react'
import { Link } from 'react-router'
import { Panel } from 'react-bootstrap'

import SubHeader from '../../../components/SubHeader'
import SignupForm from './SignupForm'
import './Signup.scss'

class Signup extends Component {
  constructor (props) {
    super(props)
    this.formSubmit = this.formSubmit.bind(this)
  }

  formSubmit (values) {
    // setting second param to true for signup
    return this.props.login(values, true)
  }

  render () {
    return (
      <div className='row signup'>
        <SubHeader
          className='bg-grey'
          left={<h3>Sign Up</h3>}
          />
        <div className='col-sx-12 col-sm-6 col-sm-offset-3'>
          <Panel>
            <SignupForm onSubmit={this.formSubmit} form='signup' />
          </Panel>
          <div className='text-center'>
            <span>Or if you do have an account:</span>
            <Link to='/login'>Log in here</Link>
          </div>
        </div>
      </div>
    )
  }
}

Signup.propTypes = {
  login   : React.PropTypes.func.isRequired
}

export default Signup
