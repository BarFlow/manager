import React, { Component } from 'react'
import { Button, Alert, Pagination, Modal } from 'react-bootstrap'

import SubHeader from '../../../components/SubHeader'
import SearchBar from '../../../containers/SearchBarContainer'
import ProductListItem from './ProductListItem'

import './ReportView.scss'

class Report extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isConfirmDialogOpen: false
    }
    this._updateReportFilterAndURI = this._updateReportFilterAndURI.bind(this)
    this._handlePaginationSelect = this._handlePaginationSelect.bind(this)
    this._refreshReport = this._refreshReport.bind(this)
    this._viewReport = this._viewReport.bind(this)
    this._toggleConfirmDialog = this._toggleConfirmDialog.bind(this)
  }

  componentDidMount () {
    const {
      venueId, reports, changeReportFilters, fetchReport, location, params
    } = this.props

    // Fetch reports if there is new venueId or no reports in store yet
    if (
      (venueId && !reports.items.length) ||
      (venueId && venueId !== reports.filters.venue_id) ||
      (venueId && params.reportId !== reports.filters.report_id)
    ) {
      fetchReport({ venueId, reportId: params.reportId })
    }

    // Load current filters from URI
    changeReportFilters({
      venue_id: venueId,
      report_id: params.reportId,
      ...location.query
    })

    // keeping report data up-to-date
    if (location.pathname.indexOf('/live') > -1) {
      this._refreshReport()
    }
  }

  componentWillUnmount () {
    // Flush filters when unmount
    this.props.changeReportFilters({ venue_id: this.props.venueId, report_id: this.props.params.reportId })

    // Cancel polling
    clearTimeout(this._refreshTimer)
  }

  componentWillReceiveProps (nextProps) {
    const {
      venueId, changeReportFilters, fetchReport, location, reports, params
    } = this.props

    if (venueId !== nextProps.venueId) {
      // Only fetch new reports for new venue_id
      fetchReport({ venueId: nextProps.venueId, reportId: nextProps.params.reportId })
    }

    if (venueId && venueId !== nextProps.venueId) {
      clearTimeout(this._refreshTimer)
      this.props.router.push({
        pathname: '/stock/reports/live'
      })
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

    // Restart polling when we are at Live view
    if (location.pathname.indexOf('/live') === -1 && nextProps.location.pathname.indexOf('/live') > -1) {
      this._refreshReport()
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
      pathname: `/stock/reports/${item._id}`,
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

  _toggleConfirmDialog () {
    this.setState({
      isConfirmDialogOpen: !this.state.isConfirmDialogOpen
    })
  }

  render () {
    const {
      reports, venueId, createReport, location
    } = this.props
    const reportId = this.props.params.reportId

    const ProductList = reports.filteredItems.map(item =>
      <ProductListItem
        key={item._id}
        item={item} />
    ).splice(reports.filters.skip, reports.filters.limit)

    const confirmDialog = <Modal show={this.state.isConfirmDialogOpen}
      onHide={this._toggleConfirmDialog}
      className='delete-confirm-dialog'>
      <Modal.Header closeButton>
        <Modal.Title>Save Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to finalize this report?
        {' '}<strong>All current stock levels will be erased</strong>.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this._toggleConfirmDialog}>Cancel</Button>
        <Button
          bsStyle='primary'
          disabled={reports.isSaving}
          onClick={() =>
            createReport({ venue_id: venueId }).then(() => this._toggleConfirmDialog())}>Save</Button>
      </Modal.Footer>
    </Modal>

    return (
      <div className='row'>
        {confirmDialog}
        <SubHeader
          className='bg-blue'
          left={
            <h3>Stock Report /
              {!location.query.title &&
                <span className='small'> Live <span className='glyphicon glyphicon-refresh spinning live' /></span>
              }
              {location.query.title && <span className='small'>{location.query.title}</span>}
            </h3>}
          right={reportId === 'live' ? (
            <Button
              onClick={this._toggleConfirmDialog}
              disabled={!venueId || reports.isSaving}>Save Report</Button>
          ) : (
            <a className='btn btn-default'
              href={`http://api.stockmate.co.uk/reports/${reportId}/export?token=${this.props.token}`}
              target='_blank'>Export Report</a>
          )
          } />

        <div className='col-xs-12 col-sm-10 col-sm-offset-1 report'>
          {location.query.saved &&
            <Alert bsStyle='success'>
              <strong>Success!</strong> Stock report has been successfuly saved.
            </Alert>
          }
          <SearchBar
            filters={reports.filters}
            onChange={this._updateReportFilterAndURI} />

          <div className='items'>
            {!venueId || reports.isFetching ? (
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
  params: React.PropTypes.object,
  router: React.PropTypes.object,
  location: React.PropTypes.object,
  fetchReport: React.PropTypes.func.isRequired,
  changeReportFilters: React.PropTypes.func.isRequired,
  createReport: React.PropTypes.func.isRequired,
  reports: React.PropTypes.object.isRequired,
  venueId: React.PropTypes.string,
  token: React.PropTypes.string.isRequired
}
export default Report
