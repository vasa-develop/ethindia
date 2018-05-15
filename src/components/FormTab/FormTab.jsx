import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import FormInput from '../FormInput/FormInput'
import { BigNumber } from './BigNumber'
import API from '../../assets/API'

import { FormInputs, FeeFormInputs, WrapETHFormInputs, AllowanceFormInputs } from './Forms'

import './FormTab.scss'
import './ReactTab.scss'

const WETHAddresses = {
  1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  42: '0xd0a1e359811322d97991e03f863a0c30c2cf029c'
}

class FormTab extends Component {
  constructor(props) {
    super(props)

    this.state = {

      // Lend/Borrow Form Inputs
      loanAmountOffered: 4.123,
      interestRatePerDay: 0.008,
      loanDuration: 300,
      offerExpiry: 72,
      wrangler: 'Lendroid',
      allowance: 5.123,
      ethToDai: 0,

      // Fee Form Inputs
      relayerFeeLST: 0.01,
      monitoringFeeLST: 0.01,
      rolloverFeeLST: 0.01,
      closureFeeLST: 0.01,

      // Wrap/Unwrap ETH Form Inputs
      ETHBalance: 0,
      wETHBalance: 0,
      operation: 'Wrap',
      amount: 0.0500,
      WETHContractInstance: null,

      // isLend: true,

      tabIndex: 2,
    }
  }

  componentDidMount() {
    if (this.props.address) this.getBalance(this.props.address)
    this.getETD()
    this.getWETHContract(this.props.network)
  }

