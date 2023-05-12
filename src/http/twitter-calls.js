import { makeAxiosGetRequest, makeAxiosPostRequest } from './http-service';

/**
 * twitter auth
 * @param {object} data oauthDevToken, oauthDevSecret
 */
export const twitterAuth = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(`${process.env.REACT_APP_BASEURL}twitter-auth`, false)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });

export const twitterConnectAuth = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}twitter-connect-auth`,
      true
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });

/**
 * callback
 * @param {object} params oauthDevToken, oauthDevSecret and oauthVerifier
 */
export const twitterCallback = (params) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}twitter-callback`,
      false,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });

/**
 * verify
 * @param {object} params oauthUsrToken, oauthUsrSecret
 */
export const twitterVerify = (params) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}twitter-verify`,
      false,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });

export const twitterConnectVerify = (params) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}twitter-connect-verify`,
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

/**
 * login
 * @param {object} data oauthUsrToken, oauthUsrSecret
 */

export const twitterLogin = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}twitter-login`,
      false,
      data
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });

export const twitterConnect = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}twitter-connect`,
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

/**
 * getFollowers
 * @param {object} data email and password
 */
export const getFollowers = (params, auth) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}twitter-followers`,
      auth,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });

/**
 * getFollowings
 * @param {object} data email and password
 */
export const getFollowings = (params, auth) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}twitter-followings`,
      auth,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });

export const getGlobalFollowers = (params) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}twitter-global-followers`,
      false,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });

/**
 * getFollowings
 * @param {object} data email and password
 */
export const getGlobalFollowings = (params) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}twitter-global-followings`,
      false,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });

/**
 * twitterSync
 * @param {object} data oauthUsrToken, oauthUsrSecret
 */
export const twitterSync = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}twitter-sync`,
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

/**
 * twitterSync
 * @param {object} data oauthUsrToken, oauthUsrSecret
 */
export const twitterSyncCheck = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}twitter-sync-check`,
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

/**
 * post
 * @param {object} data oauthUsrToken, oauthUsrSecret
 */
export const twitterTweet = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}twitter-tweet`,
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
