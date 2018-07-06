import {
  apiGet,
  apiPost,
  apiDelete,
} from '../constants'

export function FetchOrders(base, callback) {
  apiGet(base, '/offers', (err, result) => {
    callback(err, result.offers || [])
  })
}

export function CreateOrder(base, data, callback) {
  apiPost(base, '/offers', data, (err, result) => {
    callback(err, result)
  })
}
