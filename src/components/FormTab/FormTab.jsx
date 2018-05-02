import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import FormInput from '../FormInput/FormInput';

import './FormTab.scss'

const FormInputs = [
  {
    key: 'amount',
    label: 'Amount',
    width: 110,
    inputs: [{
      precision: 3,
      suffix: 'ETH',
      unit: 1
    }]
  }, {
    key: 'rate',
    label: 'Rate %',
    width: 88,
    inputs: [{
      precision: 3,
      arrow: true,
      step: 0.1,
      unit: 1
    }]
  }, {
    key: 'collateral',
    label: 'Collateral',
    width: 110,
    inputs: [{
      precision: 2,
      suffix: 'ETH',
      unit: 1
    }]
  }, {
    key: 'length',
    label: 'Length',
    width: 131,
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
    key: 'orderExpiration',
    label: 'Order Expiration',
    width: 131,
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
        amount: 4.123,
        rate: 0.008,
        collateral: 2326.74,
        length: 300,
        orderExpiration: 72,
        wrangler: 'Name',
        allowance: 5.123
      }
    }
  }

  onChange(key, value) {
    const { formData } = this.state
    formData[key] = value
    this.setState(formData)
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
                            <div>{formData['wrangler']}</div>
                            :
                            <FormInput data={item} onChange={this.onChange.bind(this)} val={formData[item.key]} />
                        }
                      </td>
                    ))
                  }
                  <td width="88">
                    <div className="FormInput">
                      <input type="Button" className="Button" value="Order" />
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
                            <div>{formData['wrangler']}</div>
                            :
                            <FormInput data={item} onChange={this.onChange.bind(this)} val={formData[item.key]} />
                        }
                      </td>
                    ))
                  }
                  <td width="88">
                    <div className="FormInput">
                      <input type="Button" className="Button" value="Order" />
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