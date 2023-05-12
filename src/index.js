import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { store, history } from './store';
import App from './App';
import * as serviceWorker from './serviceWorker';

require('./assets/css/style.scss');
require('./assets/css/button.scss');
require('./assets/css/responsive.scss');

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      {/* <React.StrictMode> */}
      {/* <React.Fragment > */}
      {/* <Router> */}
      <App />
      {/* </Router> */}
      {/* </React.Fragment> */}
      {/* </React.StrictMode> */}
    </ConnectedRouter>
  </Provider>,

  document.getElementById('root')
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
