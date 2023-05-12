import Amplify, { Auth } from 'aws-amplify';
// import {CustomChromeStorage} from '../utils/customChromeStorage'
Amplify.configure({
  Auth: {
    userPoolId: process.env.REACT_APP_USERPOOL,
    userPoolWebClientId: process.env.REACT_APP_CLIENTID,
    region: process.env.REACT_APP_REGION,
    oauth: {
      domain: process.env.REACT_APP_USERPOOLURI,
      scope: ['openid', 'email', 'profile'],
      redirectSignIn: process.env.REACT_APP_CALLBACKURI,
      redirectSignOut: process.env.REACT_APP_SIGNOUTURI,
      responseType: process.env.REACT_APP_RESPONSETYPE,
    },
    // storage: CustomChromeStorage
  },
});

async function signUp(email, password, attributes) {
  return await Auth.signUp({
    username: email,
    password,
    attributes,
  });
}

async function signIn(email, password) {
  return await Auth.signIn(email, password);
}

async function confirmSignUp(email, code) {
  return await Auth.confirmSignUp(email, code);
}

async function Csession() {
  const sessionData = await Auth.currentSession();
  if (sessionData.accessToken.jwtToken != localStorage.getItem('jwt')) {
    localStorage.setItem('jwt', sessionData.accessToken.jwtToken);
  }
  return sessionData;
}

async function resendConfirmationCode(username) {
  return await Auth.resendSignUp(username);
}

// pass in true to sign out from all devices
async function signOut(global = false) {
  // return await Auth.signOut({ global });

  return new Promise((resolve, reject) => {
    Auth.signOut({ global })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject(Error('Not signed in.'));
      });
  });
}

async function federatedSignIn(provider) {
  return await Auth.federatedSignIn({ provider });
}

async function forgotPassword(email) {
  return await Auth.forgotPassword(email);
}

async function forgotPasswordSubmit(email, code, newPassword) {
  // eslint-disable-next-line no-useless-catch
  try {
    await Auth.forgotPasswordSubmit(email, code, newPassword);
    return 'Password was changed successfully.';
  } catch (err) {
    throw err;
  }
}

async function changePassword(oldPassword, newPassword) {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await Auth.currentAuthenticatedUser();
    await Auth.changePassword(user, oldPassword, newPassword);
    return 'Password was changed successfully.';
  } catch (err) {
    throw err;
  }
}

function getIdToken() {
  return new Promise((resolve, reject) => {
    Auth.currentSession()
      .then((data) => {
        const idToken = data.getIdToken();
        resolve(idToken.jwtToken);
      })
      .catch(() => {
        reject(Error('Not signed in.'));
      });
  });
}

function getCognitoCurrentUser() {
  return new Promise((resolve, reject) => {
    Auth.currentSession()
      .then((data) => {
        const idToken = data.getIdToken();
        const user = idToken.payload;

        resolve(user);
      })
      .catch(() => {
        reject(Error('Not signed in.'));
      });
  });
}

function getCurrantSession() {
  return new Promise((resolve, reject) => {
    Auth.currentSession()
      .then((data) => {
        const idToken = data.getIdToken();
        const user = idToken.payload;

        resolve(idToken.jwtToken);
      })
      .catch(() => {
        reject(Error('Not signed in.'));
      });
  });
}

export {
  signUp,
  signIn,
  confirmSignUp,
  resendConfirmationCode,
  signOut,
  federatedSignIn,
  forgotPassword,
  forgotPasswordSubmit,
  getIdToken,
  changePassword,
  getCognitoCurrentUser,
  getCurrantSession,
  Csession,
};
