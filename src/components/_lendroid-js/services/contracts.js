import axios from 'axios'
import * as Constants from '../constants'

export function FetchContractByToken(token, payload, callback) {
  const { web3, network } = payload
  const { ContractAddresses } = Constants;

  if (!ContractAddresses[token][network]) {
    return callback({ message: 'Unknown' })
  }

  if (!ContractAddresses[token].def) {
    const url = `https://${network === 1 ? 'api' : 'api-kovan'}.etherscan.io/api?module=contract&action=getabi&address=${ContractAddresses[token][network]}`
    axios.get(url)
      .then(res => {
        const contractABI = JSON.parse(res.data.result)
        const contractInstance = web3.eth.contract(contractABI).at(ContractAddresses[token][network])
        callback(null, { data: contractInstance })
      })
      .catch(err => callback(err))
  } else {
    const contractABI = ContractAddresses[token].def
    const contractInstance = web3.eth.contract(contractABI).at(ContractAddresses[token][network])
    callback(null, { data: contractInstance })
  }
}

export function FetchETHBallance(payload, callback) {
  const { web3, address } = payload
  web3.eth.getBalance(address, (err, res) => {
    if (err) return callback(err)
    const value = web3.fromWei(res.toString(), 'ether')
    callback(null, { data: value })
  })
}

export function FetchBallanceByToken(payload, callback) {
  const { web3, address, contractInstance } = payload

  if (!contractInstance.balanceOf) callback({ message: 'No ballanceOf() in Contract Instance' })
  contractInstance.balanceOf(address, (err, res) => {
    if (err) return callback(err)
    const value = web3.fromWei(res.toString(), 'ether')
    callback(null, { data: value })
  })
}

export function FetchAllowanceByToken(payload, callback) {
  const { web3, address, contractInstance } = payload

  if (!contractInstance.allowance) callback({ message: 'No allowance() in Contract Instance' })
  contractInstance.allowance(address, contractInstance.address, (err, res) => {
    if (err) return callback(err)
    const value = web3.fromWei(res.toString(), 'ether')
    callback(null, { data: value })
  })
}

