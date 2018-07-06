import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { compose } from 'recompose'

import { Lendroid } from '../_lendroid-js'

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

  constructor(props) {
    super(props)

    const { address, network } = props
    this.state = {
      LendroidJS: new Lendroid({ web3: window.web3, metamask: { address, network } }),
      syncData: {},
    }

    this.apiPost = this.apiPost.bind(this)
  }

  componentDidMount() {
    const { address, network } = this.props

    this.getContracs(address, network)
  }

  componentWillReceiveProps(newProps) {
    const { address, network } = this.props

    if (newProps.address !== address || newProps.network !== network) {
      this.state.LendroidJS.reset({ address: newProps.address, network: newProps.network }, () => this.forceUpdate())
      this.getContracs(newProps.address, newProps.network)
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
        contractFetchWranglerLoanRegistry,
        tokenBalanceWeth,
        tokenBalanceDai,
        tokenBalanceLst,
        tokenAllowanceWeth,
        tokenAllowanceDai,
        tokenAllowanceLst,
      } = this.props
      const { web3 } = window

      promisify(contractETHBlance, { web3, address })
        .then(res => { /*console.log(res)*/ })
        .catch(e => { console.log(e) })

      promisify(contractFetchWeth, { web3, network })
        .then(res => {
          promisify(tokenBalanceWeth, { web3, contractInstance: res, address })
            .then(res => { /*console.log(res)*/ })
            .catch(e => { console.log(e) })

          promisify(tokenAllowanceWeth, { web3, contractInstance: res, address })
            .then(res => { /*console.log(res)*/ })
            .catch(e => { console.log(e) })
        })
        .catch(e => { console.log(e) })

      promisify(contractFetchDai, { web3, network })
        .then(res => {
          promisify(tokenBalanceDai, { web3, contractInstance: res, address })
            .then(res => { /*console.log(res)*/ })
            .catch(e => { console.log(e) })

          promisify(tokenAllowanceDai, { web3, contractInstance: res, address })
            .then(res => { /*console.log(res)*/ })
            .catch(e => { console.log(e) })
        })
        .catch(e => { console.log(e) })

      promisify(contractFetchLst, { web3, network })
        .then(res => {
          promisify(tokenBalanceLst, { web3, contractInstance: res, address })
            .then(res => { /*console.log(res)*/ })
            .catch(e => { console.log(e) })

          promisify(tokenAllowanceLst, { web3, contractInstance: res, address })
            .then(res => { /*console.log(res)*/ })
            .catch(e => { console.log(e) })
        })
        .catch(e => { console.log(e) })

      promisify(contractFetchLoanOfferRegistry, { web3, network })
        .then(res => { /*console.log(res)*/ })
        .catch(e => { console.log(e) })

      promisify(contractFetchLoanRegistry, { web3, network })
        .then(res => {
          /*console.log(res)*/

          promisify(contractFetchLoan, { web3, network })
            .then(res => { /*console.log(res)*/ })
            .catch(e => { console.log(e) })
        })
        .catch(e => { console.log(e) })

      promisify(contractFetchWranglerLoanRegistry, { web3, network })
        .then(res => { /*console.log(res)*/ })
        .catch(e => { console.log(e) })
    }
  }

  getPositionsData() {
    const { LendroidJS } = this.state
    const { contracts: { positions }, exchangeRates: { currentDAIExchangeRate } } = LendroidJS
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
    const { LendroidJS } = this.state
    const { loading, orders, exchangeRates, contracts } = LendroidJS
    const offers = orders.orders
    const myLendOffers = orders.myOrders.lend
    const myBorrowOffers = orders.myOrders.borrow
    const { currentWETHExchangeRate } = exchangeRates
    const positions = this.getPositionsData()
    const methods = {
      apiPost: this.apiPost,
      getOffers: LendroidJS.fetchOrders,
      getPositions: LendroidJS.fetchLoanPositions,

      // Form Tab
      onCreateOrder: LendroidJS.onCreateOrder,
      onWrapETH: LendroidJS.onWrapETH,
      onAllowance: LendroidJS.onAllowance,
    }

    return (
      <div className="OrdersWrapper">
        <Header address={web3.selectedAccount} contracts={contracts} />
        <FormTab methods={methods} address={web3.selectedAccount} contracts={contracts} loading={loading} />
        <TableGroup methods={methods} address={web3.selectedAccount} data={{ left: Tables[0], right: Tables[1], classes: "first", data: { offers } }} loading={loading.orders} />
        <ListGroup methods={methods} address={web3.selectedAccount} currentWETHExchangeRate={currentWETHExchangeRate} data={{ left: Tables[2], right: Tables[3], data: { myLendOffers, myBorrowOffers } }} loading={loading.orders} style={{ marginBottom: 29 }} />
        <ListGroup methods={methods} address={web3.selectedAccount} currentWETHExchangeRate={currentWETHExchangeRate} data={{ left: Tables[4], right: Tables[5], data: positions }} loading={loading.positions} />
      </div>
    )
  }
}

Orders.contextTypes = {
  web3: PropTypes.object
}

export default compose(
  connectContract(),
)(Orders)
