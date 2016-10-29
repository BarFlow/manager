const protectedRoute = (nextState, replace, store) => {
  const state = store.getState()
  const isLoggedIn = state && state.auth.token
  if (!isLoggedIn) {
    replace({
      pathname: '/login',
      search: `?next=${encodeURIComponent(nextState.location.pathname + nextState.location.search)}`,
      state: { nextPathname: nextState.location.pathname }
    })
  }
}
export default protectedRoute
