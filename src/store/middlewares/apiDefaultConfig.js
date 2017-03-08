import { CALL_API } from 'redux-api-middleware'

export default store => next => action => {
  const callApi = action[CALL_API]

  // Check if this action is a redux-api-middleware action.
  if (callApi) {
    // Setting base API url
    callApi.endpoint = `${window.__API_HOST__}${window.__API_VERSION__}${callApi.endpoint}`
    // callApi.endpoint = `http://localhost:3333${callApi.endpoint}`
    // Inject the Authorization header from localStorage.
    callApi.headers = {
      ...callApi.headers,
      Authorization: `Bearer ${store.getState().auth.token}`,
      'Content-Type': callApi.headers && callApi.headers['Content-Type']
        ? callApi.headers['Content-Type']
        : 'application/json'
    }
  }

  // Pass the FSA to the next action.
  return next(action)
}
