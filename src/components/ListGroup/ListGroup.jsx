import React, { Component } from 'react'

import List from '../List/List'

import './ListGroup.scss'

class ListGroup extends Component {
  render() {
    const { style, data, address, currentWETHExchangeRate, methods, loading, contracts } = this.props
    const left = Object.assign(data.left, data.data, { loading })
    const right = Object.assign(data.right, data.data, { loading })

    return (
      <div className="ListGroup" style={style}>
        <List data={left} classes={data.classes ? data.classes : ''}
          address={address} currentWETHExchangeRate={currentWETHExchangeRate}
          methods={methods} contracts={contracts} />
        <List data={right} classes={data.classes ? data.classes : ''}
          address={address} currentWETHExchangeRate={currentWETHExchangeRate}
          methods={methods} contracts={contracts} />
      </div>
    )
  }
}

export default ListGroup