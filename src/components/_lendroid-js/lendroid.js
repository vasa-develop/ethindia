import * as Constants from './constants'
import {
  FetchETHBallance,
  FetchContractByToken,
  FetchBallanceByToken,
  FetchAllowanceByToken,
  FetchLoanPositions,
  FillLoan,
  ClosePosition,
  FetchOrders,
  CreateOrder,
  PostLoans,
  CancelOrder,
  WrapETH,
  Allowance,
  GetTokenExchangeRate,
  Logger, LoggerContext, DeleteOrder,
} from './services'

export class Lendroid {
  constructor(initParams) {
    this.apiEndpoint = initParams.apiEndpoint || Constants.API_ENDPOINT
    this.apiLoanRequests = initParams.apiLoanRequests || Constants.API_LOAN_REQUESTS
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
    this.onCreateOrder = this.onCreateOrder.bind(this)
    this.onDeleteOrder = this.onDeleteOrder.bind(this)
    this.onWrapETH = this.onWrapETH.bind(this)
    this.onAllowance = this.onAllowance.bind(this)
    this.onPostLoans = this.onPostLoans.bind(this)
    this.onFillLoan = this.onFillLoan.bind(this)
    this.onClosePosition = this.onClosePosition.bind(this)
    this.onCancelOrder = this.onCancelOrder.bind(this)
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
    this.stateCallback()

    FetchOrders(this.apiEndpoint, (err, orders) => {
      this.loading.orders = false
      if (err) return Logger.error(LoggerContext.API_ERROR, err.message)

      this.orders.myOrders.lend = orders.offers.filter(item => (item.lender === address))
      this.orders.myOrders.borrow = orders.offers.filter(item => (item.borrower === address))
      this.orders.orders = orders.offers.filter(item => (item.lender !== address && item.borrower !== address))
      setTimeout(() => this.stateCallback(), 1000)
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
    if (!this.contracts.contracts[token] || !this.contracts.contracts.TokenTransferProxy) return

    FetchAllowanceByToken({
      web3,
      address,
      contractInstance: this.contracts.contracts[token],
      tokenTransferProxyContract: this.contracts.contracts.TokenTransferProxy
    }, (err, res) => {
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
    this.fetchContractByToken('TokenTransferProxy', () => {
      Constants.ContractTokens.forEach(token => {
        this.fetchContractByToken(token)
      })
    })
  }

  fetchContractByToken(token, callback) {
    const { web3, metamask } = this
    const { network } = metamask

    FetchContractByToken(token, { web3, network }, (err, res) => {
      if (err) return Logger.error(LoggerContext.CONTRACT_ERROR, err.message)
      this.contracts.contracts[token] = res.data
      if (callback) {
        return callback();
      }

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

  fillZero(len = 40) {
    return '0x' + (new Array(len)).fill(0).join('')
  }

  onCreateOrder(postData) {
    const { web3, contracts, metamask } = this
    const { address } = metamask

    // 1. an array of addresses[6] in this order: lender, borrower, relayer, wrangler, collateralToken, loanToken
    const addresses = [
      postData.lender = postData.lender.length ? postData.lender : this.fillZero(),
      postData.borrower = postData.borrower.length ? postData.borrower : this.fillZero(),
      postData.relayer = postData.relayer.length ? postData.relayer : this.fillZero(),
      postData.wrangler,
      postData.collateralToken,
      postData.loanToken
    ]

    // 2. an array of uints[9] in this order: loanAmountOffered, interestRatePerDay, loanDuration, offerExpiryTimestamp, relayerFeeLST, monitoringFeeLST, rolloverFeeLST, closureFeeLST, creatorSalt
    const values = [
      postData.loanAmountOffered = web3.toWei(postData.loanAmountOffered, 'ether'),
      postData.interestRatePerDay = web3.toWei(postData.interestRatePerDay, 'ether'),
      postData.loanDuration,
      postData.offerExpiry,
      postData.relayerFeeLST = web3.toWei(postData.relayerFeeLST, 'ether'),
      postData.monitoringFeeLST = web3.toWei(postData.monitoringFeeLST, 'ether'),
      postData.rolloverFeeLST = web3.toWei(postData.rolloverFeeLST, 'ether'),
      postData.closureFeeLST = web3.toWei(postData.closureFeeLST, 'ether'),
      postData.creatorSalt
    ]

    const LoanOfferRegistryContractInstance = contracts.contracts ? contracts.contracts.LoanOfferRegistry : null

    const onSign = (orderHash) => {
      web3.eth.sign(address, orderHash, (err, result) => {
        if (err) return

        postData.ecSignatureCreator = result
        result = result.substr(2)

        postData.rCreator = '0x' + result.slice(0, 64)
        postData.sCreator = '0x' + result.slice(64, 128)
        postData.vCreator = web3.toDecimal('0x' + result.slice(128, 130))

        CreateOrder(this.apiEndpoint, postData, (err, result) => {
          if (err) return Logger.error(LoggerContext.API_ERROR, err.message)
          setTimeout(this.fetchOrders, 2000)
        })
      })
    }

    const onOrderHash = (err, result) => {
      if (err) return
      onSign(result)
    }
    LoanOfferRegistryContractInstance.computeOfferHash(addresses, values, onOrderHash)
  }

  onDeleteOrder(id, callback) {
    DeleteOrder(this.apiEndpoint, id, callback)
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
          if (res) {
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
    const tokenTransferProxyContract = contracts.contracts.TokenTransferProxy
    const tokenAllowance = contracts.allowances[token]
    if (newAllowance === tokenAllowance) return

    Allowance({
      web3,
      tokenContractInstance,
      tokenAllowance,
      newAllowance,
      tokenTransferProxyContract,
    }, (err, hash) => {
      if (err) return Logger.error(LoggerContext.CONTRACT_ERROR, err.message)
      this.loading.allowance = true
      this.stateCallback()
      const allowanceInterval = setInterval(() => {
        web3.eth.getTransactionReceipt(hash, (err, res) => {
          if (err) return Logger.error(LoggerContext.CONTRACT_ERROR, err.message)
          if (res && res.status) {
            this.loading.allowance = false
            setTimeout(() => this.stateCallback(), 8000)
            clearInterval(allowanceInterval)
          }
        })
      }, 3000)
    })
  }

  onPostLoans(data, callback) {
    PostLoans(this.apiLoanRequests, data, callback)
  }

  onFillLoan(approval, callback) {
    const { contracts } = this
    const LoanOfferRegistryContractInstance = contracts.contracts.LoanOfferRegistry
    FillLoan({ approval, LoanOfferRegistryContractInstance }, callback)
  }

  onClosePosition(data, callback) {
    ClosePosition({ data }, (err, result) => {
      if (err) Logger.error(LoggerContext.CONTRACT_ERROR, err.message)
      callback(err, result)
    })
  }

  onCancelOrder(data, callback) {
    const { web3, contracts } = this
    const LoanOfferRegistryContractInstance = contracts.contracts.LoanOfferRegistry
    const { currentWETHExchangeRate } = this.exchangeRates
    CancelOrder({ web3, data, currentWETHExchangeRate, LoanOfferRegistryContractInstance }, (err, result) => {
      if (err) Logger.error(LoggerContext.CONTRACT_ERROR, err.message)
      callback(err, result)
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
