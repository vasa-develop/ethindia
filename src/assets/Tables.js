const Tables = [
  {
    title: 'Live Lend Orders',
    headers: [
      {
        label: 'Amount',
        key: 'amount',
        precision: 3,
        style: { textAlign: 'right' }
      }, {
        label: 'Term',
        key: 'term',
        filter: 'calcTerm'
      }, {
        label: 'Rate',
        key: 'rate',
        precision: 3,
        suffix: '%'
      }
    ],
    data: [
      { amount: 100000.458, term: 156, rate: 0.009 },
      { amount: 350.254, term: 156, rate: 0.009 },
      { amount: 4523.458, term: 156, rate: 0.009 },
      { amount: 131000.000, term: 156, rate: 0.009 },
      { amount: 2000.120, term: 156, rate: 0.009 },
      { amount: 1200.5, term: 156, rate: 0.009 },
      { amount: 2400, term: 156, rate: 0.009 },
    ],
    action: {
      label: 'Fill',
    }
  }, {
    title: 'Live Borrow Orders',
    headers: [
      {
        label: 'Rate',
        key: 'rate',
        precision: 3,
        suffix: '%'
      }, {
        label: 'Term',
        key: 'term',
        filter: 'calcTerm'
      }, {
        label: 'Amount',
        key: 'amount',
        precision: 3,
        style: { textAlign: 'right' }
      }
    ],
    data: [
      { amount: 100000.458, term: 156, rate: 0.009 },
      { amount: 2400, term: 156, rate: 0.009 },
      { amount: 1200.5, term: 156, rate: 0.009 },
      { amount: 2000.120, term: 156, rate: 0.009 },
      { amount: 131000.000, term: 156, rate: 0.009 },
      { amount: 4523.458, term: 156, rate: 0.009 },
      { amount: 350.254, term: 156, rate: 0.009 },
      { amount: 131000.000, term: 156, rate: 0.009 },
      { amount: 1200.5, term: 156, rate: 0.009 },
    ],
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