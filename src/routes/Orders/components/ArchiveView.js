import React, { Component } from 'react'
import { Alert, Button, Panel, Media, Modal, Label } from 'react-bootstrap'

import SubHeader from '../../../components/SubHeader'
import './ArchiveView.scss'

class ArchiveView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      item: {},
      isDialogOpen: false
    }
    this._viewOrder = this._viewOrder.bind(this)
    this._toggleConfirmDialog = this._toggleConfirmDialog.bind(this)
    this._handleDelete = this._handleDelete.bind(this)
    this._deleteOrder = this._deleteOrder.bind(this)
  }

  componentDidMount () {
    const { venueId, fetchOrders } = this.props
    const { items, isFetching } = this.props.orders
    if (
      (venueId && !items.length && !isFetching) ||
      (items[0] && items[0].venue_id !== venueId)
    ) {
      fetchOrders(venueId)
    } else if (items[0] && items[0].venue_id === venueId) {
      // Silent refresh, no isFetching is triggered
      fetchOrders(venueId, true)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { venueId, fetchOrders } = this.props
    if (venueId !== nextProps.venueId) {
      fetchOrders(nextProps.venueId)
    }
  }

  _viewOrder (item) {
    const itemDate = new Date(item.created_at).toString().split(' ').splice(0, 5).join(' ')
    this.props.router.push({
      pathname: `/orders/${item._id}`,
      query: {
        title: itemDate
      }
    })
  }

  _toggleConfirmDialog () {
    this.setState({
      isDialogOpen: !this.state.isDialogOpen
    })
  }

  _handleDelete (item) {
    this.setState({
      item
    })
    this._toggleConfirmDialog()
  }

  _deleteOrder () {
    this.props.deleteOrder(this.state.item._id)
    this._toggleConfirmDialog()
  }

  render () {
    const { items, isFetching } = this.props.orders
    const { venueId, orders } = this.props
    const { location } = this.props.router

    const confirmDialog = <Modal show={this.state.isDialogOpen}
      onHide={this._toggleConfirmDialog}
      className='delete-confirm-dialog'>
      <Modal.Header closeButton>
        <Modal.Title>Delete - Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to <strong>permanently remove</strong> this order from your venue?
        Please note that this action is irreversible.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this._toggleConfirmDialog}>Cancel</Button>
        <Button bsStyle='danger' onClick={this._deleteOrder}>Delete</Button>
      </Modal.Footer>
    </Modal>

    return (
      <div className='row'>
        <SubHeader
          className='bg-green'
          left={<h3>Orders / <span className='small'>Archive</span></h3>} />
        <div className='col-xs-12 col-sm-10 col-sm-offset-1 orders-archive'>

          {confirmDialog}

          {location.query.saved &&
            <Alert bsStyle='success'>
              <strong>Success!</strong> Order sheets have been successfuly created.
            </Alert>
          }

          {!venueId || isFetching ? (
            <Alert bsStyle='warning'>
              Loading...
            </Alert>
          ) : (
            items.length ? (
              items.map((item, index) => {
                const itemDate = new Date(item.created_at).toString().split(' ').splice(0, 5).join(' ')
                const supplier = item.supplier_id && item.supplier_id.name ? item.supplier_id.name : 'Other Supplier'
                const totalInvoiceValue = Math.round(item.total_invoice_value * 100) / 100
                return (
                  <Panel key={index}>
                    <Media>
                      <Media.Body>
                        <Media.Heading>{supplier}</Media.Heading>
                        <Label>{itemDate}</Label>
                        <Label>£{totalInvoiceValue}</Label>
                        <Label>Placed by: {item.placed_by}</Label>
                      </Media.Body>
                      <Media.Right align='middle'>
                        <div className='actions'>
                          <a className='btn btn-default'
                            href={`http://api.stockmate.co.uk/orders/${item._id}/export?token=${this.props.token}`}
                            target='_blank'>Download</a>
                          <Button
                            bsStyle='danger'
                            onClick={(e) => {
                              e.stopPropagation()
                              this._handleDelete({ ...item, name: itemDate })
                            }}
                            disabled={orders.isSaving}>Delete</Button>
                        </div>
                      </Media.Right>
                    </Media>
                  </Panel>
                )
              })
            ) : (
              <Alert bsStyle='warning'>
                There are no orders created for this venue yet.
              </Alert>
            )
          )}
        </div>
      </div>
    )
  }
}

ArchiveView.propTypes = {
  orders: React.PropTypes.object,
  router: React.PropTypes.object.isRequired,
  venueId: React.PropTypes.string,
  token: React.PropTypes.string.isRequired,
  fetchOrders: React.PropTypes.func.isRequired,
  deleteOrder: React.PropTypes.func.isRequired
}

export default ArchiveView
