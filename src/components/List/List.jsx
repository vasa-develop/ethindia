import React, { Component } from 'react'
import axios from 'axios'

import { LoanOfferRegisteryABI } from '../Table/LoanOfferRegisteryABI'

import './List.scss'

const LoanOfferRegistryContractAddresses = {
  42: '0xFD466cA49c6804029ccB36181c4d4CA51794c1b9'
}

class List extends Component {
  constructor(props) {
    super(props)

    this.state = {
      LoanOfferRegistryContractInstance: null,
    }
  }

  componentDidMount() {
    this.getABI(this.props.network, this.props.address)
  }

  componentWillReceiveProps(newProps) {
    const { address, network } = this.props

    if (newProps.address !== address || newProps.network !== network) {
      this.getABI(newProps.network, newProps.address)
    }
  }

  getABI(network, address) {
    const { web3 } = window
    if (!LoanOfferRegistryContractAddresses[network]) return

    const contractABI = LoanOfferRegisteryABI
    const LoanOfferRegistryContract = web3.eth.contract(contractABI)
    const LoanOfferRegistryContractInstance = LoanOfferRegistryContract.at(LoanOfferRegistryContractAddresses[network])
    this.setState({ LoanOfferRegistryContractInstance })
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
    return Number((big.c[0] / 10000).toString() + (big.c[1] || '').toString())
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
    const { LoanOfferRegistryContractInstance } = this.state
    const { currentWETHExchangeRate, slots, methods } = this.props

    const onCancel = (err, result) => {
      if (err) return

      let url = `http://localhost:8080/offers/${data.id}`
      axios.delete(url)
        .then(res => {
          const result = res.data
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
            filteredData.map(d => (
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
                    data.action.label === '3-dot' ?
                      <button style={data.action.style} className="close three-dot"></button>
                      : <button style={data.action.style} className={data.action.key} onClick={() => this.onAction(data.action, d)}>{data.action.label}</button>
                  }
                </div>
              </div>
            ))
          }
          {
            filteredData.length === 0 && <div class={`List ${classes}`}>No Data</div>
          }
        </div>
      </div>
    )
  }
}

export default List