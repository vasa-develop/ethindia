// @flow

import { fork, all } from 'redux-saga/effects'
import {
  contractSaga,
} from '../modules'

export default function* rootSaga() {
  yield all([
    fork(contractSaga)
  ])
}
