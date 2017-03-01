import React, { Component } from 'react'
import { Panel, Alert } from 'react-bootstrap'

import SubHeader from '../../../components/SubHeader'
import UserProfileForm from './UserProfileForm'

class SettingsView extends Component {
  constructor (props) {
    super(props)

    this._handleProfileFormSubmit = this._handleProfileFormSubmit.bind(this)
  }

  _handleProfileFormSubmit (values) {
    return this.props.updateUser({
      ...values,
      rePassword: undefined
    })
  }

  render () {
    const { auth } = this.props

    return (
      <div className='row'>
        <SubHeader
          className='bg-grey'
          left={<h3>Profile</h3>}
          />

        <div className='col-xs-12 col-sm-6 col-sm-offset-3'>
          <Panel>
            {auth.user ? (
              <UserProfileForm
                form='settings'
                enableReinitialize
                initialValues={auth.user}
                onSubmit={this._handleProfileFormSubmit} />
            ) : (
              <Alert bsStyle='warning'>Loading...</Alert>
            )}
          </Panel>
        </div>

      </div>
    )
  }
}

SettingsView.propTypes = {
  auth: React.PropTypes.object.isRequired,
  updateUser: React.PropTypes.func.isRequired
}

export default SettingsView
