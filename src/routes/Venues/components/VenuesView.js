import React, { Component } from 'react'
import { Panel, Button, Alert, Modal } from 'react-bootstrap'
import { browserHistory } from 'react-router'

import SubHeader from '../../../components/SubHeader'
import VenueProfileForm from '../../Settings/components/VenueProfileForm'

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
      <div className='row'>
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
            <Alert bsStyle='warning'>
              It looks like you are not a meber of any venue yet,
              {' '}create one now or ask your manager to add you to one.</Alert>
          }
          {!venues.isFetching && venues.items.map(venue =>
            <Panel key={venue._id}>
              <h5>{venue.profile.name}</h5>
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
