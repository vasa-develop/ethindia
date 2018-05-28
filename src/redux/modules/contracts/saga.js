import "babel-polyfill"
import {
  put,
  call,
  fork,
  all,
  take
} from 'redux-saga/effects'
import axios from 'axios'

import {
  CONTRACT_FETCH,
  TOKEN_BALANCE,
  contractActionCreators
} from './actions'

import { ContractAddresses } from './constants'

function watchContractFetchByToken(token) {
  return function* () {
    while (true) {
      const action = yield take(CONTRACT_FETCH + '_' + token.toUpperCase())
      yield* function* ({ payload, resolve, reject }, token) {
        try {
          const { web3, network } = payload
          const contracts = {}

          if (!ContractAddresses[token][network]) {
            return reject({ message: 'Unknown' })
          }

          if (!ContractAddresses[token].def) {
            const url = `https://${network === 1 ? 'api' : 'api-kovan'}.etherscan.io/api?module=contract&action=getabi&address=${ContractAddresses[token][network]}`
            let resData = yield axios.get(url)
            const contractABI = JSON.parse(resData.data.result)
            contracts[token] = web3.eth.contract(contractABI).at(ContractAddresses[token][network])
            yield put(contractActionCreators.contractFetchSuccess({ contracts }))
            resolve(contracts);
          } else {
            const contractABI = ContractAddresses[token].def
            contracts[token] = web3.eth.contract(contractABI).at(ContractAddresses[token][network])
            yield put(contractActionCreators.contractFetchSuccess({ contracts }))
            resolve(contracts);
          }
        } catch (e) {
          reject(e)
        }
      }(action, token)
    }
  }
}

function watchTokenBalanceByToken(token) {
  return function* () {
    while (true) {
      const action = yield take(TOKEN_BALANCE + '_' + token.toUpperCase())
      yield* function* ({ payload, resolve, reject, origin, compare }, token) {
        try {
          const { web3, network, address, contractInstance } = payload
          const balances = {}

          const response = yield contractInstance.balanceOf(address)
          const value = this.fromBigToNumber(response)
          if (origin === null || (compare ? (value > origin) : (value < origin))) {
            balances[token] = value
            yield put(contractActionCreators.contractFetchSuccess({ balances }))
            resolve(balances);
          } else {
            reject({ message: 'No Update' })
          }
        } catch (e) {
          reject(e)
        }
      }(action, token)
    }
  }
}

export default function* () {
  const forks = []

  Object.keys(ContractAddresses).forEach(token => {
    forks.push(fork(watchContractFetchByToken(token)))
    forks.push(fork(watchTokenBalanceByToken(token)))
  })

  yield all(forks)
}
