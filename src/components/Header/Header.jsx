import React, { Component } from 'react'
import axios from 'axios'
import { BigNumber } from 'bignumber.js'

import logo from '../../assets/images/Logo.png'

import './Header.scss'

const DAIAddresses = {
  1: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
  42: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2'
}

class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      balance: {
        c: [0]
      },
      ethToDai: 0,
      balanceDAI: {
        c: [0]
      }
    }

    this.getABI = this.getABI.bind(this)
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

  getABI() {
    const { network } = this.state
    const { address } = this.props

    if (!DAIAddresses[network]) return
    
    axios.get(`http://api${network === 42 ? '-kovan' : ''}.etherscan.io/api?module=contract&action=getabi&address=${DAIAddresses[network]}`)
      .then(res => {
        const data = res.data;
        if (data.status == 0) {
          console.log(`Invalid Contract Address -> ${DAIAddresses[network]}`)
          return
        }

        const contractABI = JSON.parse(data.result)

        if (contractABI != '') {
          const MyContract = web3.eth.contract(contractABI)
          const DAIContractInstance = MyContract.at(DAIAddresses[network])
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
        } else {
          console.log("Error")
        }
      });
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