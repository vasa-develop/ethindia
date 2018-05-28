import { createAction } from 'redux-actions'
import { createPromiseAction } from '../utils'

/**
 * Action Types
 */

export const CONTRACT_FETCH = 'contract/CONTRACT_FETCH'
export const CONTRACT_FETCH_SUCCESS = 'contract/CONTRACT_FETCH_SUCCESS'

/**
 * Action Creators
 */
export const contractActionCreators = {
  contractFetch: createPromiseAction(CONTRACT_FETCH),
  contractFetchSuccess: createAction(CONTRACT_FETCH_SUCCESS)
}