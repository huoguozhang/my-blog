export function saveToken (token: string) {
  window.localStorage.setItem('token', token)
}

export function getToken () {
  let token = ''
  try {
    token = (window && window.localStorage.getItem('token')) || ''
  } catch (e) {
  }
  return token
}
