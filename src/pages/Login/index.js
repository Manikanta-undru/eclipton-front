import { detect } from 'detect-browser';
import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { alertBox, switchLoader } from '../../commonRedux';
import FrontPageFooter from '../../components/FrontPageFooter';
import { GetAssetImage } from '../../globalFunctions';
import {
  verifyEmail,
  getUser,
  googlerecaptchavalid,
} from '../../http/http-calls';
import { facebookAuth, googleAuth } from '../../http/oauth-calls';
import {
  signIn,
  federatedSignIn,
  getCognitoCurrentUser,
} from '../../auth/cognitoAuth';
import Spinner from '../../components/Spinner';

require('./styles.scss');

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      glogged: null,
      pwdtype: 'password',
      errors: {},
      browser: null,
      isLoading: false,
      isgooglecaptcha: (process.env.REACT_APP_RECAPTCHA === 'true') != true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

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
              // need to check the email id is there in the database or not if there then need to display the error message
              const data = {
                id: userData.identities[0].userId,
                userid: userData.sub,
                name: userData.name,
                avatar: userData.picture,
                email: userData.email,
                // browser: this.state.browser
              };
              if (userData.identities && userData.identities[0]) {
                if (userData.identities[0].providerName == 'Facebook') {
                  facebookAuth(data).then(
                    (resp) => {
                      localStorage.setItem('jwt', accessToken);
                      this.nextOrHome(resp.userinfo);
                    },
                    (err) => {
                      alertBox(true, err.data.message);
                    }
                  );
                } else {
                  googleAuth(data).then(
                    (resp) => {
                      localStorage.setItem('jwt', accessToken);
                      this.nextOrHome(resp.userinfo);
                    },
                    (err) => {
                      alertBox(true, err.data.message);
                    }
                  );
                }
              }
            } catch (error) {
              console.log(error);
              // switchLoader();
              // alertBox(true, "Error getting data from google");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }

    // useGoogleLogout();
    const browser = detect();
    this.setState({
      browser,
    });
    // localStorage.clear();
    if (this.props.match.params.emailToken) {
      switchLoader(true, 'Please wait, Activating your email');
      verifyEmail({ str: this.props.match.params.emailToken }).then(
        async (resp) => {
          switchLoader();
          alertBox(true, resp.message, 'success');
        },
        (error) => {
          alertBox(true, error.data.message);
          switchLoader();
        }
      );
    }
    console.log(
      process.env.REACT_APP_RECAPTCHAKEY_SITEKEY,
      process.env.REACT_APP_RECAPTCHA
    );
  }

  handleSuccess = (data) => {
    // this.setState({
    //   code: data.code,
    //   errorMessage: '',
    // });
  };

  handleFailure = (error) => {
    console.log(error);
    // this.setState({
    //   code: '',
    //   errorMessage: error.errorMessage,
    // });
  };

  handleChange = (evt) => {
    const { name, value } = evt.target;
    this.setState({ [name]: value }, () => {});
  };

  authHandler = (err, data) => {
    //
    this.setState({ isLoading: true });
    setTimeout(function () {
      this.setState({ isLoading: false });
    }, 2000);
  };

  startAuth = () => {
    this.props.history.push('/twitter-login');
  };

  handleValidation() {
    const fields = this.state;
    let formIsValid = true;
    const errors = {};

    if (!fields.email) {
      formIsValid = false;
      errors.email = 'Cannot be empty';
    }

    if (typeof fields.email !== 'undefined' && fields.email) {
      const lastAtPos = fields.email.lastIndexOf('@');
      const lastDotPos = fields.email.lastIndexOf('.');
      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          fields.email.indexOf('@@') == -1 &&
          lastDotPos > 2 &&
          fields.email.length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors.email = 'Email is not valid';
        alertBox(true, 'Email is not valid');
      }
    }

    if (!fields.password) {
      formIsValid = false;
      errors.password = 'Cannot be empty';
    }

    this.setState({ errors });
    return formIsValid;
  }

  nextOrHome = (resp) => {
    // localStorage.clear();
    localStorage.setItem('currentUser', JSON.stringify(resp));
    // localStorage.setItem('jwt', resp.signInUserSession.accessToken.jwtToken);
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

  submitForm = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      // let obj = {
      //   email: this.state.email,
      //   password: this.state.password,
      //   browser: this.state.browser,
      //   authflag: true
      // };
      if (this.state.isgooglecaptcha == false) {
        alertBox(true, 'Please verify the recaptcha');
      } else {
        this.setState({ isLoading: true });
        signIn(this.state.email, this.state.password)
          .then((data) => {
            //
            localStorage.setItem(
              'jwt',
              data.signInUserSession.accessToken.jwtToken
            );
            const obj = {
              userid: data.username,
              //   password: this.state.password,
              browser: this.state.browser,
              authflag: true,
            };
            getUser(obj).then(
              async (resp) => {
                //
                this.setState({ isLoading: false });
                this.nextOrHome(resp);
              },
              (error) => {
                const msg = error.data.message;

                alertBox(true, msg);

                this.setState({ isLoading: false });
              }
            );

            // switchLoader();
            // this.nextOrHome(data);
          })
          .catch((error) => {
            this.setState({ isLoading: false });
            const alert =
              error && error.message
                ? typeof error.message === 'object'
                  ? Object.values(error.message).join(',')
                  : error.message
                : '';
            alertBox(true, alert);
          });
        // login(obj)
        //   .then(async resp => {
        //     switchLoader();
        //     this.nextOrHome(resp);
        //   }, error => {
        //     var msg = error.data.message;
        //     if(msg == 'email_unverified'){
        //       msg = 'Email is not verified yet. Please check your inbox or spam folder.';
        //       alertBox(true, msg);
        //     }else if(msg == 'phone_unverified'){
        //       if(error.data.phone == undefined || error.data.phone == null || error.data.phone == '' ){
        //         localStorage.setItem("vid", error.data.id);
        //         localStorage.setItem("loginredirect", 'true');
        //         localStorage.setItem("addphone", 'true');
        //         this.props.history.push("/verify-phone");
        //       }else{
        //         msg = 'Phone is not verified yet.';
        //         localStorage.setItem("vid", error.data.id);
        //         localStorage.setItem("loginredirect", 'true');
        //         this.props.history.push("/verify-phone");
        //         alertBox(true, error == undefined ? '' : msg);
        //       }
        //     }else{
        //       alertBox(true, msg);
        //     }

        //     switchLoader();
        //   });
      }
    } else {
      /* empty */
    }
  };

  responseGoogle = (res) => {
    try {
      switchLoader(true, 'Logging in...');
      const data = {
        id: res.profileObj.googleId,
        name: res.profileObj.name,
        avatar: res.profileObj.imageUrl,
        email: res.profileObj.email,
        browser: this.state.browser,
      };
      googleAuth(data).then(
        (resp) => {
          switchLoader();
          // if(resp.status != undefined && resp.status != null && resp.status == 'new'){
          //   localStorage.setItem("vid", resp.userinfo._id);
          //   localStorage.setItem("loginredirect", 'true');
          //   localStorage.setItem("addphone", 'true');
          //   this.props.history.push("/verify-phone");
          // }
          // else if(resp.status != undefined && resp.status != null && resp.status == 'unverified'){
          //   if(resp.phone == undefined || resp.phone == null || resp.phone == '' || resp.phone.indexOf("+") == -1){
          //     localStorage.setItem("vid", resp.id);
          //     localStorage.setItem("loginredirect", 'true');
          //     localStorage.setItem("addphone", 'true');
          //     this.props.history.push("/verify-phone");
          //   }else{
          //     localStorage.setItem("vid", resp.id);
          //     localStorage.setItem("loginredirect", 'true');
          //     this.props.history.push("/verify-phone");
          //   }
          // }else{

          this.nextOrHome(resp);
          // }
        },
        (err) => {
          switchLoader();
          alertBox(true, err.data.message);
        }
      );
    } catch (error) {
      switchLoader();
      alertBox(true, 'Error getting data from google');
    }
  };

  responseFacebook = (res) => {
    try {
      switchLoader(true, 'Logging in...');
      const data = {
        id: res.id,
        name: res.name,
        avatar:
          res.picture.data != undefined && res.picture.data.url != undefined
            ? res.picture.data.url
            : '',
        email: res.email,
        browser: this.state.browser,
      };
      facebookAuth(data).then(
        (resp) => {
          switchLoader();
          // if(resp.status != undefined && resp.status != null && resp.status == 'new'){
          //   localStorage.setItem("vid", resp.userinfo._id);
          //   localStorage.setItem("loginredirect", 'true');
          //   localStorage.setItem("addphone", 'true');
          //   this.props.history.push("/verify-phone");
          // }
          // else if(resp.status != undefined && resp.status != null && resp.status == 'unverified'){
          //   if(resp.phone == undefined || resp.phone == null || resp.phone == '' || resp.phone.indexOf("+") == -1){
          //     localStorage.setItem("vid", resp.id);
          //     localStorage.setItem("loginredirect", 'true');
          //     localStorage.setItem("addphone", 'true');
          //     this.props.history.push("/verify-phone");
          //   }else{
          //     localStorage.setItem("vid", resp.id);
          //     localStorage.setItem("loginredirect", 'true');
          //     this.props.history.push("/verify-phone");
          //   }

          // }
          // else{

          this.nextOrHome(resp);
          // }
        },
        (err) => {
          switchLoader();
          alertBox(true, err.data.message);
        }
      );
    } catch (error) {
      switchLoader();
      alertBox(true, 'Error getting data from facebook');
    }
  };

  gonChange = (value) => {
    console.log('Captcha value:', value);
    // send to backend check
    googlerecaptchavalid({ ctoken: value }).then(async (resp) => {
      try {
        console.log(resp, 'resp');
        if (resp.status == true) {
          this.setState({ isgooglecaptcha: true });
        } else {
          this.setState({ isgooglecaptcha: false });
        }
      } catch (e) {
        alertBox(true, e);
      }
    });
  };

  setLocal = () => {
    localStorage.setItem('glogged', 'true');
  };

  render() {
    const { email, name, phone, password, cPassword, pwdtype, isLoading } =
      this.state;

    const { search } = this.props.location;
    const token = new URLSearchParams(search).get('accesstoken');
    return (
      <div className="newLogin">
        <div className="container-fluid newLogin_container">
          <div className="row">
            <div className="col-md-6 ">
              <div className="newLogin_left">
                <img
                  src={GetAssetImage('newlogin-img1.png')}
                  className="img-fluid newloginimg"
                />
                <img
                  src={GetAssetImage('login-logo.svg')}
                  className="newLogo"
                />
                <h1>
                  Social Media Platform with Trusted
                  <br /> Cryptocurrency Exchange
                </h1>

                <div
                  className="d-none d-sm-block position-relative col-12  "
                  style={{ bottom: '-100px' }}
                >
                  <FrontPageFooter />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="newLogin_right">
                <div className="newLogin_right_box">
                  <h2>Login</h2>
                  <h6 className="pb-4">
                    Hey, Enter your details to Sign in to your account
                  </h6>
                  <form
                    className="newLogin_right_form"
                    action=""
                    method="post"
                    onSubmit={this.submitForm}
                  >
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Username/Email</label>
                      <input
                        type="email"
                        required
                        className="form-control"
                        name="email"
                        value={email}
                        onChange={(e) => this.handleChange(e)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputPassword1">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => this.handleChange(e)}
                      />
                    </div>
                    {process.env.REACT_APP_RECAPTCHA === 'true' ? (
                      <ReCAPTCHA
                        className="reCaptcha"
                        sitekey={process.env.REACT_APP_RECAPTCHAKEY_SITEKEY}
                        onChange={(e) => this.gonChange(e)}
                      />
                    ) : null}

                    <div className="forgetPas">
                      <a href="/forgotpassword">Forgot password?</a>
                    </div>

                    <button
                      type="submit"
                      className={`login_Btn ${isLoading ? 'loading' : ''}`}
                      disabled={this.props.inProgress}
                    >
                      Login
                      {isLoading && (
                        <div className="loader-spinner">
                          <Spinner
                            className="spinner-xxs-white"
                            style={{ width: '15px', height: '15px' }}
                          />
                        </div>
                      )}
                    </button>
                    <p className="signwith_text mt-3">
                      Or Sign in with
                      <span className="socialBt ps-3">
                        <a
                          onClick={() => {
                            federatedSignIn('Google');
                          }}
                        >
                          <i className="fa fa-google" /> Google
                        </a>
                        <a
                          onClick={() => {
                            federatedSignIn('Facebook');
                          }}
                        >
                          <i className="fa fa-facebook" /> Facebook
                        </a>
                      </span>
                    </p>
                    <span className="dontText ">
                      {` Don't have an account?`}
                      <a href="/register/new">Sign up Now</a>
                    </span>
                  </form>
                  <div
                    className="d-block d-sm-none  col-12  "
                    style={{ marginLeft: '-25px' }}
                  >
                    <FrontPageFooter />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
