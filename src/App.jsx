import React, { Component } from 'react'
import FadeIn from 'react-fade-in'

import {
  Route,
  Switch
} from 'react-router-dom'

import Orders from './components/Orders/Orders'
import PropTypes from 'prop-types'

import './App.scss'

class App extends Component {
  constructor(props, context) {
    super(props)
  }

  render() {
    const { web3 } = this.context
    return (
      <FadeIn>
        <div className="AppWrapper">
          <Switch>
            <div>
              <Route exact path='/'
                render={() => <Orders address={web3.selectedAccount} network={web3.networkId} />}
              />
            </div>
          </Switch>
        </div>
      </FadeIn >
    )
  }
}

App.contextTypes = {
  web3: PropTypes.object
}

export default App