  componentWillReceiveProps(newProps) {
    const { address, network } = this.props

    if (newProps.address != address || newProps.network != network) {
      this.getBalance(newProps.address)
      this.getWETHContract(newProps.network)
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

  fromBigToNumber(big) {
    return Number((big.c[0] / 10000).toString() + (big.c[1] || '').toString())
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
          ETHBalance: this.fromBigToNumber(result),
        })
      }
    })
  }

  getWETHContract(network) {
    if (!WETHAddresses[network]) return

    const url = `https://${network === 1 ? 'api' : 'api-kovan'}.etherscan.io/api?module=contract&action=getabi&address=${WETHAddresses[network]}`
    axios.get(url)
      .then(res => {
        const contractABI = JSON.parse(res.data.result)
        if (contractABI != '') {
          const WETHContractInstance = web3.eth.contract(contractABI).at(WETHAddresses[network])
          this.setState({ WETHContractInstance }, () => this.getWETHBalance(this.props.address))
        }
      })
  }

  getWETHBalance(address) {
    const { WETHContractInstance } = this.state
    if (!WETHContractInstance) return

    WETHContractInstance.balanceOf(address, (err, result) => {
      if (err) {
        this.setState({
          web3Error: err
        })
      } else {
        this.setState({
          wETHBalance: this.fromBigToNumber(result),
        })
      }
    })
  }

  onChange(key, value, affection = null) {
    const formData = this.state
    formData[key] = value
    this.setState(formData)
  }

  onChangeSync(key) {
    return ((e) => {
      this.setState({ [key]: e.target.value })
    }).bind(this)
  }

  isValid() {
    const formData = this.state
    let valid = true
    FormInputs.forEach(item => {
      if (item.required && Number(formData[item.key]) == 0) valid = false
    })
    return valid
  }

  onSubmit(isLend) {
    return (() => {
      // const { isLend } = this.state
      const formData = this.state
      const { address, methods } = this.props
      let postData = {}
      FormInputs.forEach(item => {
        postData[item.key] = item.output ? item.output(formData[item.key]) : formData[item.key]
      })
      FeeFormInputs.forEach(item => {
        postData[item.key] = item.output ? item.output(formData[item.key]) : formData[item.key]
      })
      postData.wrangler = formData.wrangler
      postData.lender = isLend ? address : ''
      postData.borrower = !isLend ? address : ''

      const keys = [
        'relayer',
        'collateralAmount',
        'collateralToken',
        'creatorSalt',
        'loanToken'
      ]
      keys.forEach(key => (postData[key] = ''))

      delete postData.allowance

      const { web3 } = window
      web3.eth.sign(address, web3.sha3(JSON.stringify(postData)), (err, result) => {
        if (err) return

        postData.ecSignatureCreator = result
        result = result.substr(2)

        postData.rCreator = '0x' + result.slice(0, 64)
        postData.sCreator = '0x' + result.slice(64, 128)
        postData.vCreator = web3.toDecimal('0x' + result.slice(128, 130))

        methods.apiPost('offers', postData, (result) => {
          setTimeout(methods.getOffers, 1000)
        })
      })
    }).bind(this)
  }

  onWrapETH() {
    const { WETHContractInstance, amount, operation } = this.state
    const { address } = this.props
    const { web3 } = window

    if (operation === 'Wrap') {
      WETHContractInstance.deposit({ value: web3.toWei(amount) }, (err, result) => {
        setTimeout(() => {
          this.props.onSync()
          this.getBalance(address)
          this.getWETHBalance(address)
        }, 3000)
      })
    } else {
      WETHContractInstance.withdraw(web3.toWei(amount), {}, (err, result) => {
        setTimeout(() => {
          this.props.onSync()
          this.getBalance(address)
          this.getWETHBalance(address)
        }, 3000)
      })
    }
  }

  // onToggle() {
  //   this.setState({
  //     isLend: !this.state.isLend
  //   })
  // }

  render() {
    const { title = 'Table', data = [] } = this.props
    const formData = this.state

    const isValid = this.isValid()

    return (
      <div className="TabWrapper">
        <div className="Title">WHAT ARE YOU UP TO TODAY?</div>
        {/* <div className={`Toggle ${formData.isLend ? 'Lend' : 'Borrow'}`}>
          <div className="Handle" onClick={this.onToggle.bind(this)}>{!formData.isLend ? 'Lend' : 'Borrow'}</div>
          <div className="Handle Bar">{formData.isLend ? 'Lend' : 'Borrow'}</div>
        </div> */}
        <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
          <TabList>
            <Tab>Lend</Tab>
            <Tab>Borrow</Tab>
            <Tab>Wrap/Unwrap ETH</Tab>
            <Tab>Allowance</Tab>
          </TabList>

          <TabPanel>
            <div className="Wrangler">
              <div className="Label">Wrangler</div>
              <select>
                <option disabled>Wrangler Name</option>
                <option default>Lendroid</option>
              </select>
            </div>
            <table cellspacing="15">
              <thead>
                <tr>
                  {
                    FormInputs.map(item => (
                      <th width={item.width}>{item.label}</th>
                    ))
                  }
                  <th width="100"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {
                    FormInputs.map(item => (
                      <td style={item.style}>
                        <FormInput data={item} onChange={this.onChange.bind(this)} val={formData[item.key]} />
                      </td>
                    ))
                  }
                  <td>
                    <div className={`FormInput Button ${isValid ? '' : 'Disabled'}`} onClick={this.onSubmit(true)}>
                      <div className="left" />
                      Order
                </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table cellspacing="15">
              <thead>
                <tr>
                  {
                    FeeFormInputs.map(item => (
                      <th width={item.width}>{item.label}</th>
                    ))
                  }
                  <th width="250" colspan="2"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {
                    FeeFormInputs.map(item => (
                      <td>
                        <FormInput data={item} onChange={this.onChange.bind(this)} val={formData[item.key]} />
                      </td>
                    ))
                  }
                  <td colspan="2"></td>
                </tr>
              </tbody>
            </table>
          </TabPanel>
          <TabPanel>
            <div className="Wrangler">
              <div className="Label">Wrangler</div>
              <select>
                <option disabled>Wrangler Name</option>
                <option default>Lendroid</option>
              </select>
            </div>
            <table cellspacing="15">
              <thead>
                <tr>
                  {
                    FormInputs.map(item => (
                      <th width={item.width}>{item.label}</th>
                    ))
                  }
                  <th width="100"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {
                    FormInputs.map(item => (
                      <td style={item.style}>
                        <FormInput data={item} onChange={this.onChange.bind(this)} val={formData[item.key]} />
                      </td>
                    ))
                  }
                  <td>
                    <div className={`FormInput Button ${isValid ? '' : 'Disabled'}`} onClick={this.onSubmit(false)}>
                      <div className="left" />
                      Order
                </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table cellspacing="15">
              <thead>
                <tr>
                  {
                    FeeFormInputs.map(item => (
                      <th width={item.width}>{item.label}</th>
                    ))
                  }
                  <th width="250" colspan="2"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {
                    FeeFormInputs.map(item => (
                      <td>
                        <FormInput data={item} onChange={this.onChange.bind(this)} val={formData[item.key]} />
                      </td>
                    ))
                  }
                  <td colspan="2"></td>
                </tr>
              </tbody>
            </table>
          </TabPanel>
          <TabPanel>
            <table cellspacing="15" className="WrapETHTable">
              <thead>
                <tr>
                  {
                    WrapETHFormInputs.map(item => (
                      <th width={item.width}>{item.label}</th>
                    ))
                  }
                  <th width="100"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {
                    WrapETHFormInputs.map(item => (
                      <td style={item.style}>
                        {
                          item.key === "operation"
                            ?
                            <select value={formData.operation} onChange={this.onChangeSync(item.key)}>
                              <option disabled>Select Operation</option>
                              <option>Wrap</option>
                              <option>Unwrap</option>
                            </select>
                            :
                            <FormInput data={item} onChange={this.onChange.bind(this)} val={formData[item.key]} />
                        }
                      </td>
                    ))
                  }
                  <td>
                    <div className={`FormInput Button ${isValid ? '' : 'Disabled'}`} onClick={this.onWrapETH.bind(this)}>
                      <div className="left" />Submit</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </TabPanel>
          <TabPanel>
            <table cellspacing="15" className="WrapETHTable">
              <thead>
                <tr>
                  {
                    AllowanceFormInputs.map(item => (
                      <th width={item.width}>{item.label}</th>
                    ))
                  }
                  <th width="100"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {
                    AllowanceFormInputs.map(item => (
                      <td style={item.style}>
                        {
                          item.key === "operation"
                            ?
                            <select value={formData.operation} onChange={this.onChangeSync(item.key)}>
                              <option disabled>Select Operation</option>
                              <option>Wrap</option>
                              <option>Unwrap</option>
                            </select>
                            :
                            <FormInput data={item} onChange={this.onChange.bind(this)} val={formData[item.key]} />
                        }
                      </td>
                    ))
                  }
                  <td>
                    <div className={`FormInput Button ${isValid ? '' : 'Disabled'}`} onClick={this.onWrapETH.bind(this)}>
                      <div className="left" />Submit</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </TabPanel>
        </Tabs >
      </div >
    )
  }
}

export default FormTab
