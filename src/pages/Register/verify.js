import React from 'react';
import Select from 'react-dropdown-select';
import { verifyPhone, resendOtp, updatePhone } from '../../http/http-calls';
import { GetAssetImage } from '../../globalFunctions';
import { switchLoader, alertBox } from '../../commonRedux/';
import { history } from '../../store';
import A from '../../components/A';
import Button from '../../components/Button';
import FrontPageFooter from '../../components/FrontPageFooter';

const ccodes = require('./ccodes.json');
require('../Login/styles.scss');

class Verify extends React.Component {
  timer = null;

  constructor(props) {
    super(props);
    let redirect = localStorage.getItem('loginredirect');
    localStorage.removeItem('loginredirect');
    let addphone = localStorage.getItem('addphone');
    localStorage.removeItem('addphone');
    this.state = {
      name: '',
      time: redirect == null ? 60 : 0,
      email: '',
      countryCode: '',
      browser: null,
      phone: '',
      step: addphone == null ? 1 : 2,
      values: [],
      password: '',
      cPassword: '',
      errors: {},
      pwdtype: 'password',
      cpwdtype: 'password',
      countryCodes: [
        { name: 'US', code: '+1' },
        { name: 'IN', code: '+91' },
        { name: 'GB', code: '+44' },
      ],
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  handleChange = (evt) => {
    const { name, value } = evt.target;
    this.setState({ [name]: value }, () => {});
  };

  handleValidation() {
    let fields = this.state;
    let formIsValid = true;
    let errors = {};

    if (!fields.name) {
      formIsValid = false;
      errors.name = 'Cannot be empty';
    }

    if (!fields.name) {
      // if (!fields["name"].match(/^[a-zA-Z]+$/)) {
      //   formIsValid = false;
      //   errors["name"] = "Only letters";
      // }
      if (fields.name.length > 6) formIsValid = false;
      errors.name = '6 digits only';
    }

    this.setState({ errors });
    return formIsValid;
  }

  async componentDidMount() {
    // const browser = detect();
    // this.setState({
    //   browser:browser
    // })
    const response = await fetch('https://geolocation-db.com/json/');
    const data = await response.json();
    this.setState({ browser: data.IPv4 });

    if (this.state.time > 0) {
      this.startTimer();
    }
  }

  resend = () => {
    switchLoader(true, 'Please wait, Sending OTP');
    let data = {
      id: localStorage.getItem('vid'),
      browser: this.state.browser,
      otp: this.state.name,
    };
    resendOtp(data).then(
      async (resp) => {
        switchLoader();
        alertBox(true, 'OTP Sent', 'success');
        this.startTimer();
      },
      (error) => {
        alertBox(true, error.data.message);
        switchLoader();
      }
    );
  };

  update = (e) => {
    e.preventDefault();
    switchLoader(true, 'Please wait, Updating');
    let data = {
      id: localStorage.getItem('vid'),
      phone: this.state.phone,
      browser: this.state.browser,
      ccode: this.state.countryCode,
    };
    updatePhone(data).then(
      async (resp) => {
        switchLoader();
        alertBox(true, 'Phone updated and OTP Sent', 'success');
        this.setState({
          step: 1,
        });
        this.startTimer();
      },
      (error) => {
        alertBox(true, error.data.message);
        switchLoader();
      }
    );
  };

  verify = (e) => {
    e.preventDefault();
    switchLoader(true, 'Please wait, Verifying OTP');
    let data = {
      id: localStorage.getItem('vid'),
      browser: this.state.browser,
      otp: this.state.name,
    };
    verifyPhone(data).then(
      async (resp) => {
        switchLoader();
        alertBox(true, 'OTP successfully verified', 'success');
        if (resp.status == 'new') {
          this.props.history.push('/login');
        } else {
          localStorage.clear();
          localStorage.setItem('currentUser', JSON.stringify(resp.userinfo));
          localStorage.setItem('jwt', resp.token);
          localStorage.setItem('walletToken', resp.walletToken);
          window.location.href = '/';
        }
      },
      (error) => {
        alertBox(true, error.data.message);
        switchLoader();
      }
    );
  };

  startTimer = () => {
    if (this.timer != null) {
      clearInterval(this.timer);
    }
    this.setState(
      {
        time: 60,
      },
      () => {
        this.timer = setInterval(() => {
          if (this.state.time <= 0) {
            clearInterval(this.timer);
          } else {
            this.setState({
              time: this.state.time - 1,
            });
          }
        }, 1000);
      }
    );
  };

  changePhone = () => {
    this.setState({
      step: this.state.step == 1 ? 2 : 1,
    });
  };

  submitForm = (e) => {
    e.preventDefault();
    let uid = localStorage.getItem('vid');
    if (this.handleValidation()) {
      const obj = {
        otp: this.state.name,
        browser: this.state.browser,
        id: uid,
      };

      switchLoader(true, 'Please wait...');
      verifyPhone(obj).then(
        async (resp) => {
          switchLoader();
          alertBox(
            true,
            'Your phone verified, check your email inbox to verify your email',
            'success'
          );
          history.push('/login');
        },
        (error) => {
          switchLoader();
          const alert =
            error && error.data && error.data.message
              ? typeof error.data.message == 'object'
                ? Object.values(error.data.message).join(',')
                : error.data.message
              : '';
          alertBox(true, alert);
        }
      );
    } else {
      /* empty */
    }
  };

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
                  {this.state.step == 1 ? (
                    <form action="" method="post" onSubmit={this.verify}>
                      <h1>Verify Mobile Number</h1>

                      <div className="input-group mb-3">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="OTP"
                          name="name"
                          required
                          pattern="[0-9]{6,6}"
                          title="Enter 6 digit OTP"
                          value={name}
                          onChange={(e) => this.handleChange(e)}
                        />
                        <span style={{ color: 'red', width: '100%' }}>
                          {this.state.errors['name']}
                        </span>
                      </div>
                      {this.props.inProgress || this.state.time > 0 ? null : (
                        <a
                          href="#"
                          className="mb-3 d-block"
                          onClick={this.changePhone}
                        >
                          Change Mobile Number
                        </a>
                      )}

                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-6">
                            <Button
                              variant="primary"
                              className="big box w-100  mt-2 d-block"
                              disabled={this.props.inProgress}
                            >
                              Verify
                            </Button>
                          </div>
                          <div className="col-md-6">
                            {this.props.inProgress || this.state.time > 0 ? (
                              <Button
                                type="button"
                                variant="primary-outline"
                                className="big box w-100  mt-2 d-block"
                                disabled={true}
                              >
                                {this.state.time}
                              </Button>
                            ) : (
                              <Button
                                onClick={this.resend}
                                type="button"
                                variant="primary-outline"
                                className="big box w-100  mt-2 d-block"
                              >
                                {'Resend'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="warnin">
                        If you haven&apos;t received the OTP, wait for 60
                        seconds and request new OTP or change your phone number
                      </p>
                    </form>
                  ) : (
                    <form action="" method="post" onSubmit={this.update}>
                      <h1>Change Mobile Number</h1>
                      <div className="input-group mb-3">
                        <div className="input-group-append mr-2 d-block">
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
                                  values: values,
                                });
                              } catch (error) {
                                this.setState({
                                  countryCode: '',
                                  values: values,
                                });
                              }
                            }}
                          />
                          <div>
                            <span style={{ color: 'red', width: '100%' }}>
                              {this.state.errors['ccode']}
                            </span>
                          </div>
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
                          {this.state.errors['phone']}
                        </span>
                      </div>

                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-6">
                            <Button
                              variant="primary"
                              className="big box w-100  mt-2 d-block"
                              disabled={this.props.inProgress}
                            >
                              Update
                            </Button>
                          </div>
                          <div className="col-md-6">
                            <Button
                              onClick={this.changePhone}
                              type="button"
                              variant="primary-outline"
                              className="big box w-100  mt-2 d-block"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}

                  {/*                
                <h3 className="new">Already have an account?</h3>
                <A href="/login" className="join">Login</A> */}
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

export default Verify;
