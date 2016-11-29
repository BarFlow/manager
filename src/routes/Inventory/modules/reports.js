import { CALL_API } from 'redux-api-middleware'

// ------------------------------------
// Constants
// ------------------------------------
export const REPORTS_FETCH_REQUEST = 'reports/FETCH_REPORTS_REQUEST'
export const REPORTS_FETCH_SUCCESS = 'reports/FETCH_REPORTS_SUCCESS'
export const REPORTS_FETCH_FAILURE = 'reports/FETCH_REPORTS_FAILURE'

export const REPORT_UPDATE_FETCH_REQUEST = 'reports/FETCH_UPDATE_REPORT_REQUEST'

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
export const fetchReports = (venueId) => {
  return {
    [CALL_API]: {
      endpoint: `/reports?venue_id=${venueId}`,
      method: 'GET',
      types: [
        REPORTS_FETCH_REQUEST,
        REPORTS_FETCH_SUCCESS,
        REPORTS_FETCH_FAILURE
      ]
    }
  }
}

export const fetchReport = ({ reportId, venueId }, update = false) => {
  return {
    [CALL_API]: {
      endpoint: `/reports/${reportId}?venue_id=${venueId}`,
      method: 'GET',
      types: [
        !update ? REPORT_FETCH_REQUEST : REPORT_UPDATE_FETCH_REQUEST,
        {
          type: REPORT_FETCH_SUCCESS,
          payload: (action, state, res) => {
            const contentType = res.headers.get('Content-Type')
            if (contentType && ~contentType.indexOf('json')) {
              // Just making sure res.json() does not raise an error
              return res.json().then((json) => {
                // return payload
                return reportId === 'live' ? json : json.data
              })
            }
          }
        },
        REPORT_FETCH_FAILURE
      ]
    }
  }
}

export const changeReportFilters = (filter) => ({
  type: REPORTS_FILTER_CHANGE,
  payload: {
    limit: 20,
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
        isFetching: true,
        items:[]
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
  [REPORT_UPDATE_FETCH_REQUEST] : (state, action) => {
    return {
      ...state,
      isFetching: true,
      isUpdate: true
    }
  },
  [REPORT_FETCH_REQUEST] : (state, action) => {
    return {
      ...state,
      isFetching: true,
      isUpdate: false,
      items:[]
    }
  },
  [REPORT_FETCH_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      isUpdate: false,
      items: action.payload
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
    limit: 20,
    skip: 0
  },
  items: [],
  archive: {
    isFetching: false,
    items: []
  }
}
export default function reportsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
