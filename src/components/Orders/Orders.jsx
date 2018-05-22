import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'

import TableGroup from '../TableGroup/TableGroup'
import ListGroup from '../ListGroup/ListGroup'
import FormTab from '../FormTab/FormTab'
import Header from '../Header/Header'

import Tables from '../../assets/Tables'
import API from '../../assets/API'

import 'react-tabs/style/react-tabs.scss'
import './Orders.scss'

class Orders extends Component {
  constructor(props, context) {
    super(props)

    this.state = {
      offers: [],
      myLendOffers: [],
      myBorrowOffers: [],
      headerSync: false,
      syncData: {},
    }

    this.apiGet = this.apiGet.bind(this)
    this.apiPost = this.apiPost.bind(this)
    this.getOffers = this.getOffers.bind(this)
  }

  componentDidMount() {
    this.getOffers()
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

  onAddressChange() {
    this.getOffers()
  }

  onSync(origin = null, compare = true) {
    this.setState({ headerSync: true, syncData: { origin, compare } })
  }

  onSynced(title) {
    if (title === 'header') this.setState({ headerSync: false })
  }

  render() {
    const { web3 } = this.context
    const { offers, myLendOffers, myBorrowOffers, headerSync, syncData } = this.state
    const methods = { apiGet: this.apiGet, apiPost: this.apiPost, getOffers: this.getOffers }

    return (
      <div className="OrdersWrapper">
        <Header address={web3.selectedAccount} network={web3.networkId} isSync={headerSync} syncData={syncData} onSynced={this.onSynced.bind(this)} onAddressChange={this.onAddressChange.bind(this)} />
        <FormTab methods={methods} address={web3.selectedAccount} network={web3.networkId} onSync={this.onSync.bind(this)} />
        <TableGroup address={web3.selectedAccount} data={{ left: Tables[0], right: Tables[1], classes: "first", data: { offers } }} />
        <ListGroup address={web3.selectedAccount} data={{ left: Tables[2], right: Tables[3], data: { myLendOffers, myBorrowOffers } }} style={{ marginBottom: 29 }} />
        <ListGroup address={web3.selectedAccount} data={{ left: Tables[4], right: Tables[5] }} />
      </div>
    )
  }
}

Orders.contextTypes = {
  web3: PropTypes.object
};

export default Orders
