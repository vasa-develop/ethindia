import * as Constants from './constants'
import {
  FetchETHBallance,
  FetchContractByToken,
  FetchBallanceByToken,
  FetchAllowanceByToken,
  FetchLoanPositions,
  FetchOrders,
  WrapETH,
  Allowance,
  GetTokenExchangeRate,
  Logger, LoggerContext,
} from './services'

export class Lendroid {
  constructor(initParams) {
    this.apiEndpoint = initParams.apiEndpoint || Constants.API_ENDPOINT
    this.web3 = initParams.web3
    this.metamask = initParams.metamask
    this.exchangeRates = Constants.DEFAULT_EXCHANGES
    this.stateCallback = null
    this.getETD()
    this.getETW()
    this.init()
    Logger.info(LoggerContext.INIT, { apiEndpoint: this.apiEndpoint, metamask: this.metamask })
    this.getAddress = this.getAddress.bind(this)
    this.fetchOrders = this.fetchOrders.bind(this)
    this.fetchETHBallance = this.fetchETHBallance.bind(this)
    this.fetchBallanceByToken = this.fetchBallanceByToken.bind(this)
    this.fetchAllowanceByToken = this.fetchAllowanceByToken.bind(this)
    this.fetchLoanPositions = this.fetchLoanPositions.bind(this)
    this.onWrapETH = this.onWrapETH.bind(this)
    this.onAllowance = this.onAllowance.bind(this)
  }

  init() {
    this.contracts = Constants.DEFAULT_CONTRACTS
    this.orders = Constants.DEFAULT_ORDERS
    this.loading = Constants.DEFAULT_LOADINGS
  }

  reset(metamask, stateCallback) {
    Logger.info(LoggerContext.RESET, metamask)
    this.metamask = metamask
    this.stateCallback = stateCallback
    if (metamask.network) {
      this.init()
      this.fetchETHBallance()
      this.fetchContracts()
      this.fetchOrders()
    }
  }

  getAddress() { return this.metamask.address }

  fetchOrders() {
    const { address } = this.metamask

    this.loading.orders = true

    FetchOrders((err, orders) => {
      this.loading.orders = false
      if (err) return Logger.error(LoggerContext.API_ERROR, err.message)

      this.orders.myOrders.lend = orders.filter(item => (item.lender === address))
      this.orders.myOrders.borrow = orders.filter(item => (item.borrower === address))
      this.orders.orders = orders.filter(item => (item.lender !== address && item.borrower !== address))
    })
  }

  fetchETHBallance() {
    const { web3, metamask } = this
    const { address } = metamask

    FetchETHBallance({ web3, address }, (err, res) => {
      if (err) return Logger.error(LoggerContext.CONTRACT_ERROR, err.message)
      this.contracts.balances.ETH = res.data
      this.stateCallback()
    })
    setTimeout(this.fetchETHBallance, 5000)
  }

  fetchBallanceByToken(token) {
    const { web3, metamask } = this
    const { address } = metamask
    if (!this.contracts.contracts[token]) return

    FetchBallanceByToken({ web3, contractInstance: this.contracts.contracts[token], address }, (err, res) => {
      if (err) return Logger.error(LoggerContext.CONTRACT_ERROR, err.message)
      this.contracts.balances[token] = res.data
      this.stateCallback()
    })
    setTimeout(this.fetchBallanceByToken, 5000, token)
  }

  fetchAllowanceByToken(token) {
    const { web3, metamask } = this
    const { address } = metamask
    if (!this.contracts.contracts[token]) return

    FetchAllowanceByToken({ web3, contractInstance: this.contracts.contracts[token], address }, (err, res) => {
      if (err) return Logger.error(LoggerContext.CONTRACT_ERROR, err.message)
      this.contracts.allowances[token] = res.data
      this.stateCallback()
    })
    setTimeout(this.fetchAllowanceByToken, 5000, token)
  }

  fetchLoanPositions() {
    const { web3, metamask, contracts } = this
    const { address } = metamask
    const { Loan, LoanRegistry } = contracts.contracts
    this.loading.positions = true

    FetchLoanPositions({ web3, address, Loan, LoanRegistry }, (err, res) => {
      this.loading.positions = false
      if (err) return Logger.error(LoggerContext.CONTRACT_ERROR, err.message)
      this.contracts.positions = res.positions
      this.stateCallback()
    })
  }

  fetchContracts() {
    Constants.ContractTokens.forEach(token => {
      this.fetchContractByToken(token)
    })
  }

  fetchContractByToken(token) {
    const { web3, metamask } = this
    const { network } = metamask

    FetchContractByToken(token, { web3, network }, (err, res) => {
      if (err) return Logger.error(LoggerContext.CONTRACT_ERROR, err.message)
      this.contracts.contracts[token] = res.data

      if (Constants.BallanceTokens.indexOf(token) !== -1) {
        this.fetchBallanceByToken(token)
        this.fetchAllowanceByToken(token)
      }

      if (token === 'LoanRegistry' || token === 'Loan') {
        if (this.contracts.contracts.Loan && this.contracts.contracts.LoanRegistry) {
          this.fetchLoanPositions()
        }
      }
    })
  }

  onWrapETH(amount, isWrap) {
    const { web3, contracts } = this
    const WETHContractInstance = contracts.contracts.WETH
    if (!WETHContractInstance) return

    WrapETH({ web3, amount, isWrap, WETHContractInstance }, (err, hash) => {
      if (err) return Logger.error(LoggerContext.CONTRACT_ERROR, err.message)
      this.loading.wrapping = true
      this.stateCallback()
      const wrapInterval = setInterval(() => {
        web3.eth.getTransactionReceipt(hash, (err, res) => {
          if (err) return Logger.error(LoggerContext.CONTRACT_ERROR, err.message)
          if (res && res.status) {
            this.loading.wrapping = false
            setTimeout(() => this.stateCallback(), 6000)
            clearInterval(wrapInterval)
          }
        })
      }, 3000)
    })
  }

  onAllowance(token, newAllowance) {
    const { web3, contracts, metamask } = this
    const { address } = metamask
    const tokenContractInstance = contracts.contracts[token]
    const tokenAllowance = contracts.allowances[token]
    if (newAllowance === tokenAllowance) return

    Allowance({ web3, address, tokenContractInstance, tokenAllowance, newAllowance }, (err, hash) => {
      if (err) return Logger.error(LoggerContext.CONTRACT_ERROR, err.message)
      this.loading.allowance = true
      this.stateCallback()
      const allowanceInterval = setInterval(() => {
        web3.eth.getTransactionReceipt(hash, (err, res) => {
          if (err) return Logger.error(LoggerContext.CONTRACT_ERROR, err.message)
          if (res && res.status) {
            this.loading.allowance = false
            setTimeout(() => this.stateCallback(), 6000)
            clearInterval(allowanceInterval)
          }
        })
      }, 3000)
    })
  }

  getETW() {
    const _ = this
    GetTokenExchangeRate('WETH', (rate) => {
      _.exchangeRates.currentWETHExchangeRate = rate
    })
  }

  getETD() {
    const _ = this
    GetTokenExchangeRate('DAI', (rate) => {
      _.exchangeRates.currentDAIExchangeRate = rate
    })
  }
}
