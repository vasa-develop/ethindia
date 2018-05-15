export const FormInputs = [
  {
    key: 'loanAmountOffered',
    label: 'Amount',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'DAI',
      unit: 1
    }],
    required: true
  }, {
    key: 'interestRatePerDay',
    label: 'Daily Rate',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      arrow: true,
      step: 0.1,
      unit: 1
    }],
    required: true
  }, {
    key: 'loanDuration',
    label: 'Length',
    width: 150,
    output: (val) => (val + ' hours'),
    inputs: [{
      precision: 0,
      arrow: true,
      step: 1,
      suffix: 'd',
      unit: 24,
    }, {
      precision: 0,
      arrow: true,
      step: 1,
      suffix: 'h',
      max: 23,
      unit: 1
    }],
    required: true
  }, {
    key: 'offerExpiry',
    label: 'Order Expires',
    width: 150,
    output: (val) => {
      let ret = new moment()
      ret.add(val, 'm')
      return ret.format()
    },
    inputs: [{
      precision: 0,
      arrow: true,
      step: 1,
      suffix: 'h',
      unit: 60
    }, {
      precision: 0,
      arrow: true,
      step: 1,
      suffix: 'm',
      max: 60,
      unit: 1
    }]
  }, {
    key: 'allowance',
    label: 'Allowance',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'ETH',
      unit: 1
    }],
    style: { paddingRight: 8 }
  },
]

export const FeeFormInputs = [
  {
    key: 'relayerFeeLST',
    label: 'Relayer Fee',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'LST',
      unit: 1
    }]
  }, {
    key: 'monitoringFeeLST',
    label: 'Monitoring Fee',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'LST',
      unit: 1
    }]
  }, {
    key: 'rolloverFeeLST',
    label: 'RollOver Fee',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'LST',
      unit: 1
    }]
  }, {
    key: 'closureFeeLST',
    label: 'Closure Fee',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'LST',
      unit: 1
    }]
  }
]

export const WrapETHFormInputs = [
  {
    key: 'ETHBalance',
    label: 'ETH Balance',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 5,
      suffix: 'ETH',
      unit: 1
    }],
    readOnly: true
  }, {
    key: 'wETHBalance',
    label: 'WETH Balance',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 5,
      suffix: 'ETH',
      unit: 1
    }],
    readOnly: true
  }, {
    key: 'operation',
    label: 'Operation',
    width: 150,
  }, {
    key: 'amount',
    label: 'Amount',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'ETH',
      unit: 1
    }],
    required: true
  },
]

export const AllowanceFormInputs = [
  {
    key: 'token',
    label: 'Token',
    callback: 'getTokenContract',
    width: 150,
  }, {
    key: 'tokenBalance',
    label: 'Token Balance',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      unit: 1
    }],
    readOnly: true
  }, {
    key: 'tokenAllowance',
    label: 'Token Allowance',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      unit: 1
    }],
    readOnly: true
  }, {
    key: 'newAllowance',
    label: 'New Allowance',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'ETH',
      unit: 1
    }],
    required: true
  },
]