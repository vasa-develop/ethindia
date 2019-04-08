import React, { Component } from 'react'

import Table from '../Table/Table'

import './TableGroup.scss'

class TableGroup extends Component {
  render() {
    const {
      style,
      data,
      address,
      methods,
      loading,
      lastFetchTime,
      web3Utils,
      terms = 1
    } = this.props
    const offers = (data.data.offers.slice() || []).filter(
      offer => parseInt(offer.loanDuration, 10) === terms * 30 * 24 * 3600
    )

    const left = Object.assign(
      data.left,
      { offers },
      { loading, lastFetchTime }
    )
    const right = Object.assign(
      data.right,
      { offers },
      {
        loading,
        lastFetchTime
      }
    )

    return (
      <div className="TableGroup" style={style}>
        <Table
          data={left}
          classes={data.classes ? data.classes : ''}
          address={address}
          methods={methods}
          web3Utils={web3Utils}
          terms={terms}
        />
        <Table
          data={right}
          classes={data.classes ? data.classes : ''}
          address={address}
          methods={methods}
          web3Utils={web3Utils}
          terms={terms}
        />
      </div>
    )
  }
}

export default TableGroup
