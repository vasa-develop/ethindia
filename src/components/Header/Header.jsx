import React, { Component } from 'react'

import logo from '../../assets/images/Logo.png'

import './Header.scss'

class Header extends Component {
  constructor(props) {
    super(props)
  }

  render() {
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
            <div className="Value">0x123456812345681234568123456812345681234568</div>
          </div>
          <div className="Info">
            <div className="Label">Balance:</div>
            <div className="Value">12.345 <span>ETH</span></div>
            <div className="Value Second">5048.358 <span>DAI</span></div>
          </div>
        </div>
      </div>
    )
  }
}

export default Header