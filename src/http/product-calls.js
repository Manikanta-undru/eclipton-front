import {
  makeAxiosGetRequest,
  makeAxiosMultiPartRequest,
  makeAxiosPostRequest,
} from './http-service';

export const create = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product/create',
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

export const like = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product/like',
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

export const update = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product/update',
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

export const updateWithFile = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosMultiPartRequest(
      `${process.env.REACT_APP_BASEURL}product/updateWithFile`,
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

export const get = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product/get',
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

export const topTrendingProduct = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product/topTrendingProduct',
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

export const getWishlist = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product/getWishlist',
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

export const getUser = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product/getUser',
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
      `${process.env.REACT_APP_BASEURL}` + 'product/getAll',
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

export const getAllProduct = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product/getAllProduct',
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

export const getLocation = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product/getLocation',
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

export const getSearchData = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product/getSearchData',
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

export const updateStatus = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product/updateStatus',
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

export const updateStock = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product/updateStock',
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

export const shareProduct = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product/shareProduct',
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

export const updateRating = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product/updateRating',
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
      `${process.env.REACT_APP_BASEURL}` + 'product/getCount',
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

export const remove = (data) =>
  new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      `${process.env.REACT_APP_BASEURL}` + 'product/remove',
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
