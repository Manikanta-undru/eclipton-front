import React from 'react';
import GoogleLogin from 'react-google-login';
import { alertBox, switchLoader } from '../../commonRedux';
import A from '../../components/A';
import { GetAssetImage } from '../../globalFunctions';
import { googleAuth } from '../../http/oauth-calls';

require('../Login/styles.scss');

class GoogleLoginn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
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
    // this.startAuth();
  }

  startAuth = () => {
    googleAuth().then(
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

  login = () => {
    const obj = {
      oauthToken: this.state.token,
      oauthSecret: this.state.secret,
      userid: this.state.userid,
    };
    if (
      this.state.checkbox != undefined &&
      this.state.checkbox != null &&
      !this.state.checkbox
    ) {
      alertBox(true, 'You need to accept the terms in order to continue!');
      return false;
    }
    if (
      this.state.checkbox != undefined &&
      this.state.checkbox != null &&
      this.state.checkbox
    ) {
      obj.checkbox = this.state.checkbox;
    }

    GoogleLogin(obj).then(
      async (resp) => {
        // localStorage.removeItem("oauthDevToken");
        // localStorage.removeItem("oauthDevSecret");

        localStorage.clear();
        localStorage.setItem('currentUser', JSON.stringify(resp.userinfo));
        localStorage.setItem('jwt', resp.token);
        localStorage.setItem('walletToken', resp.walletToken);
        switchLoader();
        window.location.href = '/';
        //  twitterSync()
        // .then(async resp => {
        // }, error => {
        //
        // });
      },
      (error) => {
        switchLoader();
        this.setState({
          step: -1,
        });
      }
    );
  };

  handleChange = (evt) => {
    this.setState({
      checkbox: !this.state.checkbox,
    });
  };

  goBack = (e) => {
    localStorage.removeItem('oauthDevToken');
    localStorage.removeItem('oauthUsrToken');
    localStorage.removeItem('oauthDevSecret');
    localStorage.removeItem('oauthUsrSecret');

    window.location.href = '/google-login';
  };

  submitForm = (e) => {};

  render() {
    const { email, name, phone, password, cPassword, pwdtype } = this.state;
    return (
      <div className="flexCenterBody loginPage">
        <main className="mainRow">
          <section className="mainRightSection loginSection">
            <div className="container-fluid">
              {/* <div className="m-4 d-block clearfix">
                  <a className="navbar-brand mb-2 pull-right" href="#">
                    <img src={GetAssetImage('logo-main.png')} alt="" />
                  </a>
                </div> */}
              <div className="row">
                <div className="container m-3 d-block clearfix header">
                  <A className="navbar-brand mb-2 p-2 pull-right" href="/login">
                    <img src={GetAssetImage('logo-main.png')} alt="" />
                  </A>
                </div>
                <div className="container col-xl-4 col-lg-6 col-md-6 leftSection">
                  <div className="d-flex mb-3 pl-4">
                    <div className=" flex-fill ">
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
                            <div className="robotCheck">
                              <label className="customCheck">
                                {' '}
                                Do you agree with our{' '}
                                <A href="/terms-of-use">
                                  Terms on Twitter Data Usage{' '}
                                </A>
                                ?
                                <input
                                  type="checkbox"
                                  value={this.state.checkbox}
                                  onChange={this.handleChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </div>
                          </div>
                          <div className="input-group mb-3 ">
                            <div className="input-group-append nextbtn">
                              <div />
                              <button
                                className="btn btn-main big"
                                type="submit"
                                disabled={this.props.inProgress}
                                onClick={(e) => this.login()}
                              >
                                Continue
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="container-fluid col-xl-8 col-lg-6 col-md-6 loginBg" />
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export default GoogleLoginn;
