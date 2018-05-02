import React, { Component } from 'react'

import Table from '../Table/Table'

import './TableGroup.scss'

class TableGroup extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { style, data } = this.props
    return (
      <div className="TableGroup" style={style}>
        <Table data={data.left} classes={data.classes ? data.classes : ''} />
        <Table data={data.right} classes={data.classes ? data.classes : ''} />
      </div>
    )
  }
}

export default TableGroup