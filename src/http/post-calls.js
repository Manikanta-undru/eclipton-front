import { makeAxiosGetRequest, makeAxiosPostRequest } from './http-service';

export const getTrendingHashtags = (params) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}get-trending-hashtags`,
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

export const getPostData = (params) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}getPostData`,
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

export const getSinglePost = (params) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}get-single-post`,
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

export const getUserInfo = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}getPostUserInfo`,
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

export const getNotifications = (params) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}get-notifications`,
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

export const setNotificationsViewed = (params) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}set-notifications-viewed`,
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

export const postSave = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}save-post`,
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

export const postUnSave = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}un-save-post`,
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

export const postHide = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}hide-post`,
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

export const postUnHide = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}un-hide-post`,
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

export const postHighlight = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}highlight-post`,
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

export const postUnHighlight = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}un-highlight-post`,
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

export const postRemove = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}remove-post`,
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

export const getFilteredPosts = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}filtered-posts`,
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

export const getFilteredNewsFeed = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}get-filtered-news-feed`,
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

export const getNewsFeed = (params, auth) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}get-news-feed`,
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
export const updatePost = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}update-post`,
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
