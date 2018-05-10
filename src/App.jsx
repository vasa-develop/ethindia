import React, { Component } from 'react'
import axios from 'axios'
import FadeIn from 'react-fade-in'

import {
  Route,
  Link,
  Redirect,
  Switch
} from 'react-router-dom'

import Orders from './components/Orders/Orders'

import './App.scss'

class App extends Component {
  constructor(props, context) {
    super(props)
  }

  render() {
    return (
      <FadeIn>
        <div className="AppWrapper">
          <Switch>
            <div>
              <Route exact path='/' component={Orders} />
            </div>
          </Switch>
        </div>
      </FadeIn >
    )
  }
}

export default App
