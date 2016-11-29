import React, { Component } from 'react'
import { Button, Alert } from 'react-bootstrap'

import SubHeader from '../../../components/SubHeader'
import AddSupplierDialog from './AddSupplierDialog'
import SupplierListItem from './SupplierListItem'

import './Suppliers.scss'

class Suppliers extends Component {
  componentDidMount () {
    const { venueId, suppliers, fetchSuppliers } = this.props
    // Fetch products if there is new venueId or no products in store yet
    if (
      (venueId && !suppliers.items.length) ||
      // Dirty way to check if the current venue_id is valid, should be other way
      (venueId && venueId !== suppliers.items[0].venue_id)
    ) {
      fetchSuppliers(this.props.venueId)
    }
  }

  componentWillReceiveProps (nextProps) {
    // Only fetch new products for new venue_id
    if (this.props.venueId !== nextProps.venueId) {
      this.props.fetchSuppliers(nextProps.venueId)
    }
  }

  render () {
    const {
      suppliers, venueId, toggleAddNewDialog, fetchCatalog, addSupplier, updateSupplier, deleteSupplier
    } = this.props

    const SupplierList = suppliers.items.map(item =>
      <SupplierListItem
        key={item._id}
        item={item}
        updateSupplier={updateSupplier}
        deleteSupplier={deleteSupplier} />
    )

    const addSupplierDialog = venueId && <AddSupplierDialog
      close={toggleAddNewDialog}
      fetchCatalog={fetchCatalog}
      addSupplier={addSupplier}
      state={suppliers.addNew}
      suppliers={suppliers.items}
      venueId={venueId} />

    return (
      <div className='row'>
        <SubHeader
          className='bg-purple'
          left={<h3>Suppliers</h3>}
          right={
            <div>
              {addSupplierDialog}
              <Button onClick={toggleAddNewDialog} disabled={!venueId}>Add new</Button>
            </div>
          } />

        <div className='col-xs-12 col-sm-10 col-sm-offset-1 products'>

          <div className='items'>
            {!venueId || suppliers.isFetching ? (
              <Alert bsStyle='warning'>Loading...</Alert>
            ) : (
              suppliers.items.length ? (
                SupplierList
              ) : (
                <Alert bsStyle='warning'>No items found.</Alert>
              )
            )}
          </div>

        </div>

      </div>
    )
  }
}

Suppliers.propTypes = {
  fetchSuppliers: React.PropTypes.func.isRequired,
  addSupplier: React.PropTypes.func.isRequired,
  updateSupplier: React.PropTypes.func.isRequired,
  deleteSupplier: React.PropTypes.func.isRequired,
  toggleAddNewDialog: React.PropTypes.func.isRequired,
  fetchCatalog: React.PropTypes.func.isRequired,
  suppliers: React.PropTypes.object.isRequired,
  venueId: React.PropTypes.string
}
export default Suppliers
