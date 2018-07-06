import {
  apiGet,
  apiPost,
  apiDelete,
} from '../constants'

export function FetchOrders(base, callback) {
  apiGet(base, '/offers', callback)
}

export function CreateOrder(base, data, callback) {
  apiPost(base, '/offers', data, callback)
}

export function DeleteOrder(base, id, callback) {
  apiDelete(base, `/offers/${id}`, callback)
}
