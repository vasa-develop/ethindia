import React, { Component } from 'react'
import axios from 'axios'
import { compose } from 'recompose'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

import { connectContract } from '../../redux/modules'

import './List.scss'

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: {}
    };
  }

  getData(data) {
    const { key, filter } = data.data
    if (key) {
      const ret = this.props.data[key] || []
      if (filter) return filter(ret)
      return ret
    }
    return data.data
  }

  addCommas(value) {
    return (value + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  }

  calcTerm(value) {
    return `${parseInt(value / 3600 / 24, 10)}d` + (value / 3600 % 24 !== 0 ? ` ${parseInt(value / 3600 % 24, 10)}h` : '')
  }

  setPrecision(value, prec) {
    const up = parseInt(value, 10)
    const down = ('000' + parseInt(value * Math.pow(10, prec), 10).toString()).substr(-prec)
    return this.addCommas(up) + '.' + down
  }

  shortAddress(value) {
    return `${value.substr(0, 4)}...${value.substr(-4)}`
  }

  getDisplayData(data, header) {
    let ret = data[header.key]

    if (header.key === 'loanDuration') {
      ret = ret.split(' ')[0]
    }

    if (header.precision) ret = this.setPrecision(ret, header.precision)
    if (header.filter) ret = this[header.filter](ret)
    if (header.suffix) ret += header.suffix
    return ret
  }

  getFill(percent) {
    if (percent > 80) return '#84d74d'
    if (percent > 60) return '#eeab35'
    if (percent > 40) return '#fd458a'
    return 'red'
  }

  fromBigToNumber(big) {
    if (!big.c) return 0
    return Number((big.c[0] / 10000).toString() + (big.c[1] || '').toString())
  }

  toggle(key) {
    return () => {
      const { dropdownOpen } = this.state
      dropdownOpen[key] = !dropdownOpen[key]
      this.setState({ dropdownOpen })
    }
  }

  // Slots

  onCancel(data, input) {

    // 1. an array of addresses[6] in this order: lender, borrower, relayer, wrangler, collateralToken, loanToken
    const addresses = [
      data.lender,
      data.borrower,
      data.relayer,
      data.wrangler,
      data.collateralToken,
      data.loanToken
    ]

    // 2. an array of uints[9] in this order: loanAmountOffered, interestRatePerDay, loanDuration, offerExpiryTimestamp, relayerFeeLST, monitoringFeeLST, rolloverFeeLST, closureFeeLST, creatorSalt
    const values = [
      data.loanAmountOffered,
      data.interestRatePerDay,
      data.loanDuration,
      data.offerExpiryTimestamp,
      data.relayerFeeLST,
      data.monitoringFeeLST,
      data.rolloverFeeLST,
      data.closureFeeLST,
      data.creatorSalt
    ]

    // 3. vCreator
    // 4. rCreator
    // 5. sCreator
    // 6. a uint value cancelledCollateralTokenAmount which is calculated as follows:
    // orderHash = contract.computeOfferHash(address[6], uints[9]); // Refer 1 and 2 immediately above for input details
    // filledAmount = contract.filled(orderHash);
    // cancelledCollateralTokenAmount = (order.loanAmountOffered * currentWETHExchangeRate) - (filledAmount)
    const { contracts, currentWETHExchangeRate, methods } = this.props
    const LoanOfferRegistryContractInstance = contracts.contracts ? contracts.contracts.LoanOfferRegistry : null

    const onCancel = (err, result) => {
      if (err) return
      console.log(result)

      let url = `http://localhost:8080/offers/${data.id}`
      axios.delete(url)
        .then(res => {
          console.log(res.data)
          setTimeout(methods.getOffers, 1000)
        })
    }

    const onFilledAmount = (err, result) => {
      const filledAmount = this.fromBigToNumber(result)
      const cancelledCollateralTokenAmount = data.loanAmountOffered * currentWETHExchangeRate - filledAmount

      LoanOfferRegistryContractInstance.cancel(addresses, values, data.vCreator, data.rCreator, data.sCreator, cancelledCollateralTokenAmount, onCancel)
    }

    const onOrderHash = (err, result) => {
      if (err) return
      LoanOfferRegistryContractInstance.filled(result, onFilledAmount)
    }

    LoanOfferRegistryContractInstance.computeOfferHash(addresses, values, onOrderHash)
  }

  onLiquidatePosition(data, input) {
    console.log(data, input)
  }

  onClosePosition(data, input) {
    console.log(data, input)
  }

  onTopupWithCollateral(data, input) {
    console.log(data, input)
  }

  // Action

  onAction(action, data) {
    if (!action.slot) return
    this[action.slot](data, action.param)
  }

  render() {
    const { data, classes } = this.props
    const filteredData = this.getData(data)

    return (
      <div className="ListWrapper">
        <div className="Title">{data.title}</div>
        <div className="Lists">
          {
            data.loading &&
            <div className="Loading">
              <div className="Loader" />
            </div>
          }
          {
            filteredData.map((d, index) => (
              <div class={`List ${classes}`}>
                {
                  data.headers.map(h => (
                    <div className={`ListField ${h.key}`} style={h.style}>
                      <div className="Label">{h.label}</div>
                      <div className="Data">
                        {
                          h.key === 'health' ?
                            d[h.key] ?
                              <div className="HealthBar">
                                <div className="BarPercent">{this.getDisplayData(d, h)}</div>
                                <div className="BarBase">
                                  <div className="Fill" style={{ width: `${d[h.key]}%`, backgroundColor: this.getFill(d[h.key]) }} />
                                </div>
                              </div>
                              : null
                            : this.getDisplayData(d, h)
                        }
                      </div>
                    </div>
                  ))
                }
                <div className="Actions">
                  {
                    data.action.label === '3-dot'
                      ?
                      <Dropdown isOpen={this.state.dropdownOpen[index]} toggle={this.toggle(index)}>
                        <DropdownToggle style={data.action.style} className="close three-dot" />
                        <DropdownMenu>
                          {
                            data.action.items.map(item => (
                              <DropdownItem disabled={item.disabled(d)} onClick={() => this.onAction(item, d)}>{item.label}</DropdownItem>
                            ))
                          }
                        </DropdownMenu>
                      </Dropdown>
                      // <button style={data.action.style} className="close three-dot"></button>
                      :
                      <button style={data.action.style} className={data.action.key} onClick={() => this.onAction(data.action, d)}>{data.action.label}</button>
                  }
                </div>
              </div>
            ))
          }
          {
            filteredData.length === 0 && <div class={`List ${classes}`}>{data.loading ? 'Loading' : 'No Data'}</div>
          }
        </div>
      </div>
    )
  }
}

export default compose(
  connectContract(),
)(List)
