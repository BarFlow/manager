import React, { Component } from 'react'
import XLSX from 'xlsx'
import { Alert } from 'react-bootstrap'

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
      const productsToImport = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])

      if (!productsToImport.length) {
        return this.setState({
          error: 'The are no products found in the selected file.'
        })
      }

      this.props.onParse(productsToImport.map(item => ({
        category: item['Category'],
        name: item['Name'],
        supplier_product_code: item['SKU'],
        supplier: item['Supplier'],
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
    return (
      <div className='product-parser'>
        <div className='panel panel-default'>
          <div className='panel-body'>
            <h4 className='media-heading'>
              Step 1. Download our product list excel template file <a href='#'>here</a>.
            </h4>
          </div>
        </div>
        <div className='panel panel-default'>
          <div className='panel-body'>
            <h4 className='media-heading'>Step 2. Add your products to it and save it on your computer.</h4>
          </div>
        </div>
        <div className='panel panel-default'>
          <div className='panel-body'>
            <h4 className='media-heading'>Step 3. Upload your product list.</h4>
            {this.state.error &&
              <Alert bsStyle='danger'>{this.state.error}</Alert>
            }
            <input
              type='file'
              onChange={this._handleFileSelect}
              accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' />
          </div>
        </div>
        <div className='panel panel-default'>
          <div className='panel-body'>
            <h4 className='media-heading'>Step 4. Review and process your products in no time.</h4>
          </div>
        </div>
      </div>
    )
  }
}

ProductParser.propTypes = {
  onParse: React.PropTypes.func.isRequired
}

export default ProductParser
