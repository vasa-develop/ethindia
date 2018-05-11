import React, { Component } from 'react'
import axios from 'axios'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import moment from 'moment'

import FormInput from '../FormInput/FormInput';
import API from '../../assets/API'

import './FormTab.scss'

const FormInputs = [
  {
    key: 'loanAmountOffered',
    label: 'Amount',
    width: 110,
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
    width: 88,
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
    width: 131,
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
    width: 131,
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
    key: 'wrangler',
    label: 'Wrangler',
    width: 96
  }, {
    key: 'allowance',
    label: 'Allowance',
    width: 110,
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
    width: 110,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'LST',
      unit: 1
    }]
  }, {
    key: 'monitoringFeeLST',
    label: 'Monitoring Fee',
    width: 110,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'LST',
      unit: 1
    }]
  }, {
    key: 'rolloverFeeLST',
    label: 'RollOver Fee',
    width: 110,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'LST',
      unit: 1
    }]
  }, {
    key: 'closureFeeLST',
    label: 'Closure Fee',
    width: 110,
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
      wrangler: '0xf31c52b569b6cfcd70e30f380c18608c8627d930',
      allowance: 5.123,
      ethToDai: 0,
      relayerFeeLST: 0.01,
      monitoringFeeLST: 0.01,
      rolloverFeeLST: 0.01,
      closureFeeLST: 0.01,
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

  onSubmit(isLend) {
    return (
      () => {
        const formData = this.state
        const { address, methods } = this.props
        let postData = {}
        FormInputs.forEach(item => {
          postData[item.key] = item.output ? item.output(formData[item.key]) : formData[item.key]
        })
        FeeFormInputs.forEach(item => {
          postData[item.key] = item.output ? item.output(formData[item.key]) : formData[item.key]
        })
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
          result = result.substr(2); //remove 0x

          postData.rCreator = '0x' + result.slice(0, 64)
          postData.sCreator = '0x' + result.slice(64, 128)
          postData.vCreator = web3.toDecimal('0x' + result.slice(128, 130))

          methods.apiPost('offers', postData, (result) => {
            setTimeout(methods.getOffers, 1000)
          })
        })
      }
    ).bind(this)
  }

  render() {
    const { title = 'Table', data = [] } = this.props
    const formData = this.state

    const isValid = this.isValid()
    console.log(isValid)

    return (
      <div className="TabWrapper">
        <Tabs>
          <TabList>
            <Tab>Lend Order Form</Tab>
            <Tab>Borrow Order Form</Tab>
          </TabList>
          <TabPanel>
            <table cellspacing="15">
              <thead>
                <tr>
                  {
                    FormInputs.map(item => (
                      <th width={item.width}>{item.label}</th>
                    ))
                  }
                  <th width="88"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {
                    FormInputs.map(item => (
                      <td>
                        {
                          item.key === 'wrangler' ?
                            <div>Name</div>
                            :
                            <FormInput data={item} onChange={this.onChange.bind(this)} val={formData[item.key]} />
                        }
                      </td>
                    ))
                  }
                  <td>
                    <div className="FormInput">
                      <input type="Button" className={`Button ${isValid ? '' : 'Disabled'}`} value="Order" onClick={this.onSubmit(true)} disabled={!isValid} />
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
                  <th width="360"></th>
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
                  <td></td>
                </tr>
              </tbody>
            </table>
          </TabPanel>
          <TabPanel>
            <table cellspacing="15">
              <thead>
                <tr>
                  {
                    FormInputs.map(item => (
                      <th width={item.width}>{item.label}</th>
                    ))
                  }
                  <th width="88"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {
                    FormInputs.map(item => (
                      <td>
                        {
                          item.key === 'wrangler' ?
                            <div>Name</div>
                            :
                            <FormInput data={item} onChange={this.onChange.bind(this)} val={formData[item.key]} />
                        }
                      </td>
                    ))
                  }
                  <td>
                    <div className="FormInput">
                      <input type="Button" className={`Button ${isValid ? '' : 'Disabled'}`} value="Order" onClick={this.onSubmit(false)} disabled={!isValid} />
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
                  <th width="430"></th>
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
                  <td></td>
                </tr>
              </tbody>
            </table>
          </TabPanel>
        </Tabs>
      </div >
    )
  }
}

export default FormTab
