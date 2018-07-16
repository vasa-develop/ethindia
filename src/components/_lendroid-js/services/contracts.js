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
  const { web3, address, contractInstance, tokenTransferProxyContract } = payload

  if (!contractInstance.allowance) callback({ message: 'No allowance() in Contract Instance' })
  contractInstance.allowance(address, tokenTransferProxyContract.address, (err, res) => {
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
      const loanStatus = await new Promise((resolve, reject) => {
        LoanContract.status((err, result) => {
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

      let status = 'Unknown'

      switch (Number(loanStatus)) {
        case Constants.LOAN_STATUS_ACTIVE: status = 'Active'; break
        case Constants.LOAN_STATUS_CLOSED: status = 'Closed'; break
        case Constants.LOAN_STATUS_LIQUIDATED: status = 'Liquidated'; break
        case Constants.LOAN_STATUS_LIQUIDATING: status = 'Liquidating'; break
        default: 'Unknown'
      }

      position.status = status

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
        loanStatus,
        owner,
      }
    }
    const activePositions = positions.filter(position => position.origin.loanStatus !== Constants.LOAN_STATUS_DEACTIVATED)

    callback(null, {
      positions: {
        lent: activePositions
          .filter(position => (position.type === 'lent'))
          .sort((a, b) => (b.origin.createdAtTimestamp - a.origin.createdAtTimestamp))
          .slice(0, 10),
        borrowed: activePositions
          .filter(position => (position.type === 'borrowed'))
          .sort((a, b) => (b.origin.createdAtTimestamp - a.origin.createdAtTimestamp))
          .slice(0, 10),
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
  const { web3, address, tokenContractInstance, tokenAllowance, newAllowance, tokenTransferProxyContract } = payload

  const hashCallback = (err, hash) => {
    if (err) return callback(err)
    callback(err, hash)
  }

  if (
    tokenAllowance === 0
    || !tokenContractInstance.increaseApproval
    || !tokenContractInstance.decreaseApproval) {
    tokenContractInstance.approve(tokenTransferProxyContract.address, web3.toWei(newAllowance), { from: address }, hashCallback)
  } else {
    if (newAllowance > tokenAllowance) {
      tokenContractInstance.increaseApproval(tokenTransferProxyContract.address, web3.toWei(newAllowance - tokenAllowance), { from: address }, hashCallback)
    } else {
      tokenContractInstance.decreaseApproval(tokenTransferProxyContract.address, web3.toWei(tokenAllowance - newAllowance), { from: address }, hashCallback)
    }
  }
}

export function FillLoan(payload, callback) {
  const { approval, LoanOfferRegistryContractInstance } = payload

  LoanOfferRegistryContractInstance.fill(
    approval._addresses,
    approval._values,
    approval._vS,
    approval._rS,
    approval._sS,
    approval._isOfferCreatorLender,
    callback
  )
}

export function ClosePosition(payload, callback) {
  const { data } = payload

  data.origin.LoanContract.close(data.origin.userAddress, (err, hash) => {
    if (err) callback(null)
    setTimeout(callback, 5000, null, hash)
  })
}

export function CancelOrder(payload, callback) {
  const { web3, data, currentWETHExchangeRate, LoanOfferRegistryContractInstance } = payload

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

  const onFilledAmount = (err, result) => {
    if (err) callback(null)
    const filledAmount = web3.fromWei(result.toString(), 'ether')
    const cancelledCollateralTokenAmount = data.loanAmountOffered * currentWETHExchangeRate - filledAmount

    LoanOfferRegistryContractInstance.cancel(addresses, values, data.vCreator, data.rCreator, data.sCreator, cancelledCollateralTokenAmount, callback)
  }

  const onOrderHash = (err, result) => {
    if (err) callback(null)
    LoanOfferRegistryContractInstance.filled(result, onFilledAmount)
  }

  LoanOfferRegistryContractInstance.computeOfferHash(addresses, values, onOrderHash)
}
