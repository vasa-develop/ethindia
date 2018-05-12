const Tables = [
  {
    title: 'Lend Order Book',
    headers: [
      {
        label: 'Amount',
        key: 'loanAmountOffered',
        precision: 3,
        style: { textAlign: 'center' }
      }, {
        label: 'Term',
        key: 'loanDuration',
        filter: 'calcTerm'
      }, {
        label: 'Rate',
        key: 'interestRatePerDay',
        precision: 3,
        suffix: '%'
      }
    ],
    data: {
      key: 'offers',
      filter: (d) => (
        d
          .filter(item => (item.lender && item.lender.length > 0))
          .sort((a, b) => (new Date(a.created_at).getTime() < new Date(b.created_at).getTime() ? 1 : -1))
      )
    },
    action: {
      label: 'Fill',
    }
  }, {
    title: 'Borrow Order Book',
    headers: [
      {
        label: 'Rate',
        key: 'interestRatePerDay',
        precision: 3,
        suffix: '%'
      }, {
        label: 'Term',
        key: 'loanDuration',
        filter: 'calcTerm'
      }, {
        label: 'Amount',
        key: 'loanAmountOffered',
        precision: 3,
        style: { textAlign: 'center' }
      }
    ],
    data: {
      key: 'offers',
      filter: (d) => (
        d
          .filter(item => (item.borrower && item.borrower.length > 0))
          .sort((a, b) => (new Date(a.created_at).getTime() < new Date(b.created_at).getTime() ? 1 : -1))
      )
    },
    action: {
      label: 'Select'
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
        key: 'loanAmountOffered',
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
            item.totalInterest = item.loanAmountOffered * item.interestRatePerDay
            return item
          })
      )
    },
    action: {
      key: 'close',
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
        key: 'loanAmountOffered',
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
            item.totalInterest = item.loanAmountOffered * item.interestRatePerDay
            return item
          })
      )
    },
    action: {
      key: 'close',
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
    data: [
      { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 13.83, totalInterest: 0.11064, term: 156, health: 80 },
      { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 64.4, totalInterest: 0.5796, term: 216, health: 45 },
      { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 13.85, totalInterest: 0.11064, term: 156, health: 90 },
    ],
    action: {
      label: '3-dot',
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
    data: [
      { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 13.83, totalInterest: 0.11064, term: 156, health: 84 },
      { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 64.4, totalInterest: 0.5796, term: 216, health: 45 },
      { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 13.85, totalInterest: 0.11064, term: 156, health: 65 },
    ],
    action: {
      label: '3-dot'
    }
  },
]

export default Tables
