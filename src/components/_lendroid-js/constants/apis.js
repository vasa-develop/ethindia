import axios from 'axios'

export function apiGet(base, endPoint, cb = null) {
  const url = base + endPoint

  axios.get(url)
    .then(res => {
      if (cb) cb(null, res.data)
    })
}

export function apiPost(base, endPoint, data, cb = null) {
  const url = base + endPoint

  axios.post(url, data)
    .then(res => {
      if (cb) cb(null, res.data)
    })
}

export function apiDelete(base, endPoint, cb = null) {
  const url = base + endPoint

  axios.delete(url)
    .then(res => {
      if (cb) cb(null, res)
    })
}
