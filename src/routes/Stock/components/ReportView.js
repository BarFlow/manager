import React, { Component } from 'react'
import { Button, Alert, Pagination, Modal, Panel } from 'react-bootstrap'
import _ from 'lodash'

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
    this._toggleConfirmDialog = this._toggleConfirmDialog.bind(this)
    this._handleReportCreation = this._handleReportCreation.bind(this)
  }

  componentDidMount () {
    const {
      venueId, reports, changeReportFilters, fetchReport, location, params
    } = this.props

    // Fetch reports if there is new venueId or no reports in store yet
    if (
      (venueId && !reports.currentReport.data.length) ||
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
      venueId, changeReportFilters, fetchReport, location, params
    } = this.props

    if (venueId !== nextProps.venueId) {
      // Only fetch new reports for new venue_id
      fetchReport({ venueId: nextProps.venueId, reportId: nextProps.params.reportId })
    }

    if (venueId && venueId !== nextProps.venueId) {
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
      const { fetchReport, venueId } = this.props
      fetchReport({ venueId, reportId: 'live' }, true)
      this._refreshReport()
    }, 3000)
  }

  _handleReportCreation () {
    const { createReport, venueId, router } = this.props
    createReport({ venue_id: venueId })
      .then(() => router.push({ pathname: '/stock/archive', query: { saved: true } }))
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
      reports, venueId, resetReport
    } = this.props
    const reportId = this.props.params.reportId

    const statTypes = reports.currentReport.stats.types
    ? Object.keys(reports.currentReport.stats.types)
      .map(type => ({
        name: type,
        value: reports.currentReport.stats.types[type].value,
        categories:
          Object.keys(reports.currentReport.stats.types[type].categories)
          .map(category => ({
            name: category,
            value: reports.currentReport.stats.types[type].categories[category].value,
            sub_categories:
              Object.keys(reports.currentReport.stats.types[type].categories[category].sub_categories)
              .map(subCat => ({
                name: subCat,
                value: reports.currentReport.stats.types[type].categories[category].sub_categories[subCat].value
              }))
          }))
      })) : []

    const ProductList = reports.currentReport.filteredItems.map(item =>
      <ProductListItem
        key={item._id}
        item={item} />
    ).splice(reports.filters.skip, reports.filters.limit)

    const confirmDialog = <Modal show={this.state.isConfirmDialogOpen}
      onHide={this._toggleConfirmDialog}
      className='delete-confirm-dialog'>
      <Modal.Header closeButton>
        <Modal.Title>Reset Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to reset your stock levels?
        {' '}<strong>All current levels will be erased</strong>.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this._toggleConfirmDialog}>Cancel</Button>
        <Button
          bsStyle='danger'
          disabled={reports.isSaving}
          onClick={() =>
            resetReport({ venue_id: venueId }).then(() => this._toggleConfirmDialog())}>Reset</Button>
      </Modal.Footer>
    </Modal>

    const apiUrl = `${window.__API_HOST__}${window.__API_VERSION__}`

    return (
      <div className='row'>
        {confirmDialog}
        <SubHeader
          className='bg-blue'
          left={
            <h3>Stock Report / {' '}
              {!reports.currentReport.created_at &&
                <span className='small'>Live <span className='glyphicon glyphicon-refresh spinning live' /></span>
              }
              {reports.currentReport.created_at &&
                <span className='small'>
                  {new Date(reports.currentReport.created_at).toString().split(' ').splice(0, 5).join(' ')}
                </span>}
            </h3>}
          right={reportId === 'live' ? (
            <span>
              <Button
                onClick={this._handleReportCreation}
                disabled={!venueId || reports.isSaving}>Save Report</Button>
              <Button
                onClick={this._toggleConfirmDialog}
                disabled={!venueId || reports.isSaving}>Reset</Button>
            </span>
          ) : (
            <a className='btn btn-default'
              href={`${apiUrl}/reports/${reportId}/export?token=${this.props.token}`}
              target='_blank'>Export Report</a>
          )
          } />

        <div className='col-xs-12 col-sm-7 col-sm-offset-1 report'>
          <SearchBar
            filters={reports.filters}
            onChange={this._updateReportFilterAndURI} />

          <div className='items'>
            {!venueId || reports.isFetching ? (
              <Alert bsStyle='warning'>Loading...</Alert>
            ) : (
              reports.currentReport.filteredItems.length ? (
                ProductList
              ) : (
                <Alert bsStyle='warning'>No items found.</Alert>
              )
            )}
          </div>

          {reports.currentReport.filteredItems.length > reports.filters.limit &&
            <div className='text-center'>
              <Pagination ellipsis boundaryLinks
                items={Math.ceil(reports.currentReport.filteredItems.length / reports.filters.limit)}
                maxButtons={9}
                activePage={(reports.filters.skip / reports.filters.limit) + 1}
                onSelect={this._handlePaginationSelect} />
            </div>
          }
        </div>

        <div className='col-xs-12 col-sm-3 report-stats'>
          <Panel>
            {reports.currentReport.stats &&
              <div>
                <h5>Total Stock Value <span>£{reports.currentReport.stats.total_value}</span></h5>
                {_.orderBy(statTypes, ['value', 'name'], 'desc').map((type, index) =>
                  <div key={index}>
                    <div className='type'>{type.name} <span>£{type.value}</span></div>
                    {_.orderBy(type.categories, ['value', 'name'], 'desc').map((category, index) =>
                      <div key={index}>
                        <div className='category'>{category.name} <span>£{category.value}</span></div>
                        {_.orderBy(category.sub_categories, ['value', 'name'], 'desc').map((subCat, index) =>
                          <div key={index} className='sub-category'>
                            {subCat.name} <span>£{subCat.value}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            }
          </Panel>
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
  resetReport: React.PropTypes.func.isRequired,
  reports: React.PropTypes.object.isRequired,
  venueId: React.PropTypes.string,
  token: React.PropTypes.string.isRequired
}
export default Report
