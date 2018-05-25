import React, { Component } from 'react'

import List from '../List/List'

import './ListGroup.scss'

class ListGroup extends Component {
  render() {
    const { style, data, address, network, currentWETHExchangeRate } = this.props
    const left = Object.assign(data.left, data.data)
    const right = Object.assign(data.right, data.data)

    return (
      <div className="ListGroup" style={style}>
        <List data={left} classes={data.classes ? data.classes : ''} address={address} network={network} currentWETHExchangeRate={currentWETHExchangeRate} />
        <List data={right} classes={data.classes ? data.classes : ''} address={address} network={network} currentWETHExchangeRate={currentWETHExchangeRate} />
      </div>
    )
  }
}

export default ListGroup