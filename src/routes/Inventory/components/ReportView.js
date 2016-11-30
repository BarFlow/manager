import React, { Component } from 'react'
import { Button, Alert, Pagination } from 'react-bootstrap'

import SubHeader from '../../../components/SubHeader'
import SearchBar from '../../../components/SearchBar'
import ProductListItem from './ProductListItem'

import './ReportView.scss'

class Report extends Component {
  constructor (props) {
    super(props)
    this._updateReportFilterAndURI = this._updateReportFilterAndURI.bind(this)
    this._handlePaginationSelect = this._handlePaginationSelect.bind(this)
    this._refreshReport = this._refreshReport.bind(this)
    this._viewReport = this._viewReport.bind(this)
  }

  componentDidMount () {
    const {
      venueId, reports, changeReportFilters, fetchReport, suppliers, fetchSuppliers, types, fetchTypes, location, params
    } = this.props

    // Fetch reports if there is new venueId or no reports in store yet
    if (
      (venueId && !reports.items.length) ||
      (venueId && venueId !== reports.filters.venue_id) ||
      (venueId && params.reportId !== reports.filters.report_id)
    ) {
      fetchReport({ venueId, reportId: params.reportId })
    }

    // Fetch suppliers if needed
    if (
      (!suppliers.items.length && !suppliers.isFetching && venueId) ||
      // Dirty way to check if the current venue_id is valid, should be other way
      (venueId && suppliers.items.length && venueId !== suppliers.items[0].venue_id)
    ) {
      fetchSuppliers(venueId)
    }

    // Fetch types if they are not in store yet
    if (!types.items.length) {
      fetchTypes()
    }

    // Load current filters from URI
    changeReportFilters({
      venue_id: venueId,
      report_id: params.reportId,
      ...location.query
    })

    // keeping report data up-to-date
    this._refreshReport()
  }

  componentWillUnmount () {
    // Flush filters when unmount
    this.props.changeReportFilters({ venue_id: this.props.venueId, report_id: this.props.params.reportId })

    // Cancel polling
    clearTimeout(this._refreshTimer)
  }

  componentWillReceiveProps (nextProps) {
    const {
      venueId, changeReportFilters, fetchReport, fetchSuppliers, location, reports, params
    } = this.props
    if (venueId !== nextProps.venueId) {
      // Only fetch new reports for new venue_id
      fetchReport({ venueId: nextProps.venueId, reportId: nextProps.params.reportId })

      // Fetch new suppliers
      fetchSuppliers(nextProps.venueId)
    }

    if (venueId && venueId !== nextProps.venueId) {
      // Update venue_id in URI if it has changed
      changeReportFilters({ venue_id: nextProps.venueId, report_id: nextProps.params.reportId })
    }

    // Fetch new report if reportId has changed
    if (params.reportId !== nextProps.params.reportId) {
      fetchReport({ venueId: nextProps.venueId, reportId: nextProps.params.reportId })
    }

    // Update filters when URI has changed from outside of the component
    if (nextProps.location.action === 'PUSH' && location.search !== nextProps.location.search) {
      changeReportFilters({
        ...nextProps.location.query,
        report_id: nextProps.params.reportId,
        venue_id: nextProps.venueId
      })
    }

    // Scroll to top if search is emptyed (left hand menubar link click)
    if (location.key !== nextProps.location.key && !nextProps.location.search) {
      window.scrollTo(0, 0)
    }

    // Redirect to saved report page
    if (reports.isSaving && !nextProps.reports.isSaving) {
      this._viewReport({
        ...nextProps.reports.archive.items[0],
        saved: true
      })
    }
  }

  _updateReportFilterAndURI (filters) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.props.router.replace({
        pathname: this.props.location.pathname,
        query: filters
      })
    }, 500)

    this.props.changeReportFilters(filters)
  }

  _refreshReport () {
    clearTimeout(this._refreshTimer)
    this._refreshTimer = setTimeout(() => {
      const { fetchReport, venueId, reports } = this.props
      const reportId = reports.filters.report_id
      if (venueId && reportId === 'live') {
        fetchReport({ venueId, reportId }, true)
      }
      this._refreshReport()
    }, 3000)
  }

  _viewReport (item) {
    this.props.router.push({
      pathname: `/inventory/reports/${item._id}`,
      query: {
        title: new Date(item.created_at).toString().split(' ').splice(0, 5).join(' '),
        saved: item.saved
      }
    })
  }

  _handlePaginationSelect (page) {
    const { reports } = this.props
    const filters = {
      ...reports.filters,
      skip: (reports.filters.limit * (page - 1))
    }
    this._updateReportFilterAndURI(filters)
    window.scrollTo(0, 0)
  }

  render () {
    const {
      reports, types, venueId, createReport, location
    } = this.props
    const reportId = this.props.params.reportId

    const ProductList = reports.filteredItems.map(item =>
      <ProductListItem
        key={item._id}
        item={item} />
    ).splice(reports.filters.skip, reports.filters.limit)

    return (
      <div className='row'>
        <SubHeader
          className='bg-blue'
          left={
            <h3>Inventory
              {location.query.title && <span> / <span className='small'>{location.query.title}</span></span>}
            </h3>}
          right={reportId === 'live' ? (
            <Button
              onClick={() => createReport({ venue_id: venueId })}
              disabled={!venueId || reports.isSaving}>Save Report</Button>
          ) : (
            <a className='btn btn-default'
              href={`http://api.stockmate.co.uk/reports/${reportId}/export?token=${this.props.token}`}
              target='_blank'>Export</a>
          )
          } />

        <div className='col-xs-12 col-sm-10 col-sm-offset-1 report'>
          {location.query.saved &&
            <Alert bsStyle='success'>
              <strong>Success!</strong> Inventory report has been successfuly saved.
            </Alert>
          }
          <SearchBar
            filters={reports.filters}
            onChange={this._updateReportFilterAndURI}
            types={types} />

          <div className='items'>
            {!venueId || (reports.isFetching && !reports.isUpdate) ? (
              <Alert bsStyle='warning'>Loading...</Alert>
            ) : (
              reports.filteredItems.length ? (
                ProductList
              ) : (
                <Alert bsStyle='warning'>No items found.</Alert>
              )
            )}
          </div>

          {reports.filteredItems.length > reports.filters.limit &&
            <div className='text-center'>
              <Pagination ellipsis boundaryLinks
                items={Math.ceil(reports.filteredItems.length / reports.filters.limit)}
                maxButtons={9}
                activePage={(reports.filters.skip / reports.filters.limit) + 1}
                onSelect={this._handlePaginationSelect} />
            </div>
          }
        </div>

      </div>
    )
  }
}

Report.propTypes = {
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  router: React.PropTypes.object,
  types: React.PropTypes.object.isRequired,
  fetchTypes: React.PropTypes.func.isRequired,
  suppliers: React.PropTypes.object.isRequired,
  fetchSuppliers: React.PropTypes.func.isRequired,
  fetchReport: React.PropTypes.func.isRequired,
  changeReportFilters: React.PropTypes.func.isRequired,
  createReport: React.PropTypes.func.isRequired,
  reports: React.PropTypes.object.isRequired,
  venueId: React.PropTypes.string,
  token: React.PropTypes.string.isRequired
}
export default Report
