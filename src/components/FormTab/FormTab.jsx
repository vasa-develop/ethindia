import React, { Component } from 'react'
import axios from 'axios'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import FormInput from '../FormInput/FormInput'

import { FormInputs, FeeFormInputs, WrapETHFormInputs, AllowanceFormInputs } from './Forms'

import './FormTab.scss'
import './ReactTab.scss'

const WETHAddresses = {
  1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  42: '0xd0a1e359811322d97991e03f863a0c30c2cf029c'
}

const ContractAddresses = {
  WETH: {
    1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    42: '0xd0a1e359811322d97991e03f863a0c30c2cf029c'
  },
  LST: {
    1: '0x4de2573e27E648607B50e1Cfff921A33E4A34405',
    42: '0x13a68a7cc8564C23390870FF33504F38289ff87e',
    def: [{ "constant": true, "inputs": [], "name": "mintingFinished", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "MAX_SUPPLY", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "unpause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "to", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "paused", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "finishMinting", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "pause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [], "name": "Pause", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Unpause", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "Mint", "type": "event" }, { "anonymous": false, "inputs": [], "name": "MintFinished", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }]
  },
  DAI: {
    1: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
    42: '0xC4375B7De8af5a38a93548eb8453a498222C4fF2',
    def: [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "stop", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "owner_", "type": "address" }], "name": "setOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "mint", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint256" }], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "name_", "type": "bytes32" }], "name": "setName", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "src", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "stopped", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "authority_", "type": "address" }], "name": "setAuthority", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint256" }], "name": "mint", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "push", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "move", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "start", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "authority", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "src", "type": "address" }, { "name": "guy", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "pull", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "symbol_", "type": "bytes32" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "guy", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Mint", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "guy", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Burn", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "authority", "type": "address" }], "name": "LogSetAuthority", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }], "name": "LogSetOwner", "type": "event" }, { "anonymous": true, "inputs": [{ "indexed": true, "name": "sig", "type": "bytes4" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": true, "name": "foo", "type": "bytes32" }, { "indexed": true, "name": "bar", "type": "bytes32" }, { "indexed": false, "name": "wad", "type": "uint256" }, { "indexed": false, "name": "fax", "type": "bytes" }], "name": "LogNote", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Transfer", "type": "event" }]
  }
}

