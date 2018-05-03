import React, { Component } from 'react'
import axios from 'axios'
import FadeIn from 'react-fade-in'
import PropTypes from 'prop-types'

import TableGroup from './components/TableGroup/TableGroup'
import Table from './components/Table/Table'
import FormTab from './components/FormTab/FormTab'
import Header from './components/Header/Header'

import Tables from './assets/Tables'
import API from './assets/API'

import 'react-tabs/style/react-tabs.scss'
import './App.scss'

class App extends Component {
  constructor(props, context) {
    super(props)
  }

  componentDidMount() {
    this.apiGet('offers', (result) => {
      this.setState({
        offers: result.offers || []
      })
    })
  }

  apiGet(endPoint, cb = null) {
    let url = API.baseURL
    url += API.endPoints[endPoint]

    axios.get(url)
      .then(res => {
        const result = res.data
        if (cb) cb(result)
      })
  }

  apiPost(endPoint, data, cb = null) {
    let url = API.baseURL
    url += API.endPoints[endPoint]

    axios.post(url, data)
      .then(res => {
        const result = res.data
        if (cb) cb(result)
      })
  }

  render() {
    const { web3 } = this.context
    const methods = { apiGet: this.apiGet, apiPost: this.apiPost }

    return (
      <FadeIn>
        <div className="AppWrapper">
          <Header address={web3.selectedAccount} />
          <TableGroup data={{ left: Tables[0], right: Tables[1], classes: "first" }} />
          <FormTab methods={methods} address={web3.selectedAccount} />
          <TableGroup data={{ left: Tables[2], right: Tables[3] }} style={{ marginBottom: 29 }} />
          <TableGroup data={{ left: Tables[4], right: Tables[5] }} />
        </div>
      </FadeIn >
    )
  }
}

App.contextTypes = {
  web3: PropTypes.object
};

export default App
