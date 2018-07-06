import {
  apiGet,
  apiPost,
  apiDelete,
} from '../constants'

export function PostLoans(base, data, callback) {
  apiPost(base, '/loan_requests', data, callback)
}
