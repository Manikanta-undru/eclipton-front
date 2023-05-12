import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './reducers/auth';
import common from './reducers/common';
import home from './reducers/home';
import profile from './reducers/profile';
import settings from './reducers/settings';
import socket from './reducers/socket';
import kyc from './reducers/kyc';

export default combineReducers({
  auth,
  common,
  home,
  profile,
  settings,
  router: routerReducer,
  socket,
  kyc,
});
