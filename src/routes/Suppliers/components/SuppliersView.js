import React, { Component } from 'react'
import { Button, Alert } from 'react-bootstrap'

import SubHeader from '../../../components/SubHeader'
import AddSupplierDialog from './AddSupplierDialog'
import SupplierListItem from './SupplierListItem'

import './Suppliers.scss'

class Suppliers extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.fetchSuppliers = this.props.fetchSuppliers.bind(this)
    this.updateSupplier = this.props.updateSupplier.bind(this)
    this.deleteSupplier = this.props.deleteSupplier.bind(this)
  }

  componentDidMount () {
    // Fetch products if there is new venueId or no products in store yet
    if ((this.props.venueId &&
      !this.props.suppliers.items.length) ||
      (this.props.venueId &&
      // Dirty way to check if the current venue_id is valid, should be other way
      this.props.venueId !== this.props.suppliers.items[0].venue_id)
    ) {
      this.fetchSuppliers(this.props.venueId)
    }
  }

  componentWillReceiveProps (nextProps) {
    // Only fetch new products for new venue_id
    if (this.props.venueId !== nextProps.venueId) {
      this.fetchSuppliers(nextProps.venueId)
    }

    // Scroll to top if search is emptyed (left hand menubar link click)
    // if (this.props.location.key !== nextProps.location.key && !nextProps.location.search) {
    //   window.scrollTo(0, 0)
    // }
  }

  render () {
    const { suppliers, venueId, toggleAddNewDialog, fetchCatalog, addSupplier } = this.props

    const SupplierList = suppliers.items.map(item =>
      <SupplierListItem
        key={item._id}
        item={item}
        updateSupplier={this.updateSupplier}
        deleteSupplier={this.deleteSupplier} />
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
            {!suppliers.isFetching && venueId ? (
              suppliers.items.length ? (
                SupplierList
              ) : (<Alert bsStyle='warning'>No items found.</Alert>)
            ) : (
              <Alert bsStyle='warning'>Loading...</Alert>
            )}
          </div>

        </div>

      </div>
    )
  }
}

Suppliers.propTypes = {
  // location: React.PropTypes.object.isRequired,
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
