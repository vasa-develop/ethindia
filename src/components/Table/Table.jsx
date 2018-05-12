import React, { Component } from 'react'
import moment from 'moment'

import './Table.scss'

class Table extends Component {
  constructor(props) {
    super(props)
  }

  getData(data) {
    const { key, filter } = data.data
    if (key) {
      const ret = this.props.data[key] || []
      if (filter) return filter(ret)
      return ret
    }
    return data.data
  }

  addCommas(value) {
    return (value + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  }

  calcTerm(value) {
    const val = value.toString().split(' ')[0]
    return `${parseInt(value / 24)}d` + (value % 24 != 0 ? ` ${value % 24}h` : '')
  }

  setPrecision(value, prec) {
    const up = parseInt(value)
    const down = ('000' + parseInt(value * Math.pow(10, prec)).toString()).substr(-prec)
    return this.addCommas(up) + '.' + down
  }

  shortAddress(value) {
    return `${value.substr(0, 4)}...${value.substr(-4)}`
  }

  getDisplayData(data, header) {
    let ret = data[header.key]

    if (header.key === 'loanDuration') {
      ret = ret.split(' ')[0]
    }

    if (header.precision) ret = this.setPrecision(ret, header.precision)
    if (header.filter) ret = this[header.filter](ret)
    if (header.suffix) ret += header.suffix
    return ret
  }

  render() {
    const { data, classes } = this.props
    const filteredData = this.getData(data)

    return (
      <div className="TableWrapper">
        <div className="Title">{data.title}</div>
        <div class="tbl-header">
          <table cellpadding="0" cellspacing="0" border="0">
            <thead>
              <tr>
                {
                  data.headers.map(h => (
                    <th style={h.style}>{h.label}</th>
                  ))
                }
                <th></th>
              </tr>
            </thead>
          </table>
        </div>
        <div class={`tbl-content ${classes}`}>
          <div>
            <table cellpadding="0" cellspacing="0" border="0">
              <tbody>
                {
                  filteredData.map(d => (
                    <tr>
                      {
                        data.headers.map(h => (
                          <td style={h.style}>{this.getDisplayData(d, h)}</td>
                        ))
                      }
                      <td>
                        {
                          data.action.label === '3-dot' ?
                            <button style={data.action.style} className="three-dot">
                              <div className="dot" />
                              <div className="dot" />
                              <div className="dot" />
                            </button>
                            : <button style={data.action.style}>{data.action.label}</button>
                        }
                      </td>
                    </tr>
                  ))
                }
                {
                  filteredData.length === 0 && <tr><td colSpan={data.headers.length}>No Data</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default Table