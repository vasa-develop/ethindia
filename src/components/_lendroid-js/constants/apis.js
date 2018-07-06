import axios from 'axios'

export function apiGet(base, endPoint, cb = null) {
  let url = base + endPoint

  axios.get(url)
    .then(res => {
      if (cb) cb(null, res.data)
    })
    .catch(err => cb && cb(err))
}

export function apiPost(base, endPoint, data, cb = null) {
  let url = base + endPoint

  axios.post(url, data)
    .then(res => {
      if (cb) cb(null, res.data)
    })
    .catch(err => cb && cb(err))
}

export function apiDelete(base, endPoint, cb = null) {
  let url = base + endPoint

  axios.delete(url)
    .then(res => {
      if (cb) cb(null, res)
    })
    .catch(err => cb && cb(err))
}
