import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { routerMiddleware } from 'react-router-redux';
import {
  promiseMiddleware,
  localStorageMiddleware,
  socketMiddleware,
} from './middleware';
import reducer from './reducer';

// import createHistory from 'history/createBrowserHistory';

// export const history = createHistory();
export const history = require('history').createBrowserHistory();
export const histor2y = require('history').createBrowserHistory();

// Build the middleware for intercepting and dispatching navigation actions
const myRouterMiddleware = routerMiddleware(history);

const getMiddleware = () => {
  if (process.env.NODE_ENV === 'production') {
    return applyMiddleware(
      myRouterMiddleware,
      promiseMiddleware,
      localStorageMiddleware,
      socketMiddleware
    );
  }
  // Enable additional logging in non-production environments.
  return applyMiddleware(
    myRouterMiddleware,
    promiseMiddleware,
    localStorageMiddleware,
    createLogger(),
    socketMiddleware
  );
};

export const store = createStore(reducer, composeWithDevTools(getMiddleware()));
