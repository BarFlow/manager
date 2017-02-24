import { CALL_API } from 'redux-api-middleware'

// ------------------------------------
// Constants
// ------------------------------------
const LIMIT = 20

export const REPORTS_FETCH_REQUEST = 'reports/FETCH_REPORTS_REQUEST'
export const REPORTS_FETCH_SUCCESS = 'reports/FETCH_REPORTS_SUCCESS'
export const REPORTS_FETCH_FAILURE = 'reports/FETCH_REPORTS_FAILURE'

export const REPORT_FETCH_REQUEST = 'reports/FETCH_REPORT_REQUEST'
export const REPORT_FETCH_SUCCESS = 'reports/FETCH_REPORT_SUCCESS'
export const REPORT_FETCH_FAILURE = 'reports/FETCH_REPORT_FAILURE'

export const REPORT_CREATE_REQUEST = 'reports/CREATE_REQUEST'
export const REPORT_CREATE_SUCCESS = 'reports/CREATE_SUCCESS'
export const REPORT_CREATE_FAILURE = 'reports/CREATE_FAILURE'

export const REPORT_DELETE_REQUEST = 'reports/DELETE_REQUEST'
export const REPORT_DELETE_SUCCESS = 'reports/DELETE_SUCCESS'
export const REPORT_DELETE_FAILURE = 'reports/DELETE_FAILURE'

export const REPORTS_FILTER_CHANGE = 'reports/FILTER_CHANGE'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchReports = (venueId, silent = false) => {
  return {
    [CALL_API]: {
      endpoint: `/reports?venue_id=${venueId}`,
      method: 'GET',
      types: [
        {
          type: REPORTS_FETCH_REQUEST,
          meta: {
            silent
          }
        },
        REPORTS_FETCH_SUCCESS,
        REPORTS_FETCH_FAILURE
      ]
    }
  }
}

export const fetchReport = ({ reportId, venueId }, silent = false) => {
  return {
    [CALL_API]: {
      endpoint: `/reports/${reportId}?venue_id=${venueId}`,
      method: 'GET',
      types: [
        {
          type: REPORT_FETCH_REQUEST,
          meta: {
            silent
          }
        },
        {
          type: REPORT_FETCH_SUCCESS
          // payload: (action, state, res) => {
          //   const contentType = res.headers.get('Content-Type')
          //   if (contentType && ~contentType.indexOf('json')) {
          //     // Just making sure res.json() does not raise an error
          //     return res.json().then((json) => {
          //       // return payload
          //       return reportId === 'live' ? json : json.data
          //     })
          //   }
          // }
        },
        REPORT_FETCH_FAILURE
      ]
    }
  }
}

export const changeReportFilters = (filter) => ({
  type: REPORTS_FILTER_CHANGE,
  payload: {
    limit: LIMIT,
    skip: 0,
    ...filter
  }
})

export const createReport = (payload) => {
  return {
    [CALL_API]: {
      endpoint: `/reports`,
      method: 'POST',
      body: JSON.stringify(payload),
      types: [
        REPORT_CREATE_REQUEST,
        REPORT_CREATE_SUCCESS,
        REPORT_CREATE_FAILURE
      ]
    }
  }
}

export const deleteReport = (reportId) => {
  return {
    [CALL_API]: {
      endpoint: `/reports/${reportId}`,
      method: 'DELETE',
      types: [
        REPORT_DELETE_REQUEST,
        REPORT_DELETE_SUCCESS,
        REPORT_DELETE_FAILURE
      ]
    }
  }
}

export const actions = {
  fetchReports,
  fetchReport,
  changeReportFilters,
  createReport,
  deleteReport
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REPORTS_FETCH_REQUEST] : (state, action) => {
    return {
      ...state,
      archive: {
        isFetching: !action.meta.silent && true,
        items: !action.meta.silent ? [] : state.archive.items
      }
    }
  },
  [REPORTS_FETCH_SUCCESS] : (state, action) => {
    return {
      ...state,
      archive: {
        isFetching: false,
        items: action.payload
      }
    }
  },
  [REPORT_FETCH_REQUEST] : (state, action) => {
    return {
      ...state,
      isFetching: !action.meta.silent && true,
      currentReport: {
        ...state.currentReport,
        data: !action.meta.silent ? [] : state.currentReport.data,
        stats: !action.meta.silent ? {} : state.currentReport.stats
      }
    }
  },
  [REPORT_FETCH_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      isUpdate: false,
      currentReport: action.payload
    }
  },
  [REPORTS_FILTER_CHANGE] : (state, action) => {
    return {
      ...state,
      filters: action.payload
    }
  },
  [REPORT_CREATE_REQUEST] : (state, action) => {
    return {
      ...state,
      isSaving: true
    }
  },
  [REPORT_CREATE_SUCCESS] : (state, action) => {
    return {
      ...state,
      isSaving: false,
      archive: {
        items: [
          action.payload,
          ...state.archive.items
        ]
      }
    }
  },
  [REPORT_DELETE_REQUEST] : (state, action) => {
    return {
      ...state,
      isSaving: true
    }
  },
  [REPORT_DELETE_SUCCESS] : (state, action) => {
    return {
      ...state,
      isSaving: false,
      archive: {
        ...state.archive.items,
        items: state.archive.items.filter(item => item._id !== action.payload._id)
      }
    }
  }
}

// ------------------------------------
// Reducer
// -----------------------------------
const initialState = {
  isFetching: false,
  isSaving: false,
  isUpdate: false,
  filters: {
    limit: LIMIT,
    skip: 0
  },
  currentReport: {
    data: [],
    stats: {}
  },
  archive: {
    isFetching: false,
    items: []
  }
}
export default function reportsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
