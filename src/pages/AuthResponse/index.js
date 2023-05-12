import React from 'react';
import { googleAuth } from '../../http/oauth-calls';
import { getCognitoCurrentUser } from '../../auth/cognitoAuth';

class AuthResponse extends React.Component {
  constructor(props) {
    super(props);
  }

  nextOrHome = (resp) => {
    localStorage.setItem('currentUser', JSON.stringify(resp));
    // localStorage.setItem('walletToken', resp.walletToken);
    try {
      let path = this.props.location.search;
      if (path.indexOf('?next=') != -1) {
        path = path.replace('?next=', '');
        if (path.indexOf('trade/') != -1) {
          // window.location.href = process.env.REACT_APP_TRADEBASE + path + "?token=" + resp.walletToken;
        } else {
          window.location.href = path;
        }
      } else {
        window.location.href = '/home';
      }
    } catch (error) {
      window.location.href = '/home';
    }
  };

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.hash);
    const values = [...params.entries()];
    if (values && values.length > 0) {
      if (values[0][0] == '#access_token') {
        const accessToken = values[0][1];
        getCognitoCurrentUser()
          .then((userData) => {
            try {
              // switchLoader(true, "Logging in...");
              const data = {
                id: userData.identities[0].userId,
                userid: userData.sub,
                name: userData.name,
                avatar: userData.picture,
                email: userData.email,
                // browser: this.state.browser
              };
              googleAuth(data).then(
                (resp) => {
                  localStorage.setItem('jwt', accessToken);
                  this.nextOrHome(resp.userinfo);
                },
                (err) => {
                  window.location.href = '/login';
                }
              );
            } catch (error) {
              window.location.href = '/login';
              // switchLoader();
              // alertBox(true, "Error getting data from google");
            }
          })
          .catch((err) => {
            console.log(err);
            window.location.href = '/login';
          });
      }
    }
  }

  render() {
    return null;
  }
}
export default AuthResponse;
