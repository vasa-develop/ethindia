import React, { Component } from 'react'
import FadeIn from 'react-fade-in'

import {
  Route,
  Switch
} from 'react-router-dom'

import Orders from './components/Orders/Orders'

import './App.scss'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: {},
    }

    this.startSyncing = this.startSyncing.bind(this)
    setInterval(this.startSyncing, 1000)
  }

  async startSyncing() {
    const { web3 } = window
    if (!web3) return
    const address = await new Promise((resolve, reject) => {
      window.web3.eth.getAccounts((err, result) => {
        if (err) reject(err)
        else resolve(result[0])
      })
    })
    const network = await new Promise((resolve, reject) => {
      window.web3.version.getNetwork((err, result) => {
        if (err) reject(err)
        else resolve(Number(result))
      })
    })
    this.setState({
      web3: { address, network }
    })
  }

  render() {
    const { web3 } = this.state

    return (
      <FadeIn>
        <div className="AppWrapper">
          <Switch>
            {
              web3.network > 0 ?
              <Route exact path='/'
                render={() => <Orders address={web3.address} network={web3.network} />}
              />
              :
              <div>No Metamask Detected</div>
            }
          </Switch>
        </div>
      </FadeIn >
    )
  }
}

export default App
