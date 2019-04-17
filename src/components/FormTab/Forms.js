import moment from 'moment'

export function FormInputs(isLend, tokens) {
  return [
    {
      key: 'loanAmountOffered',
      label: 'Amount',
      width: 150,
      output: val => val.toString(),
      inputs: [
        {
          precision: 3,
          suffix: isLend ? tokens.lend : tokens.lend,
          isLend,
          unit: 1
        }
      ],
      required: true,
      validation: (contracts, rate = 1, token) => true,
      warning: {
        check: (contracts, value, exchangeRate, token) => {
          if (isLend) {
            if (
              parseFloat(contracts.allowances[token]) * exchangeRate <
              1000000
            )
              return true
          }
          return false
        },
        message: token => token
      }
    },
    {
      key: 'interestRatePerDay',
      label: 'Daily Rate',
      width: 150,
      output: val => val.toString(),
      inputs: [
        {
          precision: 3,
          arrow: true,
          step: 1,
          unit: 1
        }
      ],
      required: true
    },
    {
      key: 'loanDuration',
      label: 'Loan Period',
      width: 150,
      output: val => val.toString(),
      inputs: [
        {
          precision: 0,
          step: 1,
          suffix: 'days',
          unit: 1 // 24 * 3600,
        }
      ],
      required: true
    },
    {
      key: 'offerExpiry',
      label: 'Order Expiry',
      width: 150,
      output: val => {
        let ret = new moment.utc()
        ret.add(val * 60, 'm')
        return ret.format('x')
      },
      inputs: [
        {
          precision: 0,
          step: 1,
          suffix: 'hours',
          unit: 1 // 60
        }
      ]
    }
  ]
}

export function FeeFormInputs(isLend) {
  return [
    {
      key: 'relayerFeeLST',
      label: 'Relayer Fee',
      width: 150,
      output: val => val.toString(),
      inputs: [
        {
          precision: 3,
          suffix: 'LST',
          unit: 1
        }
      ],
      readOnly: true,
      warning: {
        feature: true,
        check: () => false,
        message: 'Coming soon in v2'
      }
    },
    {
      key: 'monitoringFeeLST',
      label: 'Monitoring Fee',
      width: 150,
      output: val => val.toString(),
      inputs: [
        {
          precision: 3,
          suffix: 'LST',
          unit: 1
        }
      ],
      required: true,
      validation: (contracts, value) => true,
      warning: {
        check: (contracts, value) => {
          if (parseFloat(value) <= 0) return true
          if (isLend) {
            return parseFloat(contracts.allowances['LST']) < 1000000
          } else {
            return parseFloat(value) <= 0
          }
        },
        message: isLend
          ? (token, value) =>
              parseFloat(value) > 0 ? `LST` : `Monitoring fee cannot be 0`
          : value => `Monitoring fee cannot be 0`
      }
    },
    {
      key: 'rolloverFeeLST',
      label: 'RollOver Fee',
      width: 150,
      output: val => val.toString(),
      inputs: [
        {
          precision: 3,
          suffix: 'LST',
          unit: 1
        }
      ],
      readOnly: true,
      warning: {
        feature: true,
        check: () => false,
        message: 'Coming soon in v2'
      }
    },
    {
      key: 'closureFeeLST',
      label: 'Closure Fee',
      width: 150,
      output: val => val.toString(),
      inputs: [
        {
          precision: 3,
          suffix: 'LST',
          unit: 1
        }
      ],
      readOnly: true,
      warning: {
        feature: true,
        check: () => false,
        message: 'Coming soon in v2'
      }
    }
  ]
}

export const WrapETHFormInputs = [
  {
    key: 'ETHBalance',
    label: 'ETH Balance',
    width: 150,
    output: val => val.toString(),
    inputs: [
      {
        precision: 5,
        suffix: 'ETH',
        unit: 1
      }
    ],
    readOnly: true,
    value: contracts => (contracts.balances ? contracts.balances.ETH || 0 : 0),
    loading: 'wrapping'
  },
  {
    key: 'wETHBalance',
    label: 'WETH Balance',
    width: 150,
    output: val => val.toString(),
    inputs: [
      {
        precision: 5,
        suffix: 'WETH',
        unit: 1
      }
    ],
    readOnly: true,
    value: contracts => (contracts.balances ? contracts.balances.WETH || 0 : 0),
    loading: 'wrapping'
  },
  {
    key: 'operation',
    label: 'Operation',
    width: 150
  },
  {
    key: 'amount',
    label: 'Amount',
    width: 150,
    output: val => val.toString(),
    inputs: [
      {
        precision: 3,
        unit: 1
      }
    ],
    required: true
  }
]

export const AllowanceFormInputs = [
  {
    key: 'token',
    label: 'Token',
    width: 150
  },
  {
    key: 'tokenBalance',
    label: 'Token Balance',
    width: 150,
    output: val => val.toString(),
    inputs: [
      {
        precision: 3,
        unit: 1
      }
    ],
    readOnly: true,
    value: contracts =>
      contracts.balances ? contracts.balances[contracts.token] || 0 : 0,
    loading: 'wrapping'
  },
  {
    key: 'tokenAllowance',
    label: 'Token Allowance',
    width: 150,
    output: val => val.toString(),
    inputs: [
      {
        precision: 3,
        unit: 1
      }
    ],
    readOnly: true,
    value: contracts =>
      contracts.allowances ? contracts.allowances[contracts.token] || 0 : 0,
    loading: 'allowance'
  },
  {
    key: 'newAllowance',
    label: 'New Allowance',
    width: 150,
    output: val => val.toString(),
    inputs: [
      {
        precision: 3,
        unit: 1
      }
    ],
    required: true
  }
]

export const MakerDAIFormInputs = [
  {
    key: 'ethBalance',
    label: 'ETH Balance',
    width: 150,
    output: val => val.toString(),
    inputs: [
      {
        precision: 3,
        unit: 1
      }
    ],
    readOnly: true,
    value: contracts => (contracts.balances ? contracts.balances.ETH || 0 : 0),
    loading: 'making'
  },
  {
    key: 'daiBalance',
    label: 'DAI Balance',
    width: 150,
    output: val => val.toString(),
    inputs: [
      {
        precision: 3,
        unit: 1
      }
    ],
    readOnly: true,
    value: contracts => (contracts.balances ? contracts.balances.DAI || 0 : 0),
    loading: 'making'
  },
  {
    key: 'lockETH',
    label: 'Amount to Lock(ETH)',
    width: 150,
    output: val => val.toString(),
    inputs: [
      {
        precision: 3,
        unit: 1
      }
    ],
    required: true
  },
  {
    key: 'amountInDAI',
    label: 'Amount to Buy(DAI)',
    width: 150,
    output: val => val.toString(),
    inputs: [
      {
        precision: 3,
        unit: 1
      }
    ],
    readOnly: true,
    required: true
  }
]
