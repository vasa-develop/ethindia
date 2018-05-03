import React, { Component } from 'react'
import axios from 'axios'
import { BigNumber } from 'bignumber.js'

import logo from '../../assets/images/Logo.png'

import './Header.scss'

class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      balance: {
        c: [0]
      },
      ethToDai: 0
    }
  }

  componentDidMount() {
    this.getBalance(this.props.address)
    this.getETD()
  }

  componentWillReceiveProps(newProps) {
    const { address } = this.props

    if (newProps.address != address) {
      this.getBalance(newProps.address)
    }
  }

  getETD() {
    const url = 'https://api.coinmarketcap.com/v1/ticker/dai//?convert=ETH'
    axios.get(url)
      .then(res => {
        const result = res.data[0]
        this.setState({
          ethToDai: 1 / result.price_eth
        })
      })
  }

  getBalance(address) {
    const { web3 } = window

    web3 && web3.eth && web3.eth.getBalance(address, (err, result) => {
      if (err) {
        this.setState({
          web3Error: err
        })
      } else {
        this.setState({
          balance: result
        })
      }
    })
  }

  setPrecision(value, prec) {
    if (!prec) return value
    const up = parseInt(value)
    const down = ('000' + parseInt(value * Math.pow(10, prec)).toString()).substr(-prec)
    return up + '.' + down
  }

  render() {
    const { address } = this.props
    const { balance, ethToDai } = this.state

    return (
      <div className="HeaderWrapper">
        <div className="Banner">
          <div className="Inner">
            <img src={logo} />
          </div>
        </div>
        <div className="Header">
          <div className="Info">
            <div className="Label">Address:</div>
            <div className="Value">{address}</div>
          </div>
          <div className="Info">
            <div className="Label">Balance:</div>
            <div className="Value">{this.setPrecision(balance.c[0] / 10000, 3)} <span>ETH</span></div>
            <div className="Value Second">{this.setPrecision(balance.c[0] / 10000 * ethToDai, 3)} <span>DAI</span></div>
          </div>
        </div>
      </div>
    )
  }
}

export default Header