import agent from '../agent';
import {
  makeAxiosGetRequest,
  makeAxiosMultiPartRequest,
  makeAxiosPostRequest,
} from './http-service';

export const updateProfile = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosMultiPartRequest(
      `${process.env.REACT_APP_BASEURL}updateProfile`,
      true,
      data
    )
      .then((res) => {
        // localStorage.setItem('jwt', res.data.token);
        localStorage.setItem('currentUser', JSON.stringify(res.data.userinfo));
        agent.setToken(res.data.token);
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });

export const updateProfileExtras = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}update-profile-extras`,
      true,
      data
    )
      .then((res) => {
        if (data.type == 'general') {
          // localStorage.setItem('jwt', res.data.token);
          localStorage.setItem(
            'currentUser',
            JSON.stringify(res.data.userinfo)
          );
          agent.setToken(res.data.token);
        } else if (
          data.type == 'workplaces' ||
          data.types == 'current_cities'
        ) {
          let token = localStorage.getItem('currentUser');
          token = JSON.parse(token);
          token.city = res.data.city;
          token.job = res.data.job;
          localStorage.setItem('currentUser', JSON.stringify(token));
        }
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });

export const removeProfileExtras = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}remove-profile-extras`,
      true,
      data
    )
      .then((res) => {
        if (data.type == 'general') {
          // localStorage.setItem('jwt', res.data.token);
          localStorage.setItem(
            'currentUser',
            JSON.stringify(res.data.userinfo)
          );
          agent.setToken(res.data.token);
        } else if (
          data.type == 'workplaces' ||
          data.types == 'current_cities'
        ) {
          let token = localStorage.getItem('currentUser');
          token = JSON.parse(token);
          token.city = res.data.city;
          token.job = res.data.job;
          localStorage.setItem('currentUser', JSON.stringify(token));
        }
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });

export const getProfileExtras = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}get-profile-extras`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });

export const getGlobalProfileExtras = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}get-global-profile-extras`,
      true,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });

export const getGlobalProfile = (params) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}get-global-profile`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });

export const checkFriendRequest = (params) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}${'check-friend-request'}`,
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
