import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { compose } from 'recompose'

import { connectContract } from '../../redux/modules'
import { promisify } from '../../utilities'

import TableGroup from '../TableGroup/TableGroup'
import ListGroup from '../ListGroup/ListGroup'
import FormTab from '../FormTab/FormTab'
import Header from '../Header/Header'

import CreateTables from '../../assets/Tables'
import API from '../../assets/API'

import 'react-tabs/style/react-tabs.scss'
import './Orders.scss'

const Tables = CreateTables(window.web3)

class Orders extends Component {
  static propTypes = {
    contracts: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props)

    this.state = {
      offers: [],
      myLendOffers: [],
      myBorrowOffers: [],
      syncData: {},
      currentWETHExchangeRate: 0,
      currentDAIExchangeRate: 0,
    }

    this.apiGet = this.apiGet.bind(this)
    this.apiPost = this.apiPost.bind(this)
    this.getOffers = this.getOffers.bind(this)
    this.getETW = this.getETW.bind(this)
    this.getETD = this.getETD.bind(this)
  }

  componentDidMount() {
    this.getContracs(this.props.address, this.props.network)
    this.getOffers()
    this.getETW()
    this.getETD()
  }

  componentWillReceiveProps(newProps) {
    const { address, network } = this.props

    if (newProps.address !== address || newProps.network !== network) {
      this.getContracs(newProps.address, newProps.network)
      this.getOffers()
    }
  }

  getContracs(address, network) {
    if (network) {
      const {
        contractETHBlance,
        contractFetchWeth,
        contractFetchDai,
        contractFetchLst,
        contractFetchLoanOfferRegistry,
        contractFetchLoanRegistry,
        contractFetchLoan,
        tokenBalanceWeth,
        tokenBalanceDai,
        tokenBalanceLst,
        tokenAllowanceWeth,
        tokenAllowanceDai,
        tokenAllowanceLst,
      } = this.props
      const { web3 } = window

      promisify(contractETHBlance, { web3, address })
        .then(res => { console.log(res) })
        .catch(e => { console.log(e) })

      promisify(contractFetchWeth, { web3, network })
        .then(res => {
          promisify(tokenBalanceWeth, { web3, contractInstance: res, address })
            .then(res => { console.log(res) })
            .catch(e => { console.log(e) })

          promisify(tokenAllowanceWeth, { web3, contractInstance: res, address })
            .then(res => { console.log(res) })
            .catch(e => { console.log(e) })
        })
        .catch(e => { console.log(e) })

      promisify(contractFetchDai, { web3, network })
        .then(res => {
          promisify(tokenBalanceDai, { web3, contractInstance: res, address })
            .then(res => { console.log(res) })
            .catch(e => { console.log(e) })

          promisify(tokenAllowanceDai, { web3, contractInstance: res, address })
            .then(res => { console.log(res) })
            .catch(e => { console.log(e) })
        })
        .catch(e => { console.log(e) })

      promisify(contractFetchLst, { web3, network })
        .then(res => {
          promisify(tokenBalanceLst, { web3, contractInstance: res, address })
            .then(res => { console.log(res) })
            .catch(e => { console.log(e) })

          promisify(tokenAllowanceLst, { web3, contractInstance: res, address })
            .then(res => { console.log(res) })
            .catch(e => { console.log(e) })
        })
        .catch(e => { console.log(e) })

      promisify(contractFetchLoanOfferRegistry, { web3, network })
        .then(res => { console.log(res) })
        .catch(e => { console.log(e) })

      promisify(contractFetchLoanRegistry, { web3, network })
        .then(res => {
          console.log(res)

          promisify(contractFetchLoan, { web3, network })
            .then(res => {
              console.log(res)
              this.getPositions()
            })
            .catch(e => { console.log(e) })
        })
        .catch(e => { console.log(e) })
    }
  }

  getOffers() {
    this.apiGet('offers', (result) => {
      const address = this.context.web3.selectedAccount
      let offers = result.offers || []
      const myLendOffers = offers.filter(item => (item.lender === address))
      const myBorrowOffers = offers.filter(item => (item.borrower === address))
      offers = offers.filter(item => (item.lender !== address && item.borrower !== address))
      this.setState({ offers, myLendOffers, myBorrowOffers })
    })
  }

  getPositions() {
    const { contracts, address, loanPosition } = this.props
    const { currentDAIExchangeRate } = this.state
    const LoanRegistry = contracts.contracts.LoanRegistry
    const Loan = contracts.contracts.Loan
    promisify(loanPosition, { web3, address, LoanRegistry, Loan, currentDAIExchangeRate })
      .then(res => { console.log(res) })
      .catch(e => { console.log(e) })
  }

  getPositionsData() {
    const { contracts: { positions } } = this.props
    const { currentDAIExchangeRate } = this.state
    if (!positions || currentDAIExchangeRate === 0) return {}
    const positionsData = {
      lent: positions.lent.map(position => {
        const currentCollateralAmount = position.origin.loanAmountBorrowed / currentDAIExchangeRate
        return Object.assign({
          health: parseInt(position.origin.collateralAmount / currentCollateralAmount * 100, 10)
        }, position)
      }),
      borrowed: positions.borrowed.map(position => {
        const currentCollateralAmount = position.origin.loanAmountBorrowed / currentDAIExchangeRate
        return Object.assign({
          health: parseInt(position.origin.collateralAmount / currentCollateralAmount * 100, 10)
        }, position)
      }),
    }
    return positionsData
  }

  getETW() {
    const url = 'https://api.coinmarketcap.com/v1/ticker/weth//?convert=ETH'
    axios.get(url)
      .then(res => {
        const result = res.data[0]
        this.setState({
          currentWETHExchangeRate: 1 / result.price_eth
        }, () => {
          setTimeout(this.getETW, 12 * 1000)
        })
      })
  }

  getETD() {
    const url = 'https://api.coinmarketcap.com/v1/ticker/dai//?convert=ETH'
    axios.get(url)
      .then(res => {
        const result = res.data[0]
        this.setState({
          currentDAIExchangeRate: 1 / result.price_eth
        }, () => {
          setTimeout(this.getETD, 12 * 1000)
        })
      })
  }

  apiGet(endPoint, cb = null) {
    let url = API.baseURL
    url += API.endPoints[endPoint]

    axios.get(url)
      .then(res => {
        const result = res.data
        if (cb) cb(result)
      })
  }

  apiPost(endPoint, data, cb = null) {
    let url = API.baseURL
    url += API.endPoints[endPoint]

    axios.post(url, data)
      .then(res => {
        const result = res.data
        if (cb) cb(result)
      })
  }

  render() {
    const { web3 } = this.context
    const { offers, myLendOffers, myBorrowOffers, currentWETHExchangeRate } = this.state
    const positions = this.getPositionsData()
    const methods = { apiGet: this.apiGet, apiPost: this.apiPost, getOffers: this.getOffers }

    return (
      <div className="OrdersWrapper">
        <Header address={web3.selectedAccount} />
        <FormTab methods={methods} address={web3.selectedAccount} />
        <TableGroup methods={methods} address={web3.selectedAccount} data={{ left: Tables[0], right: Tables[1], classes: "first", data: { offers } }} />
        <ListGroup methods={methods} address={web3.selectedAccount} currentWETHExchangeRate={currentWETHExchangeRate} data={{ left: Tables[2], right: Tables[3], data: { myLendOffers, myBorrowOffers } }} style={{ marginBottom: 29 }} />
        <ListGroup methods={methods} address={web3.selectedAccount} currentWETHExchangeRate={currentWETHExchangeRate} data={{ left: Tables[4], right: Tables[5], data: positions }} />
      </div>
    )
  }
}

Orders.contextTypes = {
  web3: PropTypes.object
};

export default compose(
  connectContract(),
)(Orders)
