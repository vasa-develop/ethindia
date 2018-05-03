import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import moment from 'moment'

import FormInput from '../FormInput/FormInput';

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
    }]
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
    }]
  }, {
    key: 'collateralAmount',
    label: 'Collateral',
    width: 110,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 2,
      suffix: 'ETH',
      unit: 1
    }]
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
    }]
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

class FormTab extends Component {
  constructor(props) {
    super(props)

    this.state = {
      formData: {
        loanAmountOffered: 4.123,
        interestRatePerDay: 0.008,
        collateralAmount: 2326.74,
        loanDuration: 300,
        offerExpiry: 72,
        wrangler: '0xf31c52b569b6cfcd70e30f380c18608c8627d930',
        allowance: 5.123
      }
    }
  }

  onChange(key, value) {
    const { formData } = this.state
    formData[key] = value
    this.setState(formData)
  }

  onSubmit(isLend) {
    return (
      () => {
        const { formData } = this.state
        const { address, methods } = this.props
        let postData = {}
        FormInputs.forEach(item => {
          postData[item.key] = item.output ? item.output(formData[item.key]) : formData[item.key]
        })
        postData.lender = isLend ? address : ''
        postData.borrower = !isLend ? address : ''

        const keys = [
          'relayerFeeLST',
          'monitoringFeeLST',
          'relayer',
          'closureFeeLST',
          'vCreator',
          'sCreator',
          'rolloverFeeLST',
          'rCreator',
          'collateralToken',
          'creatorSalt',
          'loanToken'
        ]
        keys.forEach(key => (postData[key] = ''))

        delete postData.allowance

        methods.apiPost('offers', postData, (result) => {
          setTimeout(methods.getOffers, 1000)
        })
      }
    ).bind(this)
  }

  render() {
    const { title = 'Table', data = [] } = this.props
    const { formData } = this.state

    return (
      <div className="TabWrapper">
        <Tabs>
          <TabList>
            <Tab>Lend Order</Tab>
            <Tab>Borrow Order</Tab>
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
                      <td width={item.width}>
                        {
                          item.key === 'wrangler' ?
                            <div>Name</div>
                            :
                            <FormInput data={item} onChange={this.onChange.bind(this)} val={formData[item.key]} />
                        }
                      </td>
                    ))
                  }
                  <td width="88">
                    <div className="FormInput">
                      <input type="Button" className="Button" value="Order" onClick={this.onSubmit(true)} />
                    </div>
                  </td>
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
                      <td width={item.width}>
                        {
                          item.key === 'wrangler' ?
                            <div>Name</div>
                            :
                            <FormInput data={item} onChange={this.onChange.bind(this)} val={formData[item.key]} />
                        }
                      </td>
                    ))
                  }
                  <td width="88">
                    <div className="FormInput">
                      <input type="Button" className="Button" value="Order" onClick={this.onSubmit(false)} />
                    </div>
                  </td>
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