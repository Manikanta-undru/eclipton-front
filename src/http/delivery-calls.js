import { makeAxiosGetRequest, makeAxiosPostRequest } from './http-service';

export const getDelivery = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}` + 'delivery/get',
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

export const createDelivery = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}` + 'delivery/create',
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

export const updateDelivery = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}` + 'delivery/update',
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
