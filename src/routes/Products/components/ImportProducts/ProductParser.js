import React, { Component } from 'react'
import XLSX from 'xlsx'
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router'

class ProductParser extends Component {
  constructor (props) {
    super(props)

    this.state = {
      error: ''
    }

    this._handleFileSelect = this._handleFileSelect.bind(this)
  }

  _handleFileSelect (e) {
    const files = e.target.files
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const productsToImport = XLSX.utils
        .sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
        .filter(item => item['Name'])

      if (!productsToImport.length) {
        return this.setState({
          error: 'The are no products found in the selected file.'
        })
      }

      this.props.onParse(productsToImport.map(item => ({
        category: item['Category'],
        name: item['Name'].replace(/[$-/:-?{-~!"^_`[\]]/g, ''),
        supplier_product_code: item['SKU'],
        supplier_id: this.refs.supplierId ? this.refs.supplierId.value : undefined,
        par_level: item['Par Level'],
        cost_price: item['Cost Price'],
        sale_unit_size: item['Serving Measure'],
        sale_price: item['Sale Price'],
        package_size: item['Case Size']
      })))
    }
    reader.readAsBinaryString(files[0])
  }

  render () {
    const { suppliers } = this.props
    return (
      <div className='product-parser'>
        <div className='panel panel-default'>
          <div className='panel-body'>
            <h4 className='media-heading'>Step 1. Choose a supplier for the products you are about to import.</h4>
            {(suppliers.isFetching || !!suppliers.items.length) &&
              <select className='form-control' ref='supplierId'>
                {!!suppliers.items.length && suppliers.items.map(supplier =>
                  <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
                )}
              </select>
              }
            {!suppliers.isFetching && !suppliers.items.length &&
              <Alert bsStyle='warning'>
                It seems like you don't have your suppliers in our system yet,
                please add them <Link to='/suppliers'>here</Link>.
              </Alert>
            }
          </div>
        </div>
        <div className='panel panel-default'>
          <div className='panel-body'>
            <h4 className='media-heading'>
              Step 2. <a href='#'>Download</a> and add your products to our excel template file.
            </h4>
          </div>
        </div>
        <div className='panel panel-default'>
          <div className='panel-body'>
            <h4 className='media-heading'>Step 3. Upload your list to start the import.</h4>
            {this.state.error &&
              <Alert bsStyle='danger'>{this.state.error}</Alert>
            }
            <input
              type='file'
              onChange={this._handleFileSelect}
              accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' />
          </div>
        </div>
      </div>
    )
  }
}

ProductParser.propTypes = {
  onParse: React.PropTypes.func.isRequired,
  suppliers: React.PropTypes.object
}

export default ProductParser
