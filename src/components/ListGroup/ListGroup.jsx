import React, { Component } from 'react'

import List from '../List/List'

import './ListGroup.scss'

class ListGroup extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { style, data } = this.props
    const left = Object.assign(data.left, data.data)
    const right = Object.assign(data.right, data.data)

    return (
      <div className="ListGroup" style={style}>
        <List data={left} classes={data.classes ? data.classes : ''} />
        <List data={right} classes={data.classes ? data.classes : ''} />
      </div>
    )
  }
}

export default ListGroup