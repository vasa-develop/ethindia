import axios from 'axios'
import * as Constants from '../constants'

export function apiGet(endPoint, cb = null) {
  let url = Constants.API_ENDPOINT
  url += endPoint

  axios.get(url)
    .then(res => {
      if (cb) cb(null, res.data)
    })
    .catch(err => cb && cb(err))
}

export function apiPost(endPoint, data, cb = null) {
  let url = Constants.API_ENDPOINT
  url += endPoint

  axios.post(url, data)
    .then(res => {
      if (cb) cb(null, res.data)
    })
    .catch(err => cb && cb(err))
}

export function apiDelete(endPoint, cb = null) {
  let url = Constants.API_ENDPOINT
  url += endPoint

  axios.delete(url)
    .then(res => {
      if (cb) cb(null, res)
    })
    .catch(err => cb && cb(err))
}

export function FetchOrders(callback) {
  apiGet('/offers', (err, result) => {
    callback(err, result.offers || [])
  })
}
