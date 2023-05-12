import { detect } from 'detect-browser';
import React from 'react';
import Select from 'react-dropdown-select';
import { alertBox, switchLoader } from '../../commonRedux';
import A from '../../components/A';
import FrontPageFooter from '../../components/FrontPageFooter';
import { GetAssetImage } from '../../globalFunctions';
import { updatePhone } from '../../http/http-calls';
import {
  twitterAuth,
  twitterCallback,
  twitterLogin,
  twitterVerify,
} from '../../http/twitter-calls';

const ccodes = require('../Register/ccodes.json');
require('../Login/styles.scss');

class TwitterLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      browser: null,
      values: [],
      password: '',
      countryCode: '',
      phone: '',
      pwdtype: 'password',
      step: 0,
      userid: 0,
      error: '',
      errors: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    const browser = detect();
    this.setState({
      browser,
    });
    // const query = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    const { search } = this.props.location; // could be '?foo=bar'
    const param = new URLSearchParams(search);
    const denied = param.get('denied');
    if (denied != null && denied != undefined && denied != '') {
      window.location.href = process.env.REACT_APP_FRONTEND;
    } else {
      const query = {
        oauth_token: param.get('oauth_token'),
        oauth_verifier: param.get('oauth_verifier'),
      };
      // query = query.replace("?", "");
      // var tmp1 = query.split("&");

      // const oAuth = localStorage.getItem("oauthUsrToken");
      // const oAuthSecret = localStorage.getItem("oauthUsrSecret");
      const devToken = localStorage.getItem('oauthDevToken');
      switchLoader(true, 'Authentication in progress, please wait...');

      if (
        query.oauth_token != undefined &&
        query.oauth_token != null &&
        devToken != undefined &&
        devToken != null &&
        query.oauth_token == devToken
      ) {
        this.callback(query);
      }
      // else if (oAuth != undefined && oAuth != null) {
      //   this.verify(oAuth, oAuthSecret);
      // }
      else {
        this.startAuth();
      }
    }
  }

  startAuth = () => {
    twitterAuth().then(
      async (res) => {
        if (res.redirectUrl) {
          switchLoader();
          localStorage.setItem('oauthDevToken', res.oauthToken);
          localStorage.setItem('oauthDevSecret', res.oauthSecret);
          window.location.href = res.redirectUrl;
        }
      },
      (error) => {
        switchLoader();
        this.setState({
          step: -1,
        });
      }
    );
  };

  updateInfo = () => {
    switchLoader(true, 'Sending OTP, please wait...');
    const data = {
      ccode: this.state.countryCode,
      phone: this.state.phone,
      id: this.state.userid,
      token: this.state.token,
      secret: this.state.secret,
    };
    updatePhone(data).then(
      async (res) => {
        if (res.id != undefined && res.id != null) {
          switchLoader();
          localStorage.setItem('vid', this.state.userid);
          this.props.history.push('/verify-phone');
        }
      },
      (error) => {
        switchLoader();
        alertBox(true, error.data.message);
      }
    );
  };

  callback = (query) => {
    const obj = {
      oauthToken: localStorage.getItem('oauthDevToken'),
      oauthSecret: localStorage.getItem('oauthDevSecret'),
      oauthVerifier: query.oauth_verifier,
    };
    twitterCallback(obj).then(
      async (res) => {
        if (res.oauthToken) {
          // localStorage.setItem("oauthUsrToken", res.oauthToken);
          // localStorage.setItem("oauthUsrSecret", res.oauthSecret);
          this.verify(res.oauthToken, res.oauthSecret);
        } else {
          switchLoader();
          this.setState({
            step: -1,
          });
        }
      },
      (error) => {
        switchLoader();
        this.setState({
          step: -1,
        });
      }
    );
  };

  verify = (token, secret) => {
    const obj = {
      oauthToken: token,
      oauthSecret: secret,
    };
    twitterVerify(obj).then(
      async (res) => {
        // if(res.verifyFailed){
        //   switchLoader();
        //   this.startAuth();
        // }else
        switchLoader();
        // if(res.status == 'new'){
        //   this.setState({
        //     step: 1,
        //     userid: res.id,
        //     token: token,
        //     secret: secret,
        //     checkbox:false
        //   });
        // }
        // else
        if (res.id != undefined) {
          this.setState({
            userid: res.id,
            token,
            secret,
            checkbox: false,
          });
          this.login();
          // if(res.phone_verified == 1){
          //   this.setState({
          //     userid: res._id,
          //     token: token,
          //     secret: secret
          //   });
          //   this.login();
          // }else{
          //   if(res.phone == undefined || res.phone == null || res.phone == ''){
          //     localStorage.setItem("vid", res._id);
          //     localStorage.setItem("loginredirect", 'true');
          //     localStorage.setItem("addphone", 'true');
          //     this.props.history.push("/verify-phone");
          //   }else{
          //     localStorage.setItem("vid", res._id);
          //     localStorage.setItem("loginredirect", 'true');
          //     this.props.history.push("/verify-phone");
          //   }

          //   // this.setState({
          //   //   step: 1,
          //   //   userid: res._id,
          //   //   token: token,
          //   //   secret: secret,
          //   //   checkbox:false
          //   // });
          // }
        } else {
          this.setState({
            step: -2,
            error: res.message,
          });
          alertBox(true, res.message);
        }
      },
      (error) => {
        let err = 'Authentication Error';
        switchLoader();
        try {
          alertBox(true, error.data.message);
          err = error.data.message;
        } catch (error) {
          alertBox(true, 'Authentication Error');
        }
        this.setState({
          step: -2,
          error: err,
        });
      }
    );
  };

  login = () => {
    const obj = {
      oauthToken: this.state.token,
      oauthSecret: this.state.secret,
      browser: this.state.browser,
      userid: this.state.userid,
    };
    // if(this.state.checkbox != undefined && this.state.checkbox != null && !this.state.checkbox){
    //   alertBox(true, "You need to accept the terms in order to continue!");
    //   return false;
    // }else if(this.state.checkbox != undefined && this.state.checkbox != null && this.state.checkbox){
    //   obj.checkbox = this.state.checkbox;
    // }

    twitterLogin(obj).then(
      async (resp) => {
        switchLoader();
        // localStorage.removeItem("oauthDevToken");
        // localStorage.removeItem("oauthDevSecret");
        localStorage.clear();
        localStorage.setItem('currentUser', JSON.stringify(resp.userinfo));
        localStorage.setItem('jwt', resp.token);
        localStorage.setItem('walletToken', resp.walletToken);
        try {
          let path = this.props.location.search;
          if (path.indexOf('?next=') != -1) {
            path = path.replace('?next=', '');
            if (path.indexOf('trade/') != -1) {
              window.location.href = `${
                process.env.REACT_APP_TRADEBASE + path
              }?token=${resp.walletToken}`;
            } else {
              window.location.href = path;
            }
          } else {
            window.location.href = '/home';
          }
        } catch (error) {
          window.location.href = '/home';
        }
      },
      (error) => {
        switchLoader();
        this.setState({
          step: -1,
        });
      }
    );
  };

  handleCheck = (evt) => {
    this.setState({
      checkbox: !this.state.checkbox,
    });
  };

  handleChange = (evt) => {
    const { name, value } = evt.target;
    this.setState({ [name]: value }, () => {});
  };

  goBack = (e) => {
    localStorage.removeItem('oauthDevToken');
    localStorage.removeItem('oauthUsrToken');
    localStorage.removeItem('oauthDevSecret');
    localStorage.removeItem('oauthUsrSecret');

    window.location.href = '/twitter-login';
  };

  submitForm = (e) => {};

  render() {
    const { email, name, phone, password, cPassword, pwdtype } = this.state;
    return (
      <>
        <div className="loginPage">
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <A href="/">
                  <img
                    className="logo"
                    src={GetAssetImage('logo-main.png')}
                    alt=""
                  />
                </A>
                <p className="intro-text">
                  Social Media Platform with Trusted Cryptocurrency Exchange
                </p>
                <img
                  className="coins"
                  src={GetAssetImage('front/coins1.png')}
                />
              </div>
              <div className="col-md-5">
                <div className="loginForm">
                  {this.state.step == 0 ? (
                    <div>
                      <h3 className="blueTitle">
                        Authentication in progress, please wait...
                      </h3>
                    </div>
                  ) : null}
                  {this.state.step == -1 ? (
                    <div>
                      <h3 className="blueTitle">
                        Authentication error, please go back and try again!
                      </h3>
                      <div className="input-group mb-3 ">
                        <div className="input-group-append nextbtn">
                          <button
                            className="btn btn-main big"
                            type="button"
                            onClick={(e) => this.goBack(e)}
                          >
                            Try Again
                          </button>

                          <div />
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {this.state.step == -2 ? (
                    <div>
                      <h3 className="blueTitle">
                        Authentication failed, please try again!
                      </h3>
                      <p color="red">{this.state.error}</p>
                      <div className="input-group mb-3 ">
                        <div className="input-group-append nextbtn">
                          <button
                            className="btn btn-main big"
                            type="button"
                            onClick={(e) => this.goBack(e)}
                          >
                            Try Again
                          </button>

                          <div />
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {this.state.step == 1 ? (
                    <div>
                      <h3 className="blueTitle">Final Step</h3>
                      <div className="input-group mb-3">
                        <div className="input-group-append mr-2">
                          {/* <select required className="form-control" name="countryCode" id=""
                                onChange={(e) => this.handleChange(e)}
                                value={this.state.countryCode} >
                                {ccodes.map((country, i) => (
                                  <option  value={country.dial_code} >
                                    {country.code} {country.dial_code}
                                  </option>
                                ))}
                              </select> */}
                          <Select
                            className="form-control"
                            options={ccodes}
                            values={this.state.values}
                            labelField="name"
                            valueField="name"
                            required
                            name="ccode"
                            onChange={(values) => {
                              try {
                                this.setState({
                                  countryCode: values[0].dial_code,
                                  values,
                                });
                              } catch (error) {
                                this.setState({
                                  countryCode: '',
                                  values,
                                });
                              }
                            }}
                          />
                        </div>
                        <input
                          className="form-control"
                          type="tel"
                          required
                          placeholder="Mobile"
                          pattern="[0-9]{6,}"
                          title="Minimum 6 digit, numbers only"
                          name="phone"
                          value={phone}
                          onChange={(e) => this.handleChange(e)}
                        />
                        <span style={{ color: 'red', width: '100%' }}>
                          {this.state.errors.phone}
                        </span>
                      </div>
                      {/* <div className="input-group mb-3">
                          <div className="robotCheck">
                            <label className="customCheck"><input type="checkbox" value={this.state.checkbox} onChange={this.handleCheck} /> I am over age 18 and I agree to <a href="https://blockoville.com/tampc" target="_BLANK" className="terms"><span className="pointer text-blue" >Terms & Conditions </span></a>
                              
                              <span className="checkmark"></span>
                            </label>
                          </div>
                        </div> */}
                      <div className="input-group mb-3 ">
                        <div className="input-group-append nextbtn">
                          <div />
                          <button
                            className="btn btn-main big"
                            type="submit"
                            disabled={this.props.inProgress}
                            onClick={(e) => this.updateInfo()}
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {/* <React.Fragment><h3 className="new">Remember your Password?</h3>
                          <A href="/login" className="join">Login</A></React.Fragment> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <FrontPageFooter />
      </>
    );
  }
}

export default TwitterLogin;
