import React, { Component } from 'react'
import axios from 'axios'
import { BigNumber } from 'bignumber.js'

import logo from '../../assets/images/Logo.png'

import './Header.scss'

const DAIAddresses = {
  1: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
  // 42: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2'
  42: '0xC4375B7De8af5a38a93548eb8453a498222C4fF2'
}

class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      balance: {
        c: [0]
      },
      balanceDAI: {
        c: [0]
      }
    }

    this.getABI = this.getABI.bind(this)
  }

  componentDidMount() {
    this.getBalance(this.props.address)
  }

  componentWillReceiveProps(newProps) {
    const { address } = this.props

    if (newProps.address != address) {
      this.getBalance(newProps.address)
    }
  }

  getNetwork(next) {
    const { web3 } = window

    web3.version.getNetwork((err, netId) => {
      let newState = { network: -1 }

      switch (netId) {
        case "1":
          newState.network = 1
          console.log('This is mainnet')
          break
        case "2":
          newState.network = 2
          console.log('This is the deprecated Morden test network.')
          break
        case "3":
          newState.network = 3
          console.log('This is the ropsten test network.')
          break
        case "4":
          newState.network = 4
          console.log('This is the rinkeby test network.')
          break
        case "42":
          newState.network = 42
          console.log('This is the kovan test network.')
          break
        default:
          console.log('This is an unknown network.')
      }

      this.setState(newState, next)
    })
  }

  getABI() {
    const { network } = this.state
    const { address } = this.props

    if (!DAIAddresses[network]) return

    const contractABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"stop","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner_","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"name_","type":"bytes32"}],"name":"setName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"stopped","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"authority_","type":"address"}],"name":"setAuthority","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"push","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"move","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"start","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"authority","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"guy","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"wad","type":"uint256"}],"name":"pull","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"symbol_","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"authority","type":"address"}],"name":"LogSetAuthority","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"LogSetOwner","type":"event"},{"anonymous":true,"inputs":[{"indexed":true,"name":"sig","type":"bytes4"},{"indexed":true,"name":"guy","type":"address"},{"indexed":true,"name":"foo","type":"bytes32"},{"indexed":true,"name":"bar","type":"bytes32"},{"indexed":false,"name":"wad","type":"uint256"},{"indexed":false,"name":"fax","type":"bytes"}],"name":"LogNote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"}];

    const DaiContract = web3.eth.contract(contractABI)
    const DAIContractInstance = DaiContract.at(DAIAddresses[network])
    // console.log(DAIContractInstance)
    DAIContractInstance.balanceOf(address, (err, result) => {
      if (err) {
        this.setState({
          web3Error: err
        })
      } else {
        this.setState({
          balanceDAI: result,
        })
      }
    })

  }

  getBalance(address) {
    const { web3 } = window

    this.getNetwork(this.getABI)

    web3 && web3.eth && web3.eth.getBalance(address, (err, result) => {
      if (err) {
        this.setState({
          web3Error: err
        })
      } else {
        this.setState({
          balance: result,
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
    const { balance, balanceDAI, ethToDai } = this.state

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
            <div className="Value Second">{this.setPrecision(balanceDAI.c[0] / 10000, 3)} <span>DAI</span></div>
          </div>
        </div>
      </div>
    )
  }
}

export default Header
