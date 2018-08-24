import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import FormInput from '../FormInput/FormInput'
import { FormInputs, FeeFormInputs, WrapETHFormInputs, AllowanceFormInputs } from './Forms'

import './FormTab.scss'
import './ReactTab.scss'

class FormTab extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // Lend/Borrow Form Inputs
      loanAmountOffered: 1.0,
      interestRatePerDay: 0.008,
      loanDuration: 60 * 3600,
      offerExpiry: 7200,
      wrangler: 'Lendroid',
      allowance: 0,

      // Fee Form Inputs
      relayerFeeLST: 0.0,
      monitoringFeeLST: 0.0,
      rolloverFeeLST: 0.0,
      closureFeeLST: 0.0,

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

  getTokenName(token) {
    return token.substr(0, 1).toUpperCase() + token.substr(1).toLowerCase()
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
    const { contracts, currentDAIExchangeRate } = this.props
    const formData = this.state
    contracts.loanAmountOffered = formData.loanAmountOffered

    let valid = true
    FormInputs(isLend).forEach(item => {
      if (item.required && Number(formData[item.key]) === 0) {
        valid = false
      } else if (item.validation) {
        if (!item.validation(contracts, currentDAIExchangeRate)) valid = false
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
      const { address, methods, contracts, web3Utils } = this.props
      const postData = {}

      FormInputs(isLend).forEach(item => {
        postData[item.key] = item.output ? item.output(formData[item.key]) : formData[item.key]
      })
      FeeFormInputs.forEach(item => {
        postData[item.key] = item.output ? item.output(formData[item.key]) : formData[item.key]
      })
      postData.wrangler = '0x0f02a30cA336EC791Ac8Cb40816e4Fc5aeB57E38'
      postData.lender = isLend ? address : ''
      postData.borrower = !isLend ? address : ''

      postData.creatorSalt = '0x' + this.randHex(40)
      postData.collateralToken = contracts.contracts ? contracts.contracts.WETH._address : ''
      postData.loanToken = contracts.contracts ? contracts.contracts.DAI._address : ''
      postData.relayer = ''
      postData.collateralAmount = web3Utils.toWei(0)

      delete postData.allowance
      postData.offerExpiry = parseInt(postData.offerExpiry / 1000).toString();

      methods.onCreateOrder(postData)
    }
  }

  onWrapETH() {
    const { methods } = this.props
    const { amount, operation } = this.state
    methods.onWrapETH(amount, operation === 'Wrap')
  }

  onAllowance() {
    const { methods } = this.props
    const { newAllowance, token } = this.state
    methods.onAllowance(token, newAllowance)
  }

  onTabChange(tabIndex) {
    this.setState({ tabIndex })

    switch (tabIndex) {
      case 0: // Lend Form
        break
      case 1: // Borrow Form
        break
      case 2: // Wrap/Unwrap Form
        break
      case 3: // Allowance Form
        break
      default:
        break
    }
  }

  render() {
    const { contracts, loading } = this.props
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
                <option default>Default Simple Wrangler</option>
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
                          loading={item.loading ? loading[item.loading] : false}
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
                <option default>Default Simple Wrangler</option>
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
                          loading={item.loading ? loading[item.loading] : false}
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
                          loading={item.loading ? loading[item.loading] : false}
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
                              loading={item.loading ? loading[item.loading] : false}
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
                              loading={item.loading ? loading[item.loading] : false}
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

export default FormTab
