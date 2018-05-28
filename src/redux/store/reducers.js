import {
  contract
} from '../modules'

import { combineReducers } from 'redux'

const appReducer = combineReducers({
  contract
})

export default function rootReducer(state, action) {
  let finalState = appReducer(state, action)
  return finalState
}
