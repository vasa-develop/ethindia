import {
  CONTRACT_FETCH_SUCCESS,
  TOKEN_BALANCE_SUCCESS,
  TOKEN_ALLOWANCE_SUCCESS,
} from './actions'
import { defaultReducers } from '../defaultReducers'

const DEFAULT = defaultReducers.contracts

export default function contracts(state = DEFAULT, action = {}) {
  const { type, payload } = action
  switch (type) {
    case CONTRACT_FETCH_SUCCESS:
      return {
        ...state,
        contracts: Object.assign({}, state.contracts || {}, payload.contracts),
      }
    case TOKEN_BALANCE_SUCCESS:
      return {
        ...state,
        balances: Object.assign({}, state.balances || {}, payload.balances),
      }
    case TOKEN_ALLOWANCE_SUCCESS:
      return {
        ...state,
        allowances: Object.assign({}, state.allowances || {}, payload.allowances),
      }
    default:
      return state
  }
}
