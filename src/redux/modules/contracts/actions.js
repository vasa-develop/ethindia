import { createAction } from 'redux-actions'
import { createPromiseAction } from '../utils'

/**
 * Action Types
 */

export const CONTRACT_FETCH = 'contract/CONTRACT_FETCH'
export const CONTRACT_FETCH_WETH = 'contract/CONTRACT_FETCH_WETH'
export const CONTRACT_FETCH_DAI = 'contract/CONTRACT_FETCH_DAI'
export const CONTRACT_FETCH_LST = 'contract/CONTRACT_FETCH_LST'
export const CONTRACT_FETCH_LOANOFFERREGISTRY = 'contract/CONTRACT_FETCH_LOANOFFERREGISTRY'
export const CONTRACT_FETCH_SUCCESS = 'contract/CONTRACT_FETCH_SUCCESS'
export const TOKEN_BALANCE = 'contract/TOKEN_BALANCE'
export const TOKEN_BALANCE_WETH = 'contract/TOKEN_BALANCE_WETH'
export const TOKEN_BALANCE_DAI = 'contract/TOKEN_BALANCE_DAI'
export const TOKEN_BALANCE_LST = 'contract/TOKEN_BALANCE_LST'
export const TOKEN_BALANCE_LOANOFFERREGISTRY = 'contract/TOKEN_BALANCE_LOANOFFERREGISTRY'
export const TOKEN_BALANCE_SUCCESS = 'contract/TOKEN_BALANCE_SUCCESS'

/**
 * Action Creators
 */
export const contractActionCreators = {
  contractFetchWeth: createPromiseAction(CONTRACT_FETCH_WETH),
  contractFetchDai: createPromiseAction(CONTRACT_FETCH_DAI),
  contractFetchLst: createPromiseAction(CONTRACT_FETCH_LST),
  contractFetchLoanOfferRegistry: createPromiseAction(CONTRACT_FETCH_LOANOFFERREGISTRY),
  contractFetchSuccess: createAction(CONTRACT_FETCH_SUCCESS),
  tokenBalanceWeth: createPromiseAction(TOKEN_BALANCE_WETH),
  tokenBalanceDai: createPromiseAction(TOKEN_BALANCE_DAI),
  tokenBalanceLst: createPromiseAction(TOKEN_BALANCE_LST),
  tokenBalanceLoanOfferRegistry: createPromiseAction(TOKEN_BALANCE_LOANOFFERREGISTRY),
  tokenBalanceSuccess: createAction(TOKEN_BALANCE_SUCCESS)
}