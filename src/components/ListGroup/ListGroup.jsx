import React, { Component } from 'react'

import List from '../List/List'

import './ListGroup.scss'

class ListGroup extends Component {
  render() {
    const {
      style,
      data,
      address,
      currentWETHExchangeRate,
      methods,
      loading,
      contracts,
      web3Utils,
      terms
    } = this.props
    const myLendOffers = (data.data.myLendOffers || [])
      .slice()
      .filter(
        offer => parseInt(offer.loanDuration, 10) === terms * 30 * 24 * 3600
      )
    const myBorrowOffers = (data.data.myBorrowOffers || [])
      .slice()
      .filter(
        offer => parseInt(offer.loanDuration, 10) === terms * 30 * 24 * 3600
      )
    const left = Object.assign(
      data.left,
      terms ? { myLendOffers } : data.data,
      { loading }
    )
    const right = Object.assign(
      data.right,
      terms ? { myBorrowOffers } : data.data,
      { loading }
    )

    return (
      <div className="ListGroup" style={style}>
        <List
          data={left}
          classes={data.classes ? data.classes : ''}
          address={address}
          currentWETHExchangeRate={currentWETHExchangeRate}
          methods={methods}
          contracts={contracts}
          web3Utils={web3Utils}
          terms={terms}
        />
        <List
          data={right}
          classes={data.classes ? data.classes : ''}
          address={address}
          currentWETHExchangeRate={currentWETHExchangeRate}
          methods={methods}
          contracts={contracts}
          web3Utils={web3Utils}
          terms={terms}
        />
      </div>
    )
  }
}

export default ListGroup
