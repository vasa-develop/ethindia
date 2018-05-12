import React, { Component } from 'react'
import moment from 'moment'

import './List.scss'

class List extends Component {
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
      <div className="ListWrapper">
        <div className="Title">{data.title}</div>
        <div className="Lists">
          {
            filteredData.map(d => (
              <div class={`List ${classes}`}>
                {
                  data.headers.map(h => (
                    <div className={`ListField ${h.key}`} style={h.style}>
                      <div className="Label">{h.label}</div>
                      <div className="Data">
                        {
                          h.key === 'health' ?
                            d[h.key] ?
                              <div className="HealthBar">
                                <div className="BarBase">
                                  <div className="Fill" style={{ width: `${d[h.key] * 0.5}%` }} />
                                </div>
                                <div className="BarMarks" />
                                <div className="BarPercent" style={{ marginLeft: `calc(${d[h.key] * 0.5}% - 13px)` }}>{this.getDisplayData(d, h)}</div>
                              </div>
                              : null
                            : this.getDisplayData(d, h)
                        }
                      </div>
                    </div>
                  ))
                }
                <div className="Actions">
                  {
                    data.action.label === '3-dot' ?
                      <button style={data.action.style} className="three-dot">
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                      </button>
                      : <button style={data.action.style} className={data.action.key}>{data.action.label}</button>
                  }
                </div>
              </div>
            ))
          }
          {
            filteredData.length === 0 && <div class={`List ${classes}`}>No Data</div>
          }
        </div>
      </div>
    )
  }
}

export default List