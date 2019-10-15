export function saveToken (token: string) {
  window.localStorage.setItem('token', token)
}

export function getToken () {
  return (window && window.localStorage.getItem('token')) || null
}
