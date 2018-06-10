const fillZero = (len = 40) => {
  return '0x' + (new Array(len)).fill(0).join('')
}

const CreateTables = (web3) => ([
  {
    title: 'Lend Order Book',
    headers: [
      {
        label: 'Amount',
        key: 'loanAmount',
        precision: 3,
        style: { textAlign: 'center' }
      }, {
        label: 'Term',
        key: 'loanDuration',
        filter: 'calcTerm'
      }, {
        label: 'Rate',
        key: 'interestRate',
        precision: 3,
        suffix: '%'
      }
    ],
    data: {
      key: 'offers',
      filter: (d) => (
        d
          .filter(item => (item.lender && item.lender !== fillZero()))
          .sort((a, b) => (new Date(a.created_at).getTime() < new Date(b.created_at).getTime() ? 1 : -1))
          .map(item => {
            item.interestRate = web3.fromWei(item.interestRatePerDay, 'ether')
            item.loanAmount = web3.fromWei(item.loanAmountOffered, 'ether')
            return item
          })
      )
    },
    action: {
      label: 'Fill',
      slot: 'onOrder',
      param: { isLend: true }
    }
  }, {
    title: 'Borrow Order Book',
    headers: [
      {
        label: 'Rate',
        key: 'interestRate',
        precision: 3,
        suffix: '%'
      }, {
        label: 'Term',
        key: 'loanDuration',
        filter: 'calcTerm'
      }, {
        label: 'Amount',
        key: 'loanAmount',
        precision: 3,
        style: { textAlign: 'center' }
      }
    ],
    data: {
      key: 'offers',
      filter: (d) => (
        d
          .filter(item => (item.borrower && item.borrower !== fillZero()))
          .sort((a, b) => (new Date(a.created_at).getTime() < new Date(b.created_at).getTime() ? 1 : -1))
          .map(item => {
            item.interestRate = web3.fromWei(item.interestRatePerDay, 'ether')
            item.loanAmount = web3.fromWei(item.loanAmountOffered, 'ether')
            return item
          })
      )
    },
    action: {
      label: 'Select',
      slot: 'onOrder',
      param: { isLend: false }
    }
  }, {
    title: 'MY LEND ORDERS',
    headers: [
      {
        label: 'Loan Number',
        key: 'lender',
        style: { fontFamily: 'Space Mono', width: '100%' }
      }, {
        label: 'Amount',
        key: 'loanAmount',
        precision: 2,
        style: { fontFamily: 'Space Mono', width: '33%' }
      }, {
        label: 'Total Interest ',
        key: 'totalInterest',
        precision: 5,
        style: { fontFamily: 'Space Mono', width: '40%' }
      }, {
        label: 'Term',
        key: 'loanDuration',
        filter: 'calcTerm',
        style: { fontFamily: 'Space Mono', width: '27%' }
      }
    ],
    data: {
      key: 'myLendOffers',
      filter: (d) => (
        d
          .sort((a, b) => (new Date(a.created_at).getTime() < new Date(b.created_at).getTime() ? 1 : -1))
          .map(item => {
            item.totalInterest = web3.fromWei(item.loanAmountOffered, 'ether') * web3.fromWei(item.interestRatePerDay, 'ether')
            item.loanAmount = web3.fromWei(item.loanAmountOffered, 'ether')
            return item
          })
      )
    },
    action: {
      key: 'close',
      slot: 'onCancel',
      param: { isLend: true }
    }
  }, {
    title: 'MY BORROW ORDERS',
    headers: [
      {
        label: 'Loan Number',
        key: 'borrower',
        style: { fontFamily: 'Space Mono', width: '100%' }
      }, {
        label: 'Amount',
        key: 'loanAmount',
        precision: 2,
        style: { fontFamily: 'Space Mono', width: '33%' }
      }, {
        label: 'Total Interest ',
        key: 'totalInterest',
        precision: 5,
        style: { fontFamily: 'Space Mono', width: '40%' }
      }, {
        label: 'Term',
        key: 'loanDuration',
        filter: 'calcTerm',
        style: { fontFamily: 'Space Mono', width: '27%' }
      }
    ],
    data: {
      key: 'myBorrowOffers',
      filter: (d) => (
        d
          .sort((a, b) => (new Date(a.created_at).getTime() < new Date(b.created_at).getTime() ? 1 : -1))
          .map(item => {
            item.totalInterest = web3.fromWei(item.loanAmountOffered, 'ether') * web3.fromWei(item.interestRatePerDay, 'ether')
            item.loanAmount = web3.fromWei(item.loanAmountOffered, 'ether')
            return item
          })
      )
    },
    action: {
      key: 'close',
      slot: 'onCancel',
      param: { isLend: false }
    }
  }, {
    title: 'MY LEND POSITIONS',
    headers: [
      {
        label: 'Loan Number',
        key: 'loanNumber',
        style: { fontFamily: 'Space Mono', width: '100%' }
      }, {
        label: 'Amount',
        key: 'amount',
        precision: 2,
        style: { fontFamily: 'Space Mono', width: '25%' }
      }, {
        label: 'Total Interest ',
        key: 'totalInterest',
        precision: 5,
        style: { fontFamily: 'Space Mono', width: '30%' }
      }, {
        label: 'Term',
        key: 'term',
        filter: 'calcTerm',
        style: { fontFamily: 'Space Mono', width: '25%' }
      }, {
        label: 'Loan Health',
        key: 'health',
        suffix: '%',
        style: { fontFamily: 'Space Mono', width: '20%' }
      }
    ],
    data: {
      key: 'lent',
      test: [
        { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 13.83, totalInterest: 0.11064, term: 156, health: 80 },
        { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 64.4, totalInterest: 0.5796, term: 216, health: 45 },
        { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 13.85, totalInterest: 0.11064, term: 156, health: 90 },
      ]
    },
    action: {
      label: '3-dot',
      type: 'dropdown',
      items: [{
        label: 'Liquidate',
        slot: 'onLiquidatePosition',
        param: { isLend: true },
      }]
    }
  }, {
    title: 'MY BORROW POSITIONS',
    headers: [
      {
        label: 'Loan Number',
        key: 'loanNumber',
        style: { fontFamily: 'Space Mono', width: '100%' }
      }, {
        label: 'Amount',
        key: 'amount',
        precision: 2,
        style: { fontFamily: 'Space Mono', width: '25%' }
      }, {
        label: 'Total Interest ',
        key: 'totalInterest',
        precision: 5,
        style: { fontFamily: 'Space Mono', width: '30%' }
      }, {
        label: 'Term',
        key: 'term',
        filter: 'calcTerm',
        style: { fontFamily: 'Space Mono', width: '25%' }
      }, {
        label: 'Loan Health',
        key: 'health',
        suffix: '%',
        style: { fontFamily: 'Space Mono', width: '20%' }
      }
    ],
    data: {
      key: 'borrowed',
      test: [
        { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 13.83, totalInterest: 0.11064, term: 156, health: 84 },
        { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 64.4, totalInterest: 0.5796, term: 216, health: 45 },
        { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 13.85, totalInterest: 0.11064, term: 156, health: 65 },
      ]
    },
    action: {
      label: '3-dot',
      type: 'dropdown',
      items: [{
        label: 'Liquidate',
        slot: 'onLiquidatePosition',
        param: { isLend: false },
      }, {
        label: 'Close',
        slot: 'onClosePosition',
        param: { isLend: false },
      },]
    }
  },
])

export default CreateTables
