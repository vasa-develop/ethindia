import React from 'react'
import ReactDOM from 'react-dom'
import {
  HashRouter,
  Route,
  Switch
} from 'react-router-dom'
import { Web3Provider } from 'react-web3'
import { Provider } from 'react-redux'
// import { Lendroid } from 'lendroid'

import App from './App'

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.scss'

// const lib = new Lendroid({})
// console.log(lib)

ReactDOM.render((
  <Provider>
    <Web3Provider>
      <HashRouter>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </HashRouter>
    </Web3Provider>
    {/* <App /> */}
  </Provider>
), document.getElementById('root'))
