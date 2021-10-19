import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {store} from './redux/store'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { GlobalStyle } from './style'

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);