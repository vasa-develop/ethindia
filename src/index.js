import React from 'react'
import ReactDOM from 'react-dom'
import {
  HashRouter,
  Route,
  Switch
} from 'react-router-dom'
import { Web3Provider } from 'react-web3'
import { Provider } from 'react-redux'

import App from './App'
import { store } from './redux'

import './index.scss'

ReactDOM.render((
  <Provider store={store}>
    <Web3Provider>
      <HashRouter>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </HashRouter>
    </Web3Provider>
  </Provider>
), document.getElementById('root'))
