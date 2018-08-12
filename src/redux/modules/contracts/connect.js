import { connect } from 'react-redux'
import { contractActionCreators } from './actions'

function mapStateToProps({ contracts }) {
  return {
    contracts
  }
}

const mapDispatchToProps = contractActionCreators

export function connectContract(configMapStateToProps = mapStateToProps) {
  return connect(
    configMapStateToProps,
    mapDispatchToProps,
  )
}
