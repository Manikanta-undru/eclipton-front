import {
  makeAxiosGetRequest,
  makeAxiosMultiPartRequest,
  makeAxiosPostRequest,
} from './http-service';

export const create = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosMultiPartRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product_review/create',
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

export const getAll = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product_review/getAll',
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

export const getAllReviews = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product_review/getAllReviews',
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

export const reviewReply = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product_review/reviewReply',
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

export const getCount = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product_review/getCount',
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

export const removeReview = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product_review/remove',
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
