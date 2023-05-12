import { Csession } from '../auth/cognitoAuth';

export const getToken = () => {
  let token = null;
  if (localStorage.jwt) {
    token = localStorage.jwt;
  }
  return token;
};

export const getSessionToken = () => {
  let token = null;
  try {
    const data = Csession();
    if (data && data.accessToken) {
      token = data.accessToken.jwtToken;
    }
  } catch (error) {
    localStorage.clear();
    window.location.href = '/login';
  }
  return token;
};

export const getWalletToken = () => {
  let token = null;
  if (localStorage.walletToken) {
    token = localStorage.walletToken;
  }
  return token;
};

export const getCurrentUser = () => {
  let user = null;
  if (localStorage.currentUser) {
    user = localStorage.currentUser;
  }
  return user;
};

export const getCSRF = () => {
  let token = null;
  if (localStorage.csrf) {
    token = localStorage.csrf;
  }
  return token;
};
