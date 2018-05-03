import React, { Component } from 'react'

import Table from '../Table/Table'

import './TableGroup.scss'

class TableGroup extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { style, data } = this.props
    const left = Object.assign(data.left, data.data)
    const right = Object.assign(data.right, data.data)

    return (
      <div className="TableGroup" style={style}>
        <Table data={left} classes={data.classes ? data.classes : ''} />
        <Table data={right} classes={data.classes ? data.classes : ''} />
      </div>
    )
  }
}

export default TableGroup