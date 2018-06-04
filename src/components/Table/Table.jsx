import React, { Component } from 'react'
import axios from 'axios'
import Modal from 'react-modal'
import { compose } from 'recompose'

import { connectContract } from '../../redux/modules'

import FormInput from '../FormInput/FormInput'

import './Table.scss'

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '30px 20px 0',
    minWidth: 500
  }
}

class Table extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalIsOpen: false,
      modalAmountIsOpen: false,
      postError: null,
      result: {},
      approval: {},
      currentData: null,
      param: {},
      fillLoanAmount: 0,
    }

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  onChange(key, value, affection = null) {
    const formData = this.state
    formData[key] = value
    this.setState(formData)
  }

  openModal(key) {
    this.setState({ [key]: true })
  }

  closeModal(key) {
    this.setState({ [key]: false, fillLoanAmount: 0 })
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

  onConfirm() {
    const { approval, currentData } = this.state
    const { contracts, methods } = this.props
    const LoanOfferRegistryContractInstance = contracts.contracts ? contracts.contracts.LoanOfferRegistry : null
    this.setState({
      isLoading: true
    }, () => {
      LoanOfferRegistryContractInstance.fill(
        approval._addresses,
        approval._values,
        approval._vS,
        approval._rS,
        approval._sS,
        approval._isOfferCreatorLender,
        (err, result) => {
          if (err) {
            this.closeModal('modalIsOpen')
          } else {
            this.closeModal('modalIsOpen')

            let url = `http://localhost:8080/offers/${currentData.id}`
            axios.delete(url)
              .then(res => {
                const result = res.data
                console.log(result)
                setTimeout(methods.getOffers, 1000)
              })
          }
          this.setState({
            isLoading: false
          })
        })
    })
  }

  onSubmitOrder() {
    this.closeModal('modalAmountIsOpen')

    const { address } = this.props
    const { currentData, param, fillLoanAmount } = this.state
    const _this = this
    let url = 'http://127.0.0.1:5000/loan_requests'

    const postData = Object.assign({ filler: address, fillLoanAmount }, currentData)

    axios.post(url, postData)
      .then(res => {
        const result = res.data
        _this.setState({
          postError: null,
          result: result.data,
          approval: result.approval
        }, () => {
          _this.openModal('modalIsOpen')
        })
      })
      .catch(err => {
        _this.setState({
          postError: err
        }, () => {
          _this.openModal('modalIsOpen')
        })
      })
  }

  // Slots

  onOrder(data, param) {
    console.log(window.web3.fromWei(data.loanAmountOffered, 'ether'), this.state)
    this.setState({ currentData: data, param, fillLoanAmount: window.web3.fromWei(data.loanAmountOffered, 'ether') })
    this.openModal('modalAmountIsOpen')
  }

  // Action

  onAction(action, data) {
    if (!action.slot) return
    this[action.slot](data, action.param)
  }

  render() {
    const { data, classes } = this.props
    const { postError, result, modalIsOpen, modalAmountIsOpen, currentData, param, fillLoanAmount, isLoading } = this.state
    const filteredData = this.getData(data)
    const { web3 } = window

    return (
      <div className="TableWrapper">
        <div className="Title">{data.title}</div>
        <div class="tbl-header">
          <table cellpadding="0" cellspacing="0" border="0">
            <thead>
              <tr>
                {
                  data.headers.map(h => (
                    <th style={h.style}>{h.label}</th>
                  ))
                }
                <th></th>
              </tr>
            </thead>
          </table>
        </div>
        <div class={`tbl-content ${classes}`}>
          <div>
            <table cellpadding="0" cellspacing="0" border="0">
              <tbody>
                {
                  filteredData.map(d => (
                    <tr>
                      {
                        data.headers.map(h => (
                          <td style={h.style}>{this.getDisplayData(d, h)}</td>
                        ))
                      }
                      <td>
                        {
                          data.action.label === '3-dot' ?
                            <button style={data.action.style} className="three-dot">
                              <div className="dot" />
                              <div className="dot" />
                              <div className="dot" />
                            </button>
                            : <button style={data.action.style} onClick={() => this.onAction(data.action, d)}>{data.action.label}</button>
                        }
                      </td>
                    </tr>
                  ))
                }
                {
                  filteredData.length === 0 && <tr><td colSpan={data.headers.length}>No Data</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => this.closeModal('modalIsOpen')}
          style={customStyles}
          contentLabel="Order Book"
        >
          <h2>ORDER BOOK</h2>
          <button onClick={() => this.closeModal('modalIsOpen')}></button>
          <div className="ModalBody">
            {
              postError ?
                <div className="Error">{postError.toString()}</div>
                :
                <div>
                  {
                    isLoading &&
                    <div className="Loading">
                      <div className="Loader" />
                    </div>
                  }
                  <div className="Info">
                    <table>
                      {
                        Object.keys(result).map(key => (
                          <tr>
                            <td>{key}</td>
                            <td>{result[key].toString()}</td>
                          </tr>
                        ))
                      }
                    </table>
                  </div>
                  <div className="Buttons">
                    <div className="Confirm" onClick={this.onConfirm.bind(this)}>Confirm</div>
                  </div>
                </div>
            }
          </div>
        </Modal>
        <Modal
          isOpen={modalAmountIsOpen}
          onRequestClose={() => this.closeModal('modalAmountIsOpen')}
          style={customStyles}
          contentLabel={`Amount to ${param.isLend ? 'Fill' : 'Select'}`}
        >
          <h2>{`Amount to ${param.isLend ? 'Fill' : 'Select'}`}</h2>
          <button onClick={() => this.closeModal('modalAmountIsOpen')}></button>
          <div className="ModalBody">
            <div style={{ width: '100%' }}>
              <div className="FillLoanAmount">
                <div className="Label">Amount</div>
                <div className="FormInputWrapper">
                  <div className={`FormInput ${param.isLend ? 'DAI' : 'WETH'}`}>
                    <input
                      type="number"
                      onChange={(e) => this.setState({ fillLoanAmount: e.target.value })}
                      value={fillLoanAmount}
                    />
                    <div className="Suffix">{param.isLend ? 'DAI' : 'WETH'}</div>
                    <div className="after"></div>
                    <div className="before"></div>
                  </div>
                </div>
              </div>
              <div className="Buttons">
                <div
                  className={`Confirm ${fillLoanAmount > currentData ? web3.fromWei(currentData.loanAmountOffered, 'ether') : 0 ? 'Disabled' : ''}`}
                  onClick={this.onSubmitOrder.bind(this)}
                >Submit</div>
              </div>
            </div>
          </div>
        </Modal>
      </div >
    )
  }
}

export default compose(
  connectContract(),
)(Table)
