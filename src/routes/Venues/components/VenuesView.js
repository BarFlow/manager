import React, { Component } from 'react'
import { Panel, Button, Alert, Modal, Label } from 'react-bootstrap'
import { browserHistory, Link } from 'react-router'

import SubHeader from '../../../components/SubHeader'
import VenueProfileForm from '../../Settings/components/VenueProfileForm'

import './VenuesView.scss'

class VenuesView extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isCreateVenueDialogOpen: false
    }

    this._toggleCreateVenueDialog = this._toggleCreateVenueDialog.bind(this)
    this._handleVenueCreate = this._handleVenueCreate.bind(this)
  }

  componentDidMount () {
    this.props.fetchVenues()
  }

  _toggleCreateVenueDialog () {
    this.setState({
      isCreateVenueDialogOpen: !this.state.isCreateVenueDialogOpen
    })
  }

  _handleVenueCreate (profile) {
    return this.props.addVenue({
      profile
    }).then(() => {
      this._toggleCreateVenueDialog()
      browserHistory.push('/')
    })
  }

  render () {
    const { venues } = this.props

    const createVenueDialog =
      <Modal show={this.state.isCreateVenueDialogOpen} onHide={this._toggleCreateVenueDialog}>
        <Modal.Header closeButton>
          <Modal.Title>Create Venue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <VenueProfileForm
            form='venueProfileForm'
            onSubmit={this._handleVenueCreate}
            onCancel={this._toggleCreateVenueDialog} />
        </Modal.Body>
      </Modal>

    return (
      <div className='row venues'>
        {createVenueDialog}
        <SubHeader
          className='bg-grey'
          left={<h3>Venues</h3>}
          right={<Button onClick={this._toggleCreateVenueDialog}>Create Venue</Button>}
          />

        <div className='col-xs-12 col-sm-6 col-sm-offset-3'>
          {venues.isFetching &&
            <Alert bsStyle='warning'>Loading...</Alert>
          }
          {!venues.isFetching && !venues.items.length &&
            <Alert bsStyle='info'>
              <strong>Welcome!</strong> It looks like you are not a member of any venue yet.
              {' '}Create one now or ask your manager to add you to one.</Alert>
          }
          {!venues.isFetching && venues.items.map(venue =>
            <Panel key={venue._id}>
              {venue.role === 'staff' ? (
                <h4>
                  <span style={{ cursor: 'not-allowed' }}>{venue.profile.name}</span>
                  {' '}<Label bsStyle='info'>{venue.role}</Label></h4>
              ) : (
                <h4>
                  <Link to={`/stock/reports/live?venue_id=${venue._id}`}>
                    {venue.profile.name}
                  </Link>{' '}<Label bsStyle='info'>{venue.role}</Label>
                </h4>
              )}
              <Label>{venue.profile.email}</Label>
              <Label>{venue.profile.tel}</Label>
              <Label>{venue.profile.type}</Label>
              <Label>{venue.profile.address}</Label>
            </Panel>
          )}
        </div>
      </div>
    )
  }
}

VenuesView.propTypes = {
  venues: React.PropTypes.object.isRequired,
  fetchVenues: React.PropTypes.func.isRequired,
  addVenue: React.PropTypes.func.isRequired
}

export default VenuesView
