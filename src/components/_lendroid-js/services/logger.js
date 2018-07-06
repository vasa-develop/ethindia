export class Logger {
  /**
   * To log DEBUG logs to console
   */
  static log(context, message) {
    console.log(`context=${context}, ${JSON.stringify(message)}`)
  }

  /**
   * To log INFO logs to console (for viewing in browser)
   */
  static info(context, message) {
    console.info(`context=${context}, ${JSON.stringify(message)}`)
  }

  /**
   * To log WARNING/ERROR logs to console
   */
  static error(context, message) {
    console.error(`context=${context}, ${JSON.stringify(message)}`)
  }
}

export const LoggerContext = {
  // Lendroid Main Logs
  INIT: 'Lendroid Init',
  RESET: 'Lendroid Reset',

  // Contracts
  CONTRACT_ERROR: 'Contract Error',

  // API
  API_ERROR: 'API Error',

  // Others
  DEPOSIT_FUNDS: 'DepositFunds',
  WEBPACK: 'Webpack',
  WEB3: 'Web3',
  COMMIT_FUNDS: 'CommitFunds',
  GET_APPROVAL: 'GetApproval',
  GET_WITHDRAWABLE_BALANCE: 'GetWithdrawableBalance',
  GET_POSITION_BALANCE: 'GetPositionBalance',
  GET_CASH_BALANCE: 'GetCashBalance',
  GET_LOCKED_BALANCE: 'GetLockedBalance',
  CREATE_LOAN_OFFER: 'CreateLoanOffer',
  CREATE_ORDER: 'CreateOrder',
  GET_LOAN_OFFERS: 'GetLoanOffers',
  INTEGRATION_TEST: 'IntegrationTest',
  OPEN_TRADING_POSITION: 'OpenTradingPosition',
  SIGN_LOAN_OFFER: 'SignLoanOffer'
}