class FormTab extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: {},

      // Lend/Borrow Form Inputs
      contracts: {},
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

      // isLend: true,

      tabIndex: 0,
    }
  }

  componentDidMount() {
    if (this.props.address) this.getBalance(this.props.address)
    this.getETD()
    this.getTokenContract({ token: 'WETH' }, this.props.network)
    this.getTokenContract({ token: 'DAI' }, this.props.network)
    this.getTokenContract({ token: 'LST' }, this.props.network)
  }

  componentWillReceiveProps(newProps) {
    const { address, network } = this.props

    if (newProps.address !== address || newProps.network !== network) {
      this.getBalance(newProps.address)
      this.getTokenContract({ token: 'WETH' }, newProps.network)
      this.getTokenContract({ token: 'DAI' }, newProps.network)
      this.getTokenContract({ token: 'LST' }, newProps.network)
    }
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

    web3 && web3.eth && web3.eth.getBalance(address, (err, result) => {
      if (err) {
        this.setState({
          web3Error: err
        })
      } else {
        const value = this.fromBigToNumber(result)
        if (origin === null || (compare ? (value > origin) : (value < origin))) {
          const { isLoading } = this.state
          isLoading['ETHBalance'] = false

          this.setState({
            ETHBalance: value,
            isLoading
          })
        } else {
          setTimeout(() => this.getBalance(address, origin, compare), 1000)
        }
      }
    })
  }

  getTokenContract(state = null, net = null) {
    const { web3 } = window
    const token = state ? state.token : this.state.token
    const network = net ? net : this.props.network

    if (!ContractAddresses[token][network]) return

    const { isLoading } = this.state
    isLoading[token + 'Balance'] = true
    isLoading[token + 'Allowance'] = true
    this.setState({ isLoading })

    if (!ContractAddresses[token].def) {
      const url = `https://${network === 1 ? 'api' : 'api-kovan'}.etherscan.io/api?module=contract&action=getabi&address=${ContractAddresses[token][network]}`
      axios.get(url)
        .then(res => {
          if (res.data.status === '1') {
            const contractABI = JSON.parse(res.data.result)
            if (contractABI !== '') {
              const tokenContractInstance = web3.eth.contract(contractABI).at(ContractAddresses[token][network])
              const { contracts } = this.state
              contracts[token] = contracts[token] || {}
              contracts[token].contract = tokenContractInstance
              this.setState({ contracts },
                () => {
                  this.getTokenBalance(this.props.address, token)
                  this.getTokenAllowance(this.props.address, token)
                }
              )
            }
          }
        })
    } else {
      const contractABI = ContractAddresses[token].def
      const tokenContractInstance = web3.eth.contract(contractABI).at(ContractAddresses[token][network])
      const { contracts } = this.state
      contracts[token] = contracts[token] || {}
      contracts[token].contract = tokenContractInstance
      this.setState({ contracts },
        () => {
          this.getTokenBalance(this.props.address, token)
          this.getTokenAllowance(this.props.address, token)
        }
      )
    }
  }

  getTokenBalance(address, token, origin = null, compare = true) {
    const { contracts } = this.state
    const contractInstance = contracts[token].contract
    if (!contractInstance) return

    const { isLoading } = this.state
    isLoading[token + 'Balance'] = true
    this.setState({ isLoading })

    contractInstance.balanceOf(address, (err, result) => {
      if (err) {
        this.setState({
          web3Error: err
        })
      } else {
        const value = this.fromBigToNumber(result)
        if (origin === null || (compare ? (value > origin) : (value < origin))) {
          const { contracts, isLoading } = this.state
          contracts[token].balance = value
          isLoading[token + 'Balance'] = false
          this.setState({ contracts, isLoading })
        } else {
          setTimeout(() => this.getTokenBalance(address, token, origin, compare), 1000)
        }
      }
    })
  }

  getTokenAllowance(address, token, origin = null) {
    const { contracts } = this.state
    const { network } = this.props
    const contractInstance = contracts[token].contract
    if (!contractInstance) return

    const { isLoading } = this.state
    isLoading[token + 'Allowance'] = true
    this.setState({ isLoading })

    contractInstance.allowance(address, ContractAddresses[token][network], (err, result) => {
      if (err) {
        this.setState({
          web3Error: err
        })
      } else {
        const value = this.fromBigToNumber(result)
        if (!origin || value === origin) {
          const { contracts, isLoading } = this.state
          contracts[token].allowance = this.fromBigToNumber(result)
          isLoading[token + 'Allowance'] = false
          this.setState({ contracts, isLoading })
        } else {
          setTimeout(() => this.getTokenAllowance(address, token, origin), 1000)
        }
      }
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
      if (item.callback) this[item.callback]({ [item.key]: e.target.value }, this.props.network)
    }
  }

  isValid(isLend = true) {
    const formData = this.state
    let valid = true
    FormInputs(isLend).forEach(item => {
      if (item.required && Number(formData[item.key]) === 0) {
        valid = false
      } else if (item.validation) {
        if (!item.validation(formData)) valid = false
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

  onSubmit(isLend) {
    return () => {
      // const { isLend } = this.state
      const formData = this.state
      const { address, methods } = this.props
      let postData = {}
      FormInputs(isLend).forEach(item => {
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
  }

  onWrapETH() {
    const { contracts, amount, operation, ETHBalance } = this.state
    const WETHContractInstance = contracts['WETH'].contract
    if (!WETHContractInstance) return
    const wETHBalance = contracts['WETH'].balance
    const { address } = this.props
    const { web3 } = window
    const _this = this

    if (operation === 'Wrap') {
      WETHContractInstance.deposit({ value: web3.toWei(amount) }, (err, result) => {
        setTimeout(() => {
          _this.props.onSync(ETHBalance, false)
          _this.getBalance(address, ETHBalance, false)
          _this.getTokenBalance(address, 'WETH', wETHBalance, true)
        }, 1000)
      })
    } else {
      WETHContractInstance.withdraw(web3.toWei(amount), {}, (err, result) => {
        setTimeout(() => {
          _this.props.onSync(ETHBalance, true)
          _this.getBalance(address, ETHBalance, true)
          _this.getTokenBalance(address, 'WETH', wETHBalance, false)
        }, 1000)
      })
    }
  }

  onAllowance() {
    const { contracts, newAllowance, token } = this.state
    const tokenContractInstance = contracts[token].contract
    const { address, network } = this.props
    const { web3 } = window

    if (!tokenContractInstance) return

    tokenContractInstance.approve(ContractAddresses[token][network], web3.toWei(newAllowance), { from: address }, (err, result) => {
      this.props.onSync()
      this.getTokenAllowance(address, token, newAllowance)
    })
  }

  // onToggle() {
  //   this.setState({
  //     isLend: !this.state.isLend
  //   })
  // }

  onTabChange(tabIndex) {
    this.setState({ tabIndex })

    const formData = this.state

    switch (tabIndex) {
      case 0: // Lend Form
        break;
      case 1: // Borrow Form
        break;
      case 2: // Wrap/Unwrap Form
        break;
      case 3: // Allowance Form
        break;
    }
  }

  render() {
    const formData = this.state

    const isValid = this.isValid()

    return (
      <div className="TabWrapper">
        <div className="Title">WHAT ARE YOU UP TO TODAY?</div>
        {/* <div className={`Toggle ${formData.isLend ? 'Lend' : 'Borrow'}`}>
          <div className="Handle" onClick={this.onToggle.bind(this)}>{!formData.isLend ? 'Lend' : 'Borrow'}</div>
          <div className="Handle Bar">{formData.isLend ? 'Lend' : 'Borrow'}</div>
        </div> */}
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
                          val={item.value ? (item.value(formData)) : formData[item.key]}
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
                        <FormInput data={item} onChange={this.onChange.bind(this)} val={item.value ? (item.value(formData)) : formData[item.key]} />
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
                          val={item.value ? (item.value(formData)) : formData[item.key]}
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
                          val={item.value ? (item.value(formData)) : formData[item.key]}
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
                              val={item.value ? (item.value(formData)) : formData[item.key]}
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
                              val={item.value ? (item.value(formData)) : formData[item.key]}
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

export default FormTab
