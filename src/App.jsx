import React, { Component } from 'react'
import FadeIn from 'react-fade-in'

import TableGroup from './components/TableGroup/TableGroup'
import Table from './components/Table/Table'
import FormTab from './components/FormTab/FormTab'
import Header from './components/Header/Header'

import Tables from './assets/Tables'

import 'react-tabs/style/react-tabs.scss'
import './App.scss'

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <FadeIn>
        <div className="AppWrapper">
          <Header />
          <TableGroup data={{left: Tables[0], right: Tables[1], classes: "first"}}/>
          <FormTab />
          <TableGroup data={{left: Tables[2], right: Tables[3]}} style={{ marginBottom: 29 }} />
          <TableGroup data={{left: Tables[4], right: Tables[5]}} />
        </div>
      </FadeIn >
    )
  }
}

export default App
