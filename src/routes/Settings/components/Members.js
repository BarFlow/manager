import React, { Component } from 'react'
import { Label, Button, Modal } from 'react-bootstrap'

import MemberForm from './MemberForm'

class Members extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isFormDialogOpen: false,
      isConfimDialogOpen: false,
      member: {}
    }

    this._toggleFormDialog = this._toggleFormDialog.bind(this)
    this._handleMemberFormSubmit = this._handleMemberFormSubmit.bind(this)
    this._handleMemberRemove = this._handleMemberRemove.bind(this)
    this._toggleConfirmDialog = this._toggleConfirmDialog.bind(this)
  }

  _toggleFormDialog (member) {
    this.setState({
      isFormDialogOpen: !this.state.isFormDialogOpen,
      member: member || {}
    })
  }

  _handleMemberFormSubmit (values) {
    const method = values._id ? 'updateVenueMember' : 'addVenueMember'
    const payload = {
      ...values,
      venue_id: this.props.venueId
    }
    return this.props[method](payload).then(() => this._toggleFormDialog())
  }

  _toggleConfirmDialog (member) {
    this.setState({
      isConfimDialogOpen: !this.state.isConfimDialogOpen,
      member: member || {}
    })
  }

  _handleMemberRemove () {
    const payload = {
      ...this.state.member,
      venue_id: this.props.venueId
    }

    this.props.removeVenueMember(payload).then(() => this._toggleConfirmDialog())
  }

  render () {
    const { items } = this.props
    const formDialog = <Modal show={this.state.isFormDialogOpen} onHide={this._toggleFormDialog}>
      <Modal.Header closeButton>
        <Modal.Title>Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MemberForm
          form='memberForm'
          initialValues={this.state.member}
          isUpdate={!!this.state.member._id}
          onSubmit={this._handleMemberFormSubmit}
          onCancel={this._toggleFormDialog} />
      </Modal.Body>
    </Modal>

    const comfirmDialog = <Modal show={this.state.isConfimDialogOpen} onHide={this._toggleConfirmDialog}>
      <Modal.Header closeButton>
        <Modal.Title>Remove Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure that you want to remove <strong>{this.state.member.name}</strong> from this venue?
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this._toggleConfirmDialog}>Cancel</Button>
        <Button bsStyle='danger' onClick={this._handleMemberRemove}>Remove</Button>
      </Modal.Footer>
    </Modal>

    return (
      <div>
        {comfirmDialog}
        {formDialog}
        {items.map((member, index) =>
          <div key={index} className='member'>
            <h5>{member.user.name}
              <Button bsSize='xsmall'
                className='pull-right'
                onClick={(e) => this._toggleFormDialog({
                  _id: member._id,
                  email: member.user.email,
                  role: member.role
                })}>Edit</Button>
              <Button
                bsSize='xsmall'
                bsStyle='danger'
                className='pull-right'
                onClick={(e) => this._toggleConfirmDialog({
                  _id: member._id,
                  email: member.user.email,
                  name: member.user.name,
                  role: member.role
                })}>Remove</Button>
            </h5>
            <Label>{member.role}</Label>
            <Label>{member.user.email}</Label>
          </div>
      )}
        <div className='form-footer'>
          <Button onClick={(e) => this._toggleFormDialog()}>Add New</Button>
        </div>
      </div>
    )
  }
}

Members.propTypes = {
  items: React.PropTypes.array.isRequired,
  addVenueMember: React.PropTypes.func.isRequired,
  updateVenueMember: React.PropTypes.func.isRequired,
  removeVenueMember: React.PropTypes.func.isRequired,
  venueId: React.PropTypes.string.isRequired
}

export default Members
