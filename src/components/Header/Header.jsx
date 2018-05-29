import React, { Component } from 'react'
import { compose } from 'recompose'

import { connectContract } from '../../redux/modules'

import logo from '../../assets/images/Logo.svg'

import './Header.scss'

class Header extends Component {
  constructor(props) {
    super(props)
  }

  setPrecision(value, prec) {
    if (!prec) return value
    if (!value) value = 0
    const up = parseInt(value, 10)
    const down = ('000' + parseInt(value * Math.pow(10, prec), 10).toString()).substr(-prec)
    return up + '.' + down
  }

  toUpper(value) {
    return `0x${value.substr(2).toUpperCase()}`
  }

  render() {
    const { address, contracts } = this.props

    return (
      <div className="HeaderWrapper">
        <div className="Inner">
          <div className="Logo">
            {/* <img src={logo} alt="Logo" /> */}
            Reloanr
          </div>
          <div className="Header">
            <div className="Info Address">
              <div className="Label">Address</div>
              <div className="Value">{this.toUpper(address)}</div>
            </div>
            <div className="Info">
              <div className="SubInfo">
                <div className="Label">Balance</div>
                <div className="Value">{this.setPrecision(contracts.balances ? contracts.balances.ETH : 0, 3)} <span>ETH</span></div>
              </div>
              <div className="SubInfo">
                <div className="Label"></div>
                <div className="Value">{this.setPrecision(contracts.balances ? contracts.balances.DAI : 0, 3)} <span>DAI</span></div>
              </div>
              <div className="SubInfo">
                <div className="Label">Allowance</div>
                <div className="Value">{this.setPrecision(contracts.allowances ? contracts.allowances.DAI : 0, 2)} <span>DAI</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default compose(
  connectContract(),
)(Header)