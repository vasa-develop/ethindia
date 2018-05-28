import "babel-polyfill"
import {
  put,
  call,
  fork,
  all,
  take
} from 'redux-saga/effects'

import {
  CONTRACT_FETCH,
  contractActionCreators
} from './actions'

export function* asyncContractFetch({ payload, resolve, reject }) {
  try {
    const contracts = { message: 'test' }
    yield put(contractActionCreators.contractFetchSuccess({ contracts }))
    resolve(contracts);
  } catch (e) {
    reject(e)
  }
}

export function* watchContractFetch() {
  while (true) {
    const action = yield take(CONTRACT_FETCH)
    yield* asyncContractFetch(action)
  }
}

export default function* () {
  yield all([
    fork(watchContractFetch)
  ])
}
