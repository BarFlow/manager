import React, { Component } from 'react'
import { Panel, Alert, Label } from 'react-bootstrap'

import SubHeader from '../../../components/SubHeader'
import VenueProfileForm from './VenueProfileForm'
import Members from './Members'

import './SettingsView.scss'

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
    const { venues, addVenueMember, updateVenueMember, removeVenueMember } = this.props
    const currentVenue = venues && venues.items.find(item => item._id === venues.current)

    return (
      <div className='row settings'>
        <SubHeader
          className='bg-deepRed'
          left={<h3>Settings</h3>}
          />

        <div className='col-xs-12 col-sm-6 col-sm-offset-1'>
          <Panel>
            <h4>Profile</h4>
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

        <div className='col-xs-12 col-sm-4'>
          <Panel>
            <h4 className='clearfix'>Members</h4>
            <p>The following users have access to this venue. There are multiple access level supported:
              owner, manager, staff.</p>
            {currentVenue
              ? (
                <Members
                  items={currentVenue.members}
                  addVenueMember={addVenueMember}
                  updateVenueMember={updateVenueMember}
                  removeVenueMember={removeVenueMember}
                  venueId={currentVenue._id} />
            ) : (
              <Alert bsStyle='warning'>Loading...</Alert>
            )}
          </Panel>
          <Panel>
            <h4>Invited Users</h4>
            <p>They'll automatically receive access to this venue once they sign up and confirm their email address.</p>
            {currentVenue
              ? currentVenue.invited.map((invited, index) =>
                <Label key={index}>{invited.email} - {invited.role}</Label>
              ) : (
                <Alert bsStyle='warning'>Loading...</Alert>
              )
            }
          </Panel>
        </div>

      </div>
    )
  }
}

SettingsView.propTypes = {
  venues: React.PropTypes.object.isRequired,
  updateVenue: React.PropTypes.func.isRequired,
  addVenueMember: React.PropTypes.func.isRequired,
  updateVenueMember: React.PropTypes.func.isRequired,
  removeVenueMember: React.PropTypes.func.isRequired
}

export default SettingsView
