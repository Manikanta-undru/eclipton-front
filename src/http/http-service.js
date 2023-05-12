import axios from 'axios';
import { getToken, getCurrentUser } from './token-interceptor';

const structureQueryParams = (params) => {
  let queryStrings = '?';
  const keys = Object.keys(params);
  keys.forEach((key, index) => {
    queryStrings += `${key}=${params[key]}&`;
    /* if(params[keys[index + 1]]) {
            queryStrings += "&";
        } */
  });
  return queryStrings.trim('&');
};
const setHeaders = () => {
  const headers = {};
  const authToken = getToken();
  /* csrfToken = getCSRF();
    if(csrfToken){
        headers["XSRF-TOKEN"] = csrfToken;
    }  */
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;

    const currantUser = getCurrentUser();
    console.log(currantUser, 'test');
    if (currantUser) {
      headers.currantUser = currantUser;
    }

    // headers["x-access-token"] = authToken;
  }
  return headers;
};
const setTwitterHeaders = () => {
  const headers = {};
  const authToken =
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJTYXRoaXNoIiwiaWQiOjF9.bWdOVm-F1WRqQ6PFQhxAnhKbbluKrBSua24WZAFcvc-9XeYsFkeGJGtT_yOO4hpB_b0X5Tf3EE-rHNj3wMFxIw';
  if (authToken) {
    headers.Authorization = `Token ${authToken}`;
  }
  return headers;
};
export const handleErrorIfAvailable = (httpResponse) => {
  if (httpResponse?.status) {
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
  }
};

export const makeAxiosGetRequest = async (
  url,
  attachToken = false,
  params = null,
  twitterToken = false
) => {
  let queryString = '';
  if (params) {
    queryString = structureQueryParams(params);
  }
  let headers = { 'Content-Type': 'application/json' };
  if (twitterToken) {
    headers = { ...headers, ...setTwitterHeaders() };
  } else if (attachToken) {
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
  twitterToken = false
) => {
  let headers = {
    'Content-Type': 'application/json',
  };
  if (twitterToken) {
    headers = { ...headers, ...setTwitterHeaders() };
  } else if (attachToken) {
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
  params = {}
) => {
  let headers = {
    'Content-Type': 'application/json',
  };
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
  twitterToken = false
) => {
  let headers = {
    'Content-Type': 'multipart/form-data',
  };
  if (twitterToken) {
    headers = { ...headers, ...setTwitterHeaders() };
  } else if (attachToken) {
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
