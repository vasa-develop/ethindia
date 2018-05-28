import {
  CONTRACT_FETCH_SUCCESS
} from './actions'
import { defaultReducers } from '../defaultReducers'

const DEFAULT = defaultReducers.contracts

export default function contracts(state = DEFAULT, action = {}) {
  const { type, payload } = action
  switch (type) {
    case CONTRACT_FETCH_SUCCESS:
      return {
        ...state,
        contracts: payload.contracts || {},
      }
    default:
      return state
  }
}