export function FetchLoanPositions(payload, callback) {
  const { web3, address, LoanRegistry, Loan } = payload
  const LoanABI = Loan.abi

  LoanRegistry.getLoanCounts(address, async (err, res) => {
    if (err) return callback(err)

    const counts = res.map(item => item.toNumber())
    const positions = []

    for (let i = 0; i < counts[0]; i++) {
      const response = await new Promise((resolve, reject) => {
        LoanRegistry.lentLoans(address, i, (err, result) => {
          if (err) return reject(err)
          resolve(result)
        })
      })
      positions.push({
        type: 'lent',
        address: response
      })
    }
    for (let i = 0; i < counts[1]; i++) {
      const response = await new Promise((resolve, reject) => {
        LoanRegistry.borrowedLoans(address, i, (err, result) => {
          if (err) return reject(err)
          resolve(result)
        })
      })
      positions.push({
        type: 'borrowed',
        address: response
      })
    }

    for (let i = 0; i < positions.length; i++) {
      const position = positions[i]
      const LoanContract = web3.eth.contract(LoanABI).at(position.address)

      // a. `AMOUNT` is`Loan.loanAmountBorrowed()`
      // b. `TOTAL INTEREST` is`Loan.loanAmountOwed() - Loan.loanAmountBorrowed()`
      // c. `TERM` is`Loan.expiresAtTimestamp - currentTimestamp`
      // d. `LOAN HEALTH` is calculated as follows:
      //   i. `var currentCollateralAmount = Loan.loanAmountBorrowed() / eth_To_DAI_Rate`
      //   ii.display the result of`Loan.collateralAmount() / currentCollateralAmount * 100`
      const loanAmountBorrowed = await new Promise((resolve, reject) => {
        LoanContract.loanAmountBorrowed((err, result) => {
          if (err) return reject(err)
          resolve(web3.fromWei(result.toString(), 'ether'))
        })
      })
      const loanAmountOwed = await new Promise((resolve, reject) => {
        LoanContract.loanAmountOwed((err, result) => {
          if (err) return reject(err)
          resolve(web3.fromWei(result.toString(), 'ether'))
        })
      })
      const collateralAmount = await new Promise((resolve, reject) => {
        LoanContract.collateralAmount((err, result) => {
          if (err) return reject(err)
          resolve(web3.fromWei(result.toString(), 'ether'))
        })
      })
      const expiresAtTimestamp = await new Promise((resolve, reject) => {
        LoanContract.expiresAtTimestamp((err, result) => {
          if (err) return reject(err)
          resolve(('1' + result.toString()) * 1 * 100)
        })
      })
      const createdAtTimestamp = await new Promise((resolve, reject) => {
        LoanContract.createdAtTimestamp((err, result) => {
          if (err) return reject(err)
          resolve(result.toString() * 1000)
        })
      })
      const borrower = await new Promise((resolve, reject) => {
        LoanContract.borrower((err, result) => {
          if (err) return reject(err)
          resolve(result.toString())
        })
      })
      const wrangler = await new Promise((resolve, reject) => {
        LoanContract.wrangler((err, result) => {
          if (err) return reject(err)
          resolve(result.toString())
        })
      })
      const owner = await new Promise((resolve, reject) => {
        LoanContract.owner((err, result) => {
          if (err) return reject(err)
          resolve(result.toString())
        })
      })

      position.loanNumber = address
      position.amount = loanAmountBorrowed
      position.totalInterest = loanAmountOwed - loanAmountBorrowed
      position.term = (expiresAtTimestamp - Date.now()) / 3600

      position.origin = {
        loanAmountBorrowed,
        loanAmountOwed,
        collateralAmount,
        expiresAtTimestamp,
        createdAtTimestamp,
        LoanContract,
        borrower,
        wrangler,
        userAddress: address,
        owner,
      }
    }

    callback(null, {
      positions: {
        lent: positions
          .filter(position => (position.type === 'lent'))
          .sort((a, b) => (b.origin.createdAtTimestamp - a.origin.createdAtTimestamp)),
        borrowed: positions
          .filter(position => (position.type === 'borrowed'))
          .sort((a, b) => (b.origin.createdAtTimestamp - a.origin.createdAtTimestamp)),
      },
      counts
    })
  })
}

export function WrapETH(payload, callback) {
  const { web3, amount, isWrap, WETHContractInstance } = payload

  if (isWrap) {
    WETHContractInstance.deposit({ value: web3.toWei(amount) }, (err, hash) => {
      if (err) return callback(err)
      callback(err, hash)
    })
  } else {
    WETHContractInstance.withdraw(web3.toWei(amount), {}, (err, hash) => {
      if (err) return callback(err)
      callback(err, hash)
    })
  }
}

export function Allowance(payload, callback) {
  const { web3, address, tokenContractInstance, tokenAllowance, newAllowance } = payload

  const hashCallback = (err, hash) => {
    if (err) return callback(err)
    callback(err, hash)
  }

  if (
    tokenAllowance === 0
    || !tokenContractInstance.increaseApproval
    || !tokenContractInstance.decreaseApproval) {
    tokenContractInstance.approve(tokenContractInstance.address, web3.toWei(newAllowance), { from: address }, hashCallback)
  } else {
    if (newAllowance > tokenAllowance) {
      tokenContractInstance.increaseApproval(tokenContractInstance.address, web3.toWei(newAllowance - tokenAllowance), { from: address }, hashCallback)
    } else {
      tokenContractInstance.decreaseApproval(tokenContractInstance.address, web3.toWei(tokenAllowance - newAllowance), { from: address }, hashCallback)
    }
  }
}
