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
        .sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { raw: true })
        .filter(item => item['Description'])
      if (!productsToImport.length) {
        return this.setState({
          error: 'The are no products found in the selected file.'
        })
      }

      this.props.onParse(productsToImport.map(item => ({
        name: item['Description'].replace(/[^\w\s]/gi, ''),
        supplier_product_code: item['SKU'],
        supplier_id: this.refs.supplierId ? this.refs.supplierId.value : undefined,
        par_level: item['Par Level'] && `${item['Par Level']}`.replace(/[^0-9.]+/g, ''),
        cost_price: item['Net Price'] && Math.round(`${item['Net Price']}`.replace(/[^0-9.]+/g, '') * 100) / 100,
        package_size: item['Case Size'] && `${item['Case Size']}`.replace(/[^0-9.]+/g, ''),
        count_by: 'bottle'
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
            <h4 className='media-heading'>
              Step 1. <a href='/barflow-import-template.xlsx' target='_blank'>Download</a> our excel template file.
              Send one to each of your suppliers to fill out and set your par levels.
            </h4>
          </div>
        </div>
        <div className='panel panel-default'>
          <div className='panel-body'>
            <h4 className='media-heading'>Step 2. Choose a supplier for the products you are about to import.</h4>
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
