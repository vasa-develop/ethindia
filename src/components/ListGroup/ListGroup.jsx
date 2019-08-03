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
      isOffer
    } = this.props

    const right = Object.assign(data.right, data.data, { loading })

    return (
      <div className="ListGroup" style={style}>
        <List
          data={right}
          classes={data.classes ? data.classes : ''}
          address={address}
          currentWETHExchangeRate={currentWETHExchangeRate}
          methods={methods}
          contracts={contracts}
          web3Utils={web3Utils}
          isOffer={isOffer}
        />
      </div>
    )
  }
}

export default ListGroup
