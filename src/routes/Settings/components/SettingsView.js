import React, { Component } from 'react'
import { Panel, Alert } from 'react-bootstrap'

import SubHeader from '../../../components/SubHeader'
import VenueProfileForm from './VenueProfileForm'

class SettingsView extends Component {
  constructor (props) {
    super(props)

    this._handleProfileFormSubmit = this._handleProfileFormSubmit.bind(this)
  }

  _handleProfileFormSubmit (values) {
    const { venues, updateVenue } = this.props
    const currentVenue = venues.items.find(item => item._id === venues.current)
    return updateVenue({
      ...currentVenue,
      profile: values
    })
  }

  render () {
    const { venues } = this.props
    const currentVenue = venues && venues.items.find(item => item._id === venues.current)

    return (
      <div className='row'>
        <SubHeader
          className='bg-deepRed'
          left={<h3>Settings</h3>}
          />

        <div className='col-xs-12 col-sm-10 col-sm-offset-1 settings'>
          <Panel>
            {currentVenue ? (
              <VenueProfileForm
                form='settings'
                enableReinitialize
                initialValues={currentVenue.profile}
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
  venues: React.PropTypes.object.isRequired,
  updateVenue: React.PropTypes.func.isRequired
}

export default SettingsView
