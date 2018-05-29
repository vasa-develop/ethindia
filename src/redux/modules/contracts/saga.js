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
  contractActionCreators,
  ETH_BALANCE,
  CONTRACT_FETCH,
  TOKEN_BALANCE,
  TOKEN_ALLOWANCE,
} from './actions'

import { ContractAddresses } from './constants'

function fromBigToNumber(big) {
  if (!big.c) return 0
  return Number((big.c[0] / 10000).toString() + (big.c[1] || '').toString())
}

export function* asyncETHBlance({ payload, resolve, reject }) {
  try {
    const { address, web3, origin, compare } = payload
    const balances = {}

    const response = yield new Promise((resolve, reject) => {
      if (!web3) resolve({})
      web3.eth.getBalance(address, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })

    const value = fromBigToNumber(response)
    if (!origin || (compare ? (value > origin) : (value < origin))) {
      balances.ETH = value
      yield put(contractActionCreators.tokenBalanceSuccess({ balances }))
      resolve(balances);
    } else {
      reject({ message: 'No Update' })
    }
  } catch (e) {
    reject(e)
  }
}

export function* watchETHBalance() {
  while (true) {
    const action = yield take(ETH_BALANCE)
    yield* asyncETHBlance(action)
  }
}

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
            resolve(contracts[token]);
          } else {
            const contractABI = ContractAddresses[token].def
            contracts[token] = web3.eth.contract(contractABI).at(ContractAddresses[token][network])
            yield put(contractActionCreators.contractFetchSuccess({ contracts }))
            resolve(contracts[token]);
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
      yield* function* ({ payload, resolve, reject }, token) {
        try {
          const { address, contractInstance, origin, compare } = payload
          const balances = {}

          const response = yield new Promise((resolve, reject) => {
            if (!contractInstance.balanceOf) resolve({})
            contractInstance.balanceOf(address, (err, result) => {
              if (err) return reject(err)
              resolve(result);
            })
          })

          const value = fromBigToNumber(response)
          if (!origin || (compare ? (value > origin) : (value < origin))) {
            balances[token] = value
            yield put(contractActionCreators.tokenBalanceSuccess({ balances }))
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

function watchTokenAllowanceByToken(token) {
  return function* () {
    while (true) {
      const action = yield take(TOKEN_ALLOWANCE + '_' + token.toUpperCase())
      yield* function* ({ payload, resolve, reject }, token) {
        try {
          const { address, contractInstance, origin } = payload
          const allowances = {}

          const response = yield new Promise((resolve, reject) => {
            if (!contractInstance.allowance) resolve({})
            contractInstance.allowance(address, contractInstance.address, (err, result) => {
              if (err) return reject(err)
              resolve(result);
            })
          })

          const value = fromBigToNumber(response)
          if (!origin || value === origin) {
            allowances[token] = value
            yield put(contractActionCreators.tokenAllowanceSuccess({ allowances }))
            resolve(allowances);
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
  const forks = [
    fork(watchETHBalance)
  ]

  Object.keys(ContractAddresses).forEach(token => {
    forks.push(fork(watchContractFetchByToken(token)))
    forks.push(fork(watchTokenBalanceByToken(token)))
    forks.push(fork(watchTokenAllowanceByToken(token)))
  })

  yield all(forks)
}
