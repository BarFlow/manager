import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import _ from 'lodash'

import {
  fetchReport,
  createReport,
  changeReportFilters
} from '../modules/reports'
import { fetchSuppliers } from '../../Suppliers/modules/suppliers'
import { fetchTypes } from '../../../store/types'

/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, the reports:   */

import ReportView from '../components/ReportView'

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around fetchProdcusts; the component doesn't care   */

const mapDispatchToProps = {
  fetchReport,
  createReport,
  changeReportFilters,
  fetchSuppliers,
  fetchTypes
}

const mapStateToProps = (state) => {
  const { filters } = state.reports
  const filteredItems = state.reports.items.reduce((mem, item) => {
    item.noPlacement = !!item.areas.length
    const name = new RegExp(filters.name, 'i')
    if (
      item.product_id.name.match(name) &&
      (!filters.type || filters.type === '' || item.product_id.type === filters.type) &&
      (!filters.category || filters.category === '' || item.product_id.category === filters.category) &&
      (!filters.sub_category || filters.sub_category === '' || item.product_id.sub_category === filters.sub_category) &&
      (!filters.supplier || filters.supplier === '' || (item.supplier_id && item.supplier_id._id === filters.supplier))
    ) {
      mem.push(item)
    }
    return mem
  }, [])
  return {
    reports : {
      ...state.reports,
      filteredItems: _.orderBy(filteredItems,
        ['noPlacement', 'product_id.category', 'product_id.sub_category', 'product_id.name'])

    },
    venueId: state.venues.current,
    types: state.types,
    suppliers: state.suppliers,
    token: state.auth.token
  }
}

/*  Note: mapStateToProps is where you should use `reselect` to create selectors, ie:

    import { createSelector } from 'reselect'
    const reports = (state) => state.reports
    const tripleCount = createSelector(reports, (count) => count * 3)
    const mapStateToProps = (state) => ({
      reports: tripleCount(state)
    })

    Selectors can compute derived data, allowing Redux to store the minimal possible state.
    Selectors are efficient. A selector is not recomputed unless one of its arguments change.
    Selectors are composable. They can be used as input to other selectors.
    https://github.com/reactjs/reselect    */

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReportView))
