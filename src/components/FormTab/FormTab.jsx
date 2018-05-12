import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'

import FormInput from '../FormInput/FormInput'
import API from '../../assets/API'

import './FormTab.scss'

const FormInputs = [
  {
    key: 'loanAmountOffered',
    label: 'Amount',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'DAI',
      unit: 1
    }],
    required: true
  }, {
    key: 'interestRatePerDay',
    label: 'Rate %',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      arrow: true,
      step: 0.1,
      unit: 1
    }],
    required: true
  }, {
    key: 'loanDuration',
    label: 'Length',
    width: 150,
    output: (val) => (val + ' hours'),
    inputs: [{
      precision: 0,
      arrow: true,
      step: 1,
      suffix: 'd',
      unit: 24,
    }, {
      precision: 0,
      arrow: true,
      step: 1,
      suffix: 'h',
      max: 23,
      unit: 1
    }],
    required: true
  }, {
    key: 'offerExpiry',
    label: 'Order Expiration',
    width: 150,
    output: (val) => {
      let ret = new moment()
      ret.add(val, 'm')
      return ret.format()
    },
    inputs: [{
      precision: 0,
      arrow: true,
      step: 1,
      suffix: 'h',
      unit: 60
    }, {
      precision: 0,
      arrow: true,
      step: 1,
      suffix: 'm',
      max: 60,
      unit: 1
    }]
  }, {
    key: 'allowance',
    label: 'Allowance',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'ETH',
      unit: 1
    }]
  },
]

const FeeFormInputs = [
  {
    key: 'relayerFeeLST',
    label: 'Relayer Fee',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'LST',
      unit: 1
    }]
  }, {
    key: 'monitoringFeeLST',
    label: 'Monitoring Fee',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'LST',
      unit: 1
    }]
  }, {
    key: 'rolloverFeeLST',
    label: 'RollOver Fee',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'LST',
      unit: 1
    }]
  }, {
    key: 'closureFeeLST',
    label: 'Closure Fee',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'LST',
      unit: 1
    }]
  }
]

class FormTab extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loanAmountOffered: 4.123,
      interestRatePerDay: 0.008,
      loanDuration: 300,
      offerExpiry: 72,
      wrangler: 'Lendroid',
      allowance: 5.123,
      ethToDai: 0,
      relayerFeeLST: 0.01,
      monitoringFeeLST: 0.01,
      rolloverFeeLST: 0.01,
      closureFeeLST: 0.01,
      isLend: true,
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

  onChange(key, value, affection = null) {
    const formData = this.state
    formData[key] = value
    this.setState(formData)
  }

  isValid() {
    const formData = this.state
    let valid = true
    FormInputs.forEach(item => {
      if (item.required && Number(formData[item.key]) == 0) valid = false
    })
    return valid
  }

  onSubmit() {
    const { isLend } = this.state
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
  }

  onToggle() {
    this.setState({
      isLend: !this.state.isLend
    })
  }

  render() {
    const { title = 'Table', data = [] } = this.props
    const formData = this.state

    const isValid = this.isValid()

    return (
      <div className="TabWrapper">
        <div className="Title">WHAT ARE YOU UP TO TODAY?</div>
        <div className={`Toggle ${formData.isLend ? 'Lend' : 'Borrow'}`}>
          <div className="Handle" onClick={this.onToggle.bind(this)}>{!formData.isLend ? 'Lend' : 'Borrow'}</div>
          <div className="Handle Bar">{formData.isLend ? 'Lend' : 'Borrow'}</div>
        </div>
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
                  <td>
                    <FormInput data={item} onChange={this.onChange.bind(this)} val={formData[item.key]} />
                  </td>
                ))
              }
              <td>
                <div className={`FormInput Button ${isValid ? '' : 'Disabled'}`} onClick={this.onSubmit.bind(this)}>
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
      </div >
    )
  }
}

export default FormTab
