import React, { Component } from 'react'
import XLSX from 'xlsx'
// import { Button, Alert, Panel } from 'react-bootstrap'

import SubHeader from '../../../../components/SubHeader'

class ImportView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      parseFile: {
        error: ''
      }
    }
    this._handleFileSelect = this._handleFileSelect.bind(this)
  }

  componentDidMount () {
  }

  componentWillReceiveProps (nextProps) {
  }

  _handleFileSelect (e) {
    const files = e.target.files
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const productsToImport = XLSX.utils.sheet_to_row_object_array(workbook.Sheets['products'])

      if (!workbook.Sheets['products']) {
        return this.setState({
          parseFile: {
            error: 'The selected file can not be used to import products.'
          }
        })
      }

      if (!productsToImport.length) {
        return this.setState({
          parseFile: {
            error: 'The are no products found in the selected file.'
          }
        })
      }

      console.log(productsToImport)
    }
    reader.readAsBinaryString(files[0])
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
          {this.state.parseFile.error}
          <h2>Santa Teresa</h2>
          <div className='file-upload'>
            <input
              type='file'
              id='import-file'
              onChange={this._handleFileSelect}
              accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' />
          </div>
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
