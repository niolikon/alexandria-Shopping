import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'reactstrap/dist/reactstrap.min';
import "@fortawesome/fontawesome-free/css/all.css";
import "@fontsource/roboto";
import 'bootstrap-social/bootstrap-social.css';
import './index.css';
import App from './App';
import store from './app/commons/redux/reduxStore';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import theme from './theme';
import { ThemeProvider } from '@material-ui/core';

ReactDOM.render(
  <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
