import React, { Component } from 'react'
import axios from 'axios'

import * as lendroid from 'lendroid'

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
  constructor(props) {
    super(props)

    const { address, network } = props
    this.state = {
      LendroidJS: new lendroid.Lendroid({ metamask: { address, network } }),
    }
    this.state.LendroidJS.reset({ address, network }, () => this.forceUpdate())

    this.apiPost = this.apiPost.bind(this)
  }

  componentWillReceiveProps(newProps) {
    const { address, network } = this.props

    if (newProps.address !== address || newProps.network !== network) {
      this.state.LendroidJS.reset({ address: newProps.address, network: newProps.network }, () => this.forceUpdate())
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
    const { address } = this.props
    const { LendroidJS } = this.state
    const { loading, orders, exchangeRates, contracts } = LendroidJS
    const offers = orders.orders
    const myLendOffers = orders.myOrders.lend
    const myBorrowOffers = orders.myOrders.borrow
    const { currentWETHExchangeRate } = exchangeRates
    const positions = this.getPositionsData()
    const methods = {
      // Form Tab
      onCreateOrder: LendroidJS.onCreateOrder,
      onWrapETH: LendroidJS.onWrapETH,
      onAllowance: LendroidJS.onAllowance,

      // Table & List
      getOffers: LendroidJS.fetchOrders,
      getPositions: LendroidJS.fetchLoanPositions,
      onPostLoans: LendroidJS.onPostLoans,
      onFillLoan: LendroidJS.onFillLoan,
      onClosePosition: LendroidJS.onClosePosition,
      onCleanContract: LendroidJS.onCleanContract,
      onTopUpPosition: LendroidJS.onTopUpPosition,
      onDeleteOrder: LendroidJS.onDeleteOrder,
      onCancelOrder: LendroidJS.onCancelOrder,
    }

    return (
      <div className="OrdersWrapper">
        <Header
          address={address} contracts={contracts}
        />
        <FormTab methods={methods}
          address={address} contracts={contracts}
          loading={loading} />
        <TableGroup methods={methods}
          address={address}
          data={{ left: Tables[0], right: Tables[1], classes: "first", data: { offers } }}
          loading={loading.orders} />
        <ListGroup methods={methods}
          address={address} contracts={contracts}
          currentWETHExchangeRate={currentWETHExchangeRate} data={{ left: Tables[2], right: Tables[3], data: { myLendOffers, myBorrowOffers } }}
          loading={loading.orders}
          style={{ marginBottom: 29 }} />
        <ListGroup methods={methods}
          address={address} contracts={contracts}
          currentWETHExchangeRate={currentWETHExchangeRate} data={{ left: Tables[4], right: Tables[5], data: positions }}
          loading={loading.positions} />
      </div>
    )
  }
}

export default Orders
