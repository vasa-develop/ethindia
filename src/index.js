import React from 'react'
import ReactDOM from 'react-dom'
import {
  HashRouter,
  Route,
  Switch
} from 'react-router-dom'
import { Web3Provider } from 'react-web3'

import App from './App'

import './index.scss'

ReactDOM.render((
  <div>
    <Web3Provider>
      <HashRouter>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </HashRouter>
    </Web3Provider>
  </div>
), document.getElementById('root'))
