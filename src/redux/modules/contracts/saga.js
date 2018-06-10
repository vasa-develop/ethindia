import "babel-polyfill"
import {
  put,
  // call,
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
  LOAN_POSITION,
} from './actions'

import { ContractAddresses } from './constants'

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

    const value = web3.fromWei(response, 'ether')
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
          const { web3, address, contractInstance, origin, compare } = payload
          const balances = {}

          const response = yield new Promise((resolve, reject) => {
            if (!contractInstance.balanceOf) resolve({})
            contractInstance.balanceOf(address, (err, result) => {
              if (err) return reject(err)
              resolve(result);
            })
          })

          const value = web3.fromWei(response, 'ether')
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
          const { web3, address, contractInstance, origin } = payload
          const allowances = {}

          const response = yield new Promise((resolve, reject) => {
            if (!contractInstance.allowance) resolve({})
            contractInstance.allowance(address, contractInstance.address, (err, result) => {
              if (err) return reject(err)
              resolve(result);
            })
          })

          const value = web3.fromWei(response, 'ether')
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


export function* asyncLoanPositions({ payload, resolve, reject }) {
  try {
    const { web3, address, LoanRegistry, Loan, currentDAIExchangeRate } = payload
    const LoanABI = Loan.abi

    const response = yield new Promise((resolve, reject) => {
      LoanRegistry.getLoanCounts(address, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })

    const counts = response.map(item => web3.fromWei(item, 'ether'))
    const positions = []

    for (let i = 0; i < counts[0]; i++) {
      const response = yield new Promise((resolve, reject) => {
        LoanRegistry.lentLoans(address, i, (err, result) => {
          if (err) return reject(err)
          resolve(result)
        })
      })
      positions.push({
        type: 'lent',
        address: response
      })
    }
    for (let i = 0; i < counts[1]; i++) {
      const response = yield new Promise((resolve, reject) => {
        LoanRegistry.borrowedLoans(address, i, (err, result) => {
          if (err) return reject(err)
          resolve(result)
        })
      })
      positions.push({
        type: 'borrowed',
        address: response
      })
    }

    for (let i = 0; i < positions.length; i++) {
      const position = positions[i]
      const LoanContract = web3.eth.contract(LoanABI).at(position.address)

      // a. `AMOUNT` is`Loan.loanAmountBorrowed()`
      // b. `TOTAL INTEREST` is`Loan.loanAmountOwed() - Loan.loanAmountBorrowed()`
      // c. `TERM` is`Loan.expiresAtTimestamp - currentTimestamp`
      // d. `LOAN HEALTH` is calculated as follows:
      //   i. `var currentCollateralAmount = Loan.loanAmountBorrowed() / eth_To_DAI_Rate`
      //   ii.display the result of`Loan.collateralAmount() / currentCollateralAmount * 100`
      const loanAmountBorrowed = yield new Promise((resolve, reject) => {
        LoanContract.loanAmountBorrowed((err, result) => {
          if (err) return reject(err)
          resolve(web3.fromWei(result.toString(), 'ether'))
        })
      })
      const loanAmountOwed = yield new Promise((resolve, reject) => {
        LoanContract.loanAmountOwed((err, result) => {
          if (err) return reject(err)
          resolve(web3.fromWei(result.toString(), 'ether'))
        })
      })
      const collateralAmount = yield new Promise((resolve, reject) => {
        LoanContract.collateralAmount((err, result) => {
          if (err) return reject(err)
          resolve(web3.fromWei(result.toString(), 'ether'))
        })
      })
      const expiresAtTimestamp = yield new Promise((resolve, reject) => {
        LoanContract.expiresAtTimestamp((err, result) => {
          if (err) return reject(err)
          resolve(('1' + result.toString()) * 1 * 100)
        })
      })

      position.loanNumber = address
      position.amount = loanAmountBorrowed
      position.totalInterest = loanAmountOwed - loanAmountBorrowed
      position.term = (expiresAtTimestamp - Date.now()) / 3600

      position.origin = {
        loanAmountBorrowed,
        loanAmountOwed,
        expiresAtTimestamp,
        collateralAmount,
      }
    }

    yield put(contractActionCreators.loanPositionSuccess({
      positions: {
        lent: positions.filter(position => (position.type === 'lent')),
        borrowed: positions.filter(position => (position.type === 'borrowed')),
      }
    }))
    resolve(positions);
  } catch (e) {
    reject(e)
  }
}

export function* watchLoanPositions() {
  while (true) {
    const action = yield take(LOAN_POSITION)
    yield* asyncLoanPositions(action)
  }
}

export default function* () {
  const forks = [
    fork(watchETHBalance),
    fork(watchLoanPositions),
  ]

  Object.keys(ContractAddresses).forEach(token => {
    forks.push(fork(watchContractFetchByToken(token)))
    forks.push(fork(watchTokenBalanceByToken(token)))
    forks.push(fork(watchTokenAllowanceByToken(token)))
  })

  yield all(forks)
}
