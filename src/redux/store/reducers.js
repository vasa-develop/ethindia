import {
  contracts
} from '../modules'

import { combineReducers } from 'redux'

const appReducer = combineReducers({
  contracts
})

export default function rootReducer(state, action) {
  let finalState = appReducer(state, action)
  return finalState
}
