import axios from 'axios';
import { getToken } from './token-interceptor';

const structureQueryParams = (params) => {
  let queryStrings = '?';
  const keys = Object.keys(params);
  keys.forEach((key, index) => {
    queryStrings += `${key}=${params[key]}&`;
  });
  return queryStrings.trim('&');
};

const setHeaders = () => {
  const headers = {};
  // const authToken = getWalletToken();
  const authToken = getToken();
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  return headers;
};

export const handleErrorIfAvailable = (httpResponse) => {
  switch (httpResponse.status) {
    case 401: {
      localStorage.clear();
      window.location.href = '/login';
      break;
    }
    default: {
      /* empty */
    }
  }
};

export const makeAxiosGetRequest = async (
  url,
  attachToken = false,
  params = null,
  host = false
) => {
  let queryString = '';
  if (params) {
    queryString = structureQueryParams(params);
  }
  let headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };
  if (host) {
    headers.Host = 'eclipton.com';
  }
  if (attachToken) {
    headers = { ...headers, ...setHeaders() };
  }
  return new Promise((resolve, reject) => {
    axios
      .get(url + queryString, { headers })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        handleErrorIfAvailable(e.response);
        reject(e);
      });
  });
};

export const makeAxiosPostRequest = async (
  url,
  attachToken = false,
  params = {},
  host = false
) => {
  let headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };
  if (host) {
    headers.Host = 'eclipton.com';
  }
  if (attachToken) {
    headers = { ...headers, ...setHeaders() };
  }
  return new Promise((resolve, reject) => {
    axios
      .post(url, params, { headers })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        handleErrorIfAvailable(e.response);
        reject(e);
      });
  });
};

export const makeAxiosPutRequest = async (
  url,
  attachToken = false,
  params = {},
  host = false
) => {
  let headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };
  if (host) {
    headers.Host = 'eclipton.com';
  }
  if (attachToken) {
    headers = { ...headers, ...setHeaders() };
  }
  return new Promise((resolve, reject) => {
    axios
      .put(url, params, { headers })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        handleErrorIfAvailable(e.response);
        reject(e);
      });
  });
};

export const setCSRFRequest = async (url) => {
  axios
    .get(url) // Send get request to get CSRF token once site is visited.
    .then((res) => {
      axios.defaults.headers.post['X-XSRF-TOKEN'] = res.data._csrf; // Set it in header for the rest of the axios requests.
    });
  // return axios.put(url, params, { headers: headers });
};

export const makeAxiosMultiPartRequest = async (
  url,
  attachToken = false,
  params = {},
  host = false
) => {
  let headers = {
    'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Origin': '*',
  };
  if (host) {
    headers.Host = 'eclipton.com';
  }
  if (attachToken) {
    headers = { ...headers, ...setHeaders() };
  }
  const form_data = new FormData();
  for (const key in params) {
    const value = params[key];
    if (Array.isArray(value)) {
      const arrayKey = `${key}[]`;
      value.forEach((v) => {
        form_data.append(arrayKey, v);
      });
    } else {
      form_data.append(key, value);
    }
  }
  return new Promise((resolve, reject) => {
    axios
      .post(url, form_data, { headers })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        handleErrorIfAvailable(e.response);
        reject(e);
      });
  });
};
