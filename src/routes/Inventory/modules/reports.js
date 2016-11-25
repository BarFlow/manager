import { CALL_API } from 'redux-api-middleware'

// ------------------------------------
// Constants
// ------------------------------------
export const REPORTS_FETCH_REQUEST = 'reports/FETCH_REPORTS_REQUEST'
export const REPORTS_FETCH_SUCCESS = 'reports/FETCH_REPORTS_SUCCESS'
export const REPORTS_FETCH_FAILURE = 'reports/FETCH_REPORTS_FAILURE'

export const REPORT_FETCH_REQUEST = 'reports/FETCH_REPORT_REQUEST'
export const REPORT_FETCH_SUCCESS = 'reports/FETCH_REPORT_SUCCESS'
export const REPORT_FETCH_FAILURE = 'reports/FETCH_REPORT_FAILURE'

export const REPORT_CREATE_REQUEST = 'reports/CREATE_REQUEST'
export const REPORT_CREATE_SUCCESS = 'reports/CREATE_SUCCESS'
export const REPORT_CREATE_FAILURE = 'reports/CREATE_FAILURE'

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

export const fetchReport = ({ rid, venueId }) => {
  return {
    [CALL_API]: {
      endpoint: `/reports/${rid}?venue_id=${venueId}`,
      method: 'GET',
      types: [
        REPORT_FETCH_REQUEST,
        REPORT_FETCH_SUCCESS,
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

export const actions = {
  fetchReports,
  fetchReport,
  changeReportFilters,
  createReport
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
      acrchive: {
        isFetching: false,
        items: action.payload
      }
    }
  },
  [REPORT_FETCH_REQUEST] : (state, action) => {
    return {
      ...state,
      isFetching: true,
      items:[]
    }
  },
  [REPORT_FETCH_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
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
  }
}

// ------------------------------------
// Reducer
// -----------------------------------
const initialState = {
  isFetching: false,
  isSaving: false,
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
