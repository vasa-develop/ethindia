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
  }

  render() {
    return (
      <FadeIn>
        <div className="AppWrapper">
          <Switch>
            <Route exact path='/'
              render={() => <Orders />}
            />
          </Switch>
        </div>
      </FadeIn >
    )
  }
}

export default App
