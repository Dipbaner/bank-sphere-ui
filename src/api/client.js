import axios from 'axios'

// The access token lives ONLY in this variable: never in localStorage.
let accessToken = null
export const setAccessToken = (t) => { accessToken = t }
export const getAccessToken = () => accessToken

export const api = axios.create({ baseURL: '', withCredentials: true })

api.interceptors.request.use((config) => {
  // Pre-auth calls pass their own Authorization header, so do not overwrite it.
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let onSessionLost = () => {}
export const setSessionLostHandler = (fn) => { onSessionLost = fn }

// ONE refresh at a time. Two parallel refreshes would look like token theft to the server.
let refreshPromise = null
export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post('/api/auth/refresh', null, { withCredentials: true })
      .then((res) => {
        setAccessToken(res.data.accessToken)
        return res.data
      })
      .finally(() => { refreshPromise = null })
  }
  return refreshPromise
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    // Refresh only when the ACCESS TOKEN was rejected (code UNAUTHORIZED).
    // INVALID_OTP is also a 401: retrying it would count a second wrong guess.
    const tokenRejected =
      error.response?.status === 401 && error.response?.data?.code === 'UNAUTHORIZED'

    if (tokenRejected && original && !original._retry && getAccessToken()) {
      original._retry = true
      try {
        await refreshSession()
        original.headers.Authorization = `Bearer ${getAccessToken()}`
        return api(original)
      } catch {
        setAccessToken(null)
        onSessionLost()
      }
    }
    return Promise.reject(error)
  }
)

export function parseJwt(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export const errMsg = (err, fallback = 'Something went wrong. Please try again.') =>
  err?.response?.data?.message || fallback
export const errCode = (err) => err?.response?.data?.code
export const fieldErrors = (err) => err?.response?.data?.details || {}