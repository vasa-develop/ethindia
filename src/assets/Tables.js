const Tables = [
  {
    title: 'Live Lend Orders',
    headers: [
      {
        label: 'Amount',
        key: 'loanAmountOffered',
        precision: 3,
        style: { textAlign: 'right' }
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
    title: 'Live Borrow Orders',
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
        style: { textAlign: 'right' }
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
      label: 'Select',
      style: { backgroundColor: '#f7f8f9' }
    }
  }, {
    title: 'LEND PENDING',
    headers: [
      {
        label: 'Loan Number',
        key: 'loanNumber',
        filter: 'shortAddress',
        style: { fontFamily: "Space Mono" }
      }, {
        label: 'Amount',
        key: 'amount',
        precision: 2,
      }, {
        label: 'Total Interest ',
        key: 'totalInterest',
      }, {
        label: 'Term',
        key: 'term',
        filter: 'calcTerm'
      }
    ],
    data: [
      { loanNumber: '0x27...1A9Z', amount: 13.83, totalInterest: 0.11064, term: 156 },
      { loanNumber: '0x32...136B', amount: 64.4, totalInterest: 0.5796, term: 216 },
      { loanNumber: '0x18...4567', amount: 13.85, totalInterest: 0.11064, term: 156 },
    ],
    action: {
      label: 'Cancel',
    }
  }, {
    title: 'BORROW PENDING',
    headers: [
      {
        label: 'Loan Number',
        key: 'loanNumber',
        filter: 'shortAddress',
        style: { fontFamily: "Space Mono" }
      }, {
        label: 'Amount',
        key: 'amount',
        precision: 2,
      }, {
        label: 'Total Interest ',
        key: 'totalInterest',
      }, {
        label: 'Term',
        key: 'term',
        filter: 'calcTerm'
      }
    ],
    data: [
      { loanNumber: '0x27...1A9Z', amount: 13.83, totalInterest: 0.11064, term: 156 },
      { loanNumber: '0x32...136B', amount: 64.4, totalInterest: 0.5796, term: 216 },
      { loanNumber: '0x18...4567', amount: 13.85, totalInterest: 0.11064, term: 156 },
    ],
    action: {
      label: 'Cancel',
      style: { backgroundColor: '#f7f8f9' }
    }
  }, {
    title: 'LEND ACTIVE',
    headers: [
      {
        label: 'Loan Number',
        key: 'loanNumber',
        filter: 'shortAddress',
        style: { fontFamily: "Space Mono", textAlign: 'right' }
      }, {
        label: 'Amount',
        key: 'amount',
        precision: 2,
      }, {
        label: 'Total Interest ',
        key: 'totalInterest',
      }, {
        label: 'Term',
        key: 'term',
        filter: 'calcTerm'
      }, {
        label: 'Health',
        key: 'health',
        suffix: '%'
      }
    ],
    data: [
      { loanNumber: '0x27...1A9Z', amount: 13.83, totalInterest: 0.11064, term: 156, health: 200 },
      { loanNumber: '0x32...136B', amount: 64.4, totalInterest: 0.5796, term: 216 },
      { loanNumber: '0x18...4567', amount: 13.85, totalInterest: 0.11064, term: 156, health: 100 },
    ],
    action: {
      label: '3-dot',
    }
  }, {
    title: 'BORROW ACTIVE',
    headers: [
      {
        label: 'Loan Number',
        key: 'loanNumber',
        filter: 'shortAddress',
        style: { fontFamily: "Space Mono", textAlign: 'right' }
      }, {
        label: 'Amount',
        key: 'amount',
        precision: 2,
      }, {
        label: 'Total Interest ',
        key: 'totalInterest',
      }, {
        label: 'Term',
        key: 'term',
        filter: 'calcTerm'
      }, {
        label: 'Health',
        key: 'health',
        suffix: '%'
      }
    ],
    data: [
      { loanNumber: '0x27...1A9Z', amount: 13.83, totalInterest: 0.11064, term: 156, health: 200 },
      { loanNumber: '0x32...136B', amount: 64.4, totalInterest: 0.5796, term: 216 },
      { loanNumber: '0x18...4567', amount: 13.85, totalInterest: 0.11064, term: 156, health: 100 },
    ],
    action: {
      label: '3-dot',
      style: { backgroundColor: '#f7f8f9' }
    }
  },
]

export default Tables