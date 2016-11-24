import React, { Component } from 'react'
import { Media, Label, Panel, Button, Collapse, Modal } from 'react-bootstrap'
import castNullToStr from '../../../utils/castNullToStr'
import SupplierListItemForm from './SupplierListItemForm'

class SupplierListItem extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      isFormOpen: false,
      isClosing: false,
      isDialogOpen: false
    }

    this._toggleCollapse = this._toggleCollapse.bind(this)
    this._handleDelete = this._handleDelete.bind(this)
    this._toggleConfirmDialog = this._toggleConfirmDialog.bind(this)
  }

  _toggleCollapse () {
    if (this.state.isFormOpen) {
      this.state.isClosing = true
      setTimeout(() => this.setState({ isClosing: false }), 300)
    }
    this.setState({ isFormOpen: !this.state.isFormOpen })
  }

  _handleDelete () {
    this.props.deleteSupplier(this.props.item)
    this.setState({
      isDialogOpen:false
    })
  }

  _toggleConfirmDialog () {
    this.setState({
      isDialogOpen: !this.state.isDialogOpen
    })
  }

  render () {
    const { name, email, address, tel } = this.props.item

    const confirmDialog = <Modal show={this.state.isDialogOpen}
      onHide={this._toggleConfirmDialog}
      className='delete-product-dialog'>

      <Modal.Header closeButton>
        <Modal.Title>Delete - {name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to <strong>permanently remove {name}</strong> from your venue?
        Please note that this action is irreversible.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this._toggleConfirmDialog}>Cancel</Button>
        <Button bsStyle='danger' onClick={this._handleDelete}>Delete</Button>
      </Modal.Footer>
    </Modal>

    return (
      <Panel>
        <Media>
          <Media.Body>
            <Media.Heading>{name}</Media.Heading>
            <p>
              <Label>{email}</Label>{' '}
              <Label>{address}</Label>{' '}
              <Label>{tel}</Label>
            </p>
          </Media.Body>
          <Media.Right>
            <Button onClick={this._toggleCollapse}>
              {!this.state.isFormOpen ? (
                'Edit'
              ) : (
                'Done'
              )}
            </Button>
          </Media.Right>
          <Collapse in={this.state.isFormOpen}>
            <div>
              <hr />
              {(this.state.isFormOpen || this.state.isClosing) &&
                <div>
                  <SupplierListItemForm
                    form={this.props.item._id}
                    initialValues={{
                      ...castNullToStr(this.props.item)
                    }}
                    onSubmit={this.props.updateSupplier}
                    handleDelete={this._toggleConfirmDialog} />
                  {confirmDialog}
                </div>
              }
            </div>
          </Collapse>
        </Media>
      </Panel>
    )
  }
}

SupplierListItem.propTypes = {
  item: React.PropTypes.shape({
    _id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    email: React.PropTypes.string,
    address: React.PropTypes.string,
    tel: React.PropTypes.string
  }),
  updateSupplier: React.PropTypes.func.isRequired,
  deleteSupplier: React.PropTypes.func.isRequired
}
export default SupplierListItem
