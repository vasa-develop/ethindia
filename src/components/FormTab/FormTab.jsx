import React, { Component } from 'react'
import axios from 'axios'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { compose } from 'recompose'

import { connectContract } from '../../redux/modules'
import { promisify } from '../../utilities'

import FormInput from '../FormInput/FormInput'

import { FormInputs, FeeFormInputs, WrapETHFormInputs, AllowanceFormInputs } from './Forms'

import './FormTab.scss'
import './ReactTab.scss'

class FormTab extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: {},

      // Lend/Borrow Form Inputs
      loanAmountOffered: 4.123,
      interestRatePerDay: 0.008,
      loanDuration: 12 * 3600,
      offerExpiry: 72,
      wrangler: 'Lendroid',
      allowance: 0,
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

      // Allowance Form Inputs
      token: 'WETH',
      tokenBalance: 0,
      tokenAllowance: 0,
      newAllowance: 10.0,
      tokenContractInstance: null,

      tabIndex: 0,
    }
  }

  componentDidMount() {
    this.getETD()
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

  getBalance(address, origin = null, compare = true) {
    const { web3 } = window
    const { isLoading } = this.state
    isLoading['ETHBalance'] = true
    this.setState({ isLoading })

    const { contractETHBlance } = this.props
    promisify(contractETHBlance, { web3, address })
      .then(res => {
        console.log(res)
        const { isLoading } = this.state
        isLoading['ETHBalance'] = false

        this.setState({
          isLoading
        })
      })
      .catch(e => {
        console.log(e)
        if (e.message === 'No Update')
          setTimeout(() => this.getBalance(address, origin, compare), 1000)
      })
  }

  getTokenName(token) {
    return token.substr(0, 1).toUpperCase() + token.substr(1).toLowerCase()
  }

  getTokenBalance(address, token, origin = null, compare = true) {
    const { contracts } = this.props
    const contractInstance = contracts.contracts ? contracts.contracts[token] : null
    if (!contractInstance) return

    const { isLoading } = this.state
    isLoading[token + 'Balance'] = true
    this.setState({ isLoading })

    const tokenBalance = this.props['tokenBalance' + this.getTokenName(token)]
    promisify(tokenBalance, { contractInstance, address, origin, compare })
      .then(res => {
        console.log(res)
        const { isLoading } = this.state
        isLoading[token + 'Balance'] = false

        this.setState({
          isLoading
        })
      })
      .catch(e => {
        console.log(e)
        if (e.message === 'No Update')
          setTimeout(() => this.getTokenBalance(address, token, origin, compare), 1000)
      })
  }

  getTokenAllowance(address, token, origin = null) {
    const { contracts } = this.props
    const contractInstance = contracts.contracts ? contracts.contracts[token] : null
    if (!contractInstance) return

    const { isLoading } = this.state
    isLoading[token + 'Allowance'] = true
    this.setState({ isLoading })

    const tokenAllowance = this.props['tokenAllowance' + this.getTokenName(token)]
    promisify(tokenAllowance, { contractInstance, address, origin })
      .then(res => {
        console.log(res)
        const { isLoading } = this.state
        isLoading[token + 'Allowance'] = false

        this.setState({
          isLoading
        })
      })
      .catch(e => {
        console.log(e)
        if (e.message === 'No Update')
          setTimeout(() => this.getTokenAllowance(address, token, origin), 1000)
      })
  }

  onChange(key, value, affection = null) {
    const formData = this.state
    formData[key] = value
    this.setState(formData)
  }

  onChangeSync(item) {
    return (e) => {
      this.setState({ [item.key]: e.target.value })
    }
  }

  isValid(isLend = true) {
    const { contracts } = this.props
    const formData = this.state
    contracts.loanAmountOffered = formData.loanAmountOffered

    let valid = true
    FormInputs(isLend).forEach(item => {
      if (item.required && Number(formData[item.key]) === 0) {
        valid = false
      } else if (item.validation) {
        if (!item.validation(contracts)) valid = false
      }
    })
    return valid
  }

  isValidForm(form) {
    const formData = this.state
    let valid = true
    form.forEach(item => {
      if (item.required && Number(formData[item.key]) === 0) valid = false
    })
    return valid
  }

  randHex(len = 40) {
    const maxlen = 8
    const min = Math.pow(16, Math.min(len, maxlen) - 1)
    const max = Math.pow(16, Math.min(len, maxlen)) - 1
    const n = Math.floor(Math.random() * (max - min + 1)) + min
    let r = n.toString(16)
    while (r.length < len) {
      r = r + this.randHex(len - maxlen)
    }
    return r
  }

  onSubmit(isLend) {
    return () => {
      const formData = this.state
      const { address, methods, contracts } = this.props
      const postData = {}
      FormInputs(isLend).forEach(item => {
        postData[item.key] = item.output ? item.output(formData[item.key]) : formData[item.key]
      })
      FeeFormInputs.forEach(item => {
        postData[item.key] = item.output ? item.output(formData[item.key]) : formData[item.key]
      })
      postData.wrangler = '0x061C6ACc2B78A500489C2845D5d7F94847c2F4ba'
      postData.lender = isLend ? address : ''
      postData.borrower = !isLend ? address : ''

      postData.creatorSalt = '0x' + this.randHex(40)
      postData.collateralToken = contracts.contracts ? contracts.contracts.WETH.address : ''
      postData.loanToken = contracts.contracts ? contracts.contracts.DAI.address : ''
      const keys = [
        'relayer',
        'collateralAmount',
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
    }
  }

  onWrapETH() {
    const { contracts, address } = this.props
    const { amount, operation } = this.state
    const WETHContractInstance = contracts.contracts ? contracts.contracts.WETH : null
    const ETHBalance = contracts.balances ? contracts.balances.ETH : 0
    const wETHBalance = contracts.balances ? contracts.balances.WETH : 0
    if (!WETHContractInstance) return

    const { web3 } = window
    const _this = this

    if (operation === 'Wrap') {
      WETHContractInstance.deposit({ value: web3.toWei(amount) }, (err, result) => {
        setTimeout(() => {
          _this.getBalance(address, ETHBalance, false)
          _this.getTokenBalance(address, 'WETH', wETHBalance, true)
        }, 1000)
      })
    } else {
      WETHContractInstance.withdraw(web3.toWei(amount), {}, (err, result) => {
        setTimeout(() => {
          _this.getBalance(address, ETHBalance, true)
          _this.getTokenBalance(address, 'WETH', wETHBalance, false)
        }, 1000)
      })
    }
  }

  onAllowance() {
    const { contracts, address } = this.props
    const { newAllowance, token } = this.state
    const tokenContractInstance = contracts.contracts ? contracts.contracts[token] : null
    const tokenAllowance = contracts.allowances ? contracts.allowances[token] : 0
    const { web3 } = window

    if (!tokenContractInstance) return

    const callback = (err, result) => {
      if (err) return
      this.getTokenAllowance(address, token, newAllowance)
    }

    if (
      tokenAllowance === 0
      || !tokenContractInstance.increaseApproval
      || !tokenContractInstance.decreaseApproval) {
      tokenContractInstance.approve(tokenContractInstance.address, web3.toWei(newAllowance), { from: address }, callback)
    } else {
      if (newAllowance > tokenAllowance) {
        tokenContractInstance.increaseApproval(tokenContractInstance.address, web3.toWei(newAllowance - tokenAllowance), { from: address }, callback)
      } else {
        tokenContractInstance.decreaseApproval(tokenContractInstance.address, web3.toWei(tokenAllowance - newAllowance), { from: address }, callback)
      }
    }
  }

  onTabChange(tabIndex) {
    this.setState({ tabIndex })

    switch (tabIndex) {
      case 0: // Lend Form
        break;
      case 1: // Borrow Form
        break;
      case 2: // Wrap/Unwrap Form
        break;
      case 3: // Allowance Form
        break;
      default:
        break;
    }
  }

  render() {
    const { contracts } = this.props
    const formData = this.state
    contracts.token = formData.token

    return (
      <div className="TabWrapper">
        <div className="Title">WHAT ARE YOU UP TO TODAY?</div>
        <Tabs selectedIndex={this.state.tabIndex} onSelect={this.onTabChange.bind(this)}>
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
                    FormInputs(true).map(item => (
                      <th width={item.width}>{item.label}</th>
                    ))
                  }
                  <th width="100"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {
                    FormInputs(true).map(item => (
                      <td style={item.style}>
                        <FormInput
                          data={item}
                          onChange={this.onChange.bind(this)}
                          val={item.value ? (item.value(contracts)) : formData[item.key]}
                          loading={item.loading ? formData.isLoading[item.loading] : false}
                        />
                      </td>
                    ))
                  }
                  <td>
                    <div className={`FormInput Button ${this.isValid(true) ? '' : 'Disabled'}`} onClick={this.onSubmit(true)}>
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
                        <FormInput data={item} onChange={this.onChange.bind(this)} val={item.value ? (item.value(contracts)) : formData[item.key]} />
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
                    FormInputs(false).map(item => (
                      <th width={item.width}>{item.label}</th>
                    ))
                  }
                  <th width="100"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {
                    FormInputs(false).map(item => (
                      <td style={item.style}>
                        <FormInput
                          data={item}
                          onChange={this.onChange.bind(this)}
                          val={item.value ? (item.value(contracts)) : formData[item.key]}
                          loading={item.loading ? formData.isLoading[item.loading] : false}
                        />
                      </td>
                    ))
                  }
                  <td>
                    <div className={`FormInput Button ${this.isValid(false) ? '' : 'Disabled'}`} onClick={this.onSubmit(false)}>
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
                        <FormInput
                          data={item}
                          onChange={this.onChange.bind(this)}
                          val={item.value ? (item.value(contracts)) : formData[item.key]}
                          loading={item.loading ? formData.isLoading[item.loading] : false}
                        />
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
                            <select value={formData.operation} onChange={this.onChangeSync(item)}>
                              <option disabled>Select Operation</option>
                              <option>Wrap</option>
                              <option>Unwrap</option>
                            </select>
                            :
                            <FormInput
                              data={item}
                              onChange={this.onChange.bind(this)}
                              val={item.value ? (item.value(contracts)) : formData[item.key]}
                              loading={item.loading ? formData.isLoading[item.loading] : false}
                            />
                        }
                      </td>
                    ))
                  }
                  <td>
                    <div className={`FormInput Button ${this.isValidForm(WrapETHFormInputs) ? '' : 'Disabled'}`} onClick={this.onWrapETH.bind(this)}>
                      <div className="left" />Submit</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </TabPanel>
          <TabPanel>
            <table cellspacing="15" className="AllowanceTable">
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
                          item.key === "token"
                            ?
                            <select value={formData.token} onChange={this.onChangeSync(item)}>
                              <option disabled>Select Token</option>
                              <option>WETH</option>
                              <option>DAI</option>
                              <option>LST</option>
                            </select>
                            :
                            <FormInput
                              data={item}
                              onChange={this.onChange.bind(this)}
                              val={item.value ? (item.value(contracts)) : formData[item.key]}
                              loading={item.loading ? formData.isLoading[item.loading(formData.token, formData)] : false}
                            />
                        }
                      </td>
                    ))
                  }
                  <td>
                    <div className={`FormInput Button ${this.isValidForm(AllowanceFormInputs) ? '' : 'Disabled'}`} onClick={this.onAllowance.bind(this)}>
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

export default compose(
  connectContract(),
)(FormTab)
