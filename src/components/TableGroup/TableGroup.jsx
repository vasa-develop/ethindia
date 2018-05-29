import React, { Component } from 'react'

import Table from '../Table/Table'

import './TableGroup.scss'

class TableGroup extends Component {
  render() {
    const { style, data, address, methods } = this.props
    const left = Object.assign(data.left, data.data)
    const right = Object.assign(data.right, data.data)

    return (
      <div className="TableGroup" style={style}>
        <Table data={left} classes={data.classes ? data.classes : ''} address={address} methods={methods} />
        <Table data={right} classes={data.classes ? data.classes : ''} address={address} methods={methods} />
      </div>
    )
  }
}

export default TableGroup