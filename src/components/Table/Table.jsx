import React, { Component } from 'react'
import axios from 'axios'
import Modal from 'react-modal'

import { LoanOfferRegisteryABI } from './LoanOfferRegisteryABI'

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

const LoanOfferRegistryContractAddresses = {
  42: '0x6D5B0De54bddC6d2F80f1913AdFfd217F9BA06B7'
}

class Table extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalIsOpen: false,
      postError: null,
      result: {},
      approval: {},
      LoanOfferRegistryContractInstance: null
    }

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
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

  openModal() {
    this.setState({ modalIsOpen: true })
  }

  closeModal() {
    this.setState({ modalIsOpen: false })
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

  // Slots

  onOrder(data, input) {
    const { address } = this.props
    const _this = this
    let url = 'http://127.0.0.1:5000/loan_requests'

    const postData = Object.assign({ filler: address }, data)

    axios.post(url, postData)
      .then(res => {
        const result = res.data
        _this.setState({
          postError: null,
          result: result.data,
          approval: result.approval
        }, () => {
          _this.openModal()
        })
      })
      .catch(err => {
        _this.setState({
          postError: err
        }, () => {
          _this.openModal()
        })
      })
  }

  // Action

  onAction(action, data) {
    if (!action.slot) return
    this[action.slot](data, action.param)
  }

  onConfirm() {
    const { LoanOfferRegistryContractInstance, approval } = this.state
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
            this.closeModal()
          } else {
            this.closeModal()
          }
          this.setState({
            isLoading: false
          })
        })
    })
  }

  render() {
    const { data, classes } = this.props
    const { postError, result } = this.state
    const filteredData = this.getData(data)

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
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2 ref={subtitle => this.subtitle = subtitle}>Order Book</h2>
          <button onClick={this.closeModal}></button>
          <div className="ModalBody">
            {
              postError ?
                <div className="Error">{postError.toString()}</div>
                :
                <div>
                  {
                    this.state.isLoading &&
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
                    <div className="Cancel" onClick={this.closeModal}>Cancel</div>
                  </div>
                </div>
            }
          </div>
        </Modal>
      </div>
    )
  }
}

export default Table