import {
  CONTRACT_FETCH_SUCCESS,
  TOKEN_BALANCE_SUCCESS
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
    default:
      return state
  }
}
