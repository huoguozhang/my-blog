export function saveToken (token: string) {
  window.localStorage.setItem('token', token)
}

export function getToken () {
  return window.localStorage.getItem('token')
}
