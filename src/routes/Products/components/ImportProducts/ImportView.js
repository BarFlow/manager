import React, { Component } from 'react'
// import { Button, Alert, Panel } from 'react-bootstrap'

import SubHeader from '../../../../components/SubHeader'

class ImportView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      state: true
    }
  }

  componentDidMount () {
  }

  componentWillReceiveProps (nextProps) {
  }

  render () {
    return (
      <div className='row'>
        <SubHeader
          className='bg-yellow'
          left={<h3>Products <span className='small'>/ Import</span></h3>}
          right={
            <div>
              23 / 232 items
            </div>
          } />
        <div className='col-xs-12 col-sm-10 col-sm-offset-1 products'>
          <h2>Santa Teresa</h2>
        </div>
      </div>
    )
  }
}

ImportView.propTypes = {
  fetchProducts: React.PropTypes.func.isRequired,
  fetchTypes: React.PropTypes.func.isRequired,
  fetchCatalog: React.PropTypes.func.isRequired,
  fetchSuppliers: React.PropTypes.func.isRequired,
  addProduct: React.PropTypes.func.isRequired,
  venueId: React.PropTypes.string,
  products : React.PropTypes.object,
  types: React.PropTypes.object,
  suppliers: React.PropTypes.object
}
export default ImportView
