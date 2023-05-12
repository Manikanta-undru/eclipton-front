import React from 'react';
import Select from 'react-dropdown-select';
import ReCAPTCHA from 'react-google-recaptcha';
import { alertBox } from '../../commonRedux';
import FrontPageFooter from '../../components/FrontPageFooter';
import { GetAssetImage } from '../../globalFunctions';
import {
  registrationCognito,
  referralCheck,
  googlerecaptchavalid,
  checkUsername,
} from '../../http/http-calls';
import { history } from '../../store';
import { signUp } from '../../auth/cognitoAuth';
import DebouncedInput from '../../components/DebouncedInput/DebouncedInput';
import Spinner from '../../components/Spinner';

const ccodes = require('./ccodes.json');
require('../Login/styles.scss');

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.userInputRef = React.createRef();
    this.state = {
      name: '',
      email: '',
      rcode: '',
      values: [],
      countryCode: '',
      phone: '',
      password: '',
      cPassword: '',
      errors: {},
      isLoading: false,
      pwdtype: 'password',
      cpwdtype: 'password',
      username: '',
      userNameStatus: {},
      countryCodes: [
        { name: 'US', code: '+1' },
        { name: 'IN', code: '+91' },
        { name: 'GB', code: '+44' },
      ],
      isgooglecaptcha: (process.env.REACT_APP_RECAPTCHA === 'true') != true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);

    this.checkUserNameStatus = {
      EXISTS: {
        message: 'username already taken',
        type: 'warning',
      },
      AVAILABLE: {
        message: 'username available',
        type: 'success',
      },
      MIN_CHAR: {
        message: 'minimum 6 characters required',
        type: 'warning',
      },
      MAX_CHAR: {
        message: 'upto 25 characters are allowed',
        type: 'warning',
      },
      INVALID: {
        message: 'Only a-z,0-9,-,_ are allowed',
        type: 'warning',
      },
      UNKNOWN: {
        message: 'Something went wrong',
        type: 'warning',
      },
    };

    this.checkUserNameResp = {
      EXISTS: 'username exists',
      AVAILABLE: 'username available',
    };
  }

  componentDidMount() {
    try {
      this.setState({
        rcode:
          this.props.match.params.username == undefined ||
          this.props.match.params.username == 'new'
            ? ''
            : this.props.match.params.username,
      });
    } catch (error) {
      console.log(error);
    }
    console.log(process.env.REACT_APP_RECAPTCHAKEY_SITEKEY);
  }

  phoneFocus = () => {
    document.getElementById('phone').focus();
  };

  handleChange = (evt) => {
    const { name, value } = evt.target;
    this.setState({ [name]: value });
  };

  handleBlur = (evt) => {
    const { name, value } = evt.target;
    const trimmedValue = value.trim();
    this.setState({ [name]: trimmedValue });
  };

  checkUsernameStatus = async (username) => {
    try {
      const response = await checkUsername({ username });
      if (response.message === this.checkUserNameResp.AVAILABLE) {
        return this.checkUserNameStatus.AVAILABLE;
      }
      if (response.message === this.checkUserNameResp.EXISTS) {
        return this.checkUserNameStatus.EXISTS;
      }
      return this.checkUserNameStatus.UNKNOWN;
    } catch (error) {
      console.error(error);
      return this.checkUserNameStatus.UNKNOWN;
    }
  };

  handleUsernameChange = async (value) => {
    const userName = value?.trim()?.toLowerCase();
    this.userInputRef.current.value = userName;
    this.setState({ username: userName });
    const regex = /[^a-zA-Z0-9_-]/;
    if (userName === '' || userName.length < 6) {
      this.setState({ userNameStatus: this.checkUserNameStatus.MIN_CHAR });
      return;
    }
    if (userName.length > 25) {
      this.setState({ userNameStatus: this.checkUserNameStatus.MAX_CHAR });
      return;
    }
    if (regex.test(userName)) {
      // The string contains invalid characters
      this.setState({ userNameStatus: this.checkUserNameStatus.INVALID });
      return;
    }
    if (userName) {
      const usernameStatus = await this.checkUsernameStatus(userName);
      this.setState({ userNameStatus: usernameStatus });
    }
  };

  handleValidation() {
    const fields = this.state;
    let formIsValid = true;
    const errors = {};

    if (!fields.name) {
      formIsValid = false;
      errors.name = 'Cannot be empty';
    }
    if (
      this.state.userNameStatus?.message !==
      this.checkUserNameStatus.AVAILABLE.message
    ) {
      formIsValid = false;
    }

    if (this.state.countryCode == '') {
      formIsValid = false;
      errors.ccode = 'Cannot be empty';
    }

    if (!fields.name) {
      // if (!fields["name"].match(/^[a-zA-Z]+$/)) {
      //   formIsValid = false;
      //   errors["name"] = "Only letters";
      // }
      if (fields.name.length > 160) formIsValid = false;
      errors.name = '160 Characters only';
    }

    if (!fields.username) {
      const regex = /^[a-zA-Z0-9-_]+$/;
      if (fields.username.search(regex) === -1) {
        errors.username = 'Only alphabets, numbers, hyphen, underscore';
      }
      if (fields.username.length > 25) formIsValid = false;
      errors.username = '25 Characters only';
    }

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
      }
    }

    if (!fields.phone) {
      formIsValid = false;
      errors.phone = 'Cannot be empty';
    }

    // if (typeof fields["phone"] !== "undefined" && fields["phone"]) {
    //   if (!fields["phone"].match(/^[0-9]+$/) || fields["phone"].length != 10) {
    //     formIsValid = false;
    //     errors["phone"] = "Invalid Phone";
    //   }
    // }

    if (!fields.password) {
      formIsValid = false;
      errors.password = 'Cannot be empty';
    }

    if (fields.password) {
      const strongRegex = new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
      );
      if (!strongRegex.test(fields.password)) {
        formIsValid = false;
        errors.password =
          'Minimum 8 Characters including, 1 uppercase, 1 lowercase, 1 numeric and 1 special charcater';
      }
    }
    if (!fields.cPassword) {
      formIsValid = false;
      errors.cPassword = 'Cannot be empty';
    }
    if (fields.password != fields.cPassword) {
      formIsValid = false;
      errors.cPassword = "Password doesn't match";
    }

    if (this.state.isgooglecaptcha == false) {
      formIsValid = false;
      errors.captchaerr = 'Please verify the recaptcha';
    }

    this.setState({ errors });
    return formIsValid;
  }

  gonChange = (value) => {
    // send to backend check
    googlerecaptchavalid({ ctoken: value }).then(async (resp) => {
      if (resp.status == true) {
        this.setState({ isgooglecaptcha: true });
      } else {
        this.setState({ isgooglecaptcha: false });
      }
    });
  };

  submitForm = (e) => {
    e.preventDefault();

    if (this.handleValidation()) {
      const obj = {
        name: this.state.name,
        email: this.state.email,
        username: this.state.username,
        full_phone: `${this.state.countryCode}${this.state.phone}`,
        password: this.state.password,
        passwordrepeat: this.state.cPassword,
        rcode: this.state.rcode,
        group: 'customer',
        liquidity: '',
      };
      const attributes = {
        name: this.state.name,
        phone_number: `${this.state.countryCode}${this.state.phone}`,
        'custom:group': '0',
        'custom:ref_code': this.state.rcode,
      };
      this.setState({ isLoading: true });
      if (this.state.rcode != '') {
        referralCheck({ ref: this.state.rcode }).then(async (resp) => {
          if (resp.message == 'Invalid Referral Code') {
            this.setState({ isLoading: false });
            alertBox(true, resp.message);
          } else {
            (async () => {
              try {
                const usernameStatus = await this.checkUsernameStatus(
                  this.state.username
                );
                if (usernameStatus === this.checkUserNameStatus.AVAILABLE) {
                  signUp(this.state.email, this.state.password, attributes)
                    .then((data) => {
                      obj.userid = data.userSub;
                      registrationCognito(obj).then(
                        (resp) => {
                          this.setState({ isLoading: false });
                          alertBox(true, 'Please verify your email', 'success');
                          history.push('/login');
                        },
                        (error) => {
                          this.setState({ isLoading: false });
                          const alert =
                            error && error.data && error.data.message
                              ? typeof error.data.message === 'object'
                                ? Object.values(error.data.message).join(',')
                                : error.data.message
                              : '';
                          alertBox(true, alert);
                        }
                      );
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
                } else {
                  this.setState({ userNameStatus: usernameStatus });
                }
              } catch (error) {
                console.error(error);
              }
            })();
          }
        });
      } else {
        signUp(this.state.email, this.state.password, attributes)
          .then((data) => {
            obj.userid = data.userSub;
            registrationCognito(obj).then(
              async (resp) => {
                this.setState({ isLoading: false });
                alertBox(true, 'Please verify your email', 'success');
                // history.push("/verify-phone");
                history.push('/login');
              },
              (error) => {
                this.setState({ isLoading: false });
                const alert =
                  error && error.data && error.data.message
                    ? typeof error.data.message === 'object'
                      ? Object.values(error.data.message).join(',')
                      : error.data.message
                    : '';
                alertBox(true, alert);
              }
            );

            // switchLoader();
            // alertBox(true, "Please verify your email", 'success');
            // history.push("/login");
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
      }
    } else {
      /* empty */
    }
  };

  render() {
    const {
      email,
      name,
      phone,
      password,
      cPassword,
      pwdtype,
      rcode,
      username,
      isLoading,
    } = this.state;
    return (
      <div className="newLogin">
        <div className="container-fluid newLogin_container">
          <div className="row">
            <div className="col-md-6">
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
              <div className="newLogin_right newLogin_right_scroll">
                <div className="newLogin_right_box">
                  <h2>Sign up</h2>
                  <h6 className="pb-4">
                    Hey, Enter your details to Sign up to your account
                  </h6>
                  <form
                    autoComplete="off"
                    className="newLogin_right_form"
                    action=""
                    method="post"
                    onSubmit={this.submitForm}
                  >
                    <div className="form-group">
                      <label htmlFor="username">Username</label>

                      <DebouncedInput
                        ref={this.userInputRef}
                        autoComplete="off"
                        delay={1000}
                        type="text"
                        className="form-control"
                        aria-describedby=""
                        maxLength="50"
                        name="username"
                        required
                        id="username"
                        pattern="[a-zA-Z0-9-_]{6,25}"
                        title="Enter Minimum 6 characters, Maximum 25 characters, Alpha-Numeric Hyphen-Underscore without special charcters"
                        onChange={(value) => this.handleUsernameChange(value)}
                      />
                      <span
                        className={
                          this.state.userNameStatus.type === 'warning'
                            ? 'input_error'
                            : 'input_success'
                        }
                      >
                        {this.state.userNameStatus?.message}
                      </span>
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Full Name</label>
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control"
                        aria-describedby="emailHelp"
                        maxLength="50"
                        name="name"
                        required
                        title="Enter Minimum 6 characters, Maximum 25 characters, Alpha-Numeric Hyphen-Underscore without special characters"
                        value={name}
                        onChange={(e) => this.handleChange(e)}
                        onBlur={(e) => this.handleBlur(e)}
                      />

                      <span className="input_error">
                        {this.state.errors.name}
                      </span>
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={email}
                        onBlur={(e) => this.handleBlur(e)}
                        pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
                        onChange={(e) => this.handleChange(e)}
                        required
                        aria-describedby="emailHelp"
                      />
                      <span className="input_error">
                        {this.state.errors.email}
                      </span>
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputPassword1">Password</label>
                      <input
                        type="password"
                        autoComplete="false"
                        className="form-control"
                        required
                        name="password"
                        value={password}
                        onBlur={(e) => this.handleBlur(e)}
                        onChange={(e) => this.handleChange(e)}
                      />
                      <span className="input_error">
                        {this.state.errors.password}
                      </span>
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputPassword1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        autoComplete="off"
                        className="form-control"
                        name="cPassword"
                        required
                        onBlur={(e) => this.handleBlur(e)}
                        value={cPassword}
                        onChange={(e) => this.handleChange(e)}
                      />
                      <span className="input_error">
                        {this.state.errors.cPassword}
                      </span>
                    </div>

                    <div className="input-group addCountry_code mb-3">
                      <label htmlFor="exampleInputEmail1">Mobile Number</label>
                      <div className="input-group-prepend">
                        <Select
                          className="form-control mr-2"
                          options={ccodes}
                          values={this.state.values}
                          labelField="name"
                          valueField="name"
                          required
                          name="ccode"
                          clearOnBlur
                          clearOnSelect
                          onChange={(values) => {
                            try {
                              if (values.length > 0) {
                                this.setState({
                                  countryCode: values[0].dial_code,
                                  values,
                                });
                              } else {
                                throw 'error';
                              }
                            } catch (error) {
                              this.setState({
                                countryCode: '',
                                values: [],
                              });
                            }
                          }}
                        />

                        <div>
                          <span>{this.state.errors.ccode}</span>
                        </div>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        maxLength="10"
                        required
                        minLength="10"
                        pattern="[0-9]{10}"
                        title="Minimum 10 digit, numbers only"
                        name="phone"
                        value={phone}
                        onBlur={(e) => this.handleBlur(e)}
                        onChange={(e) => this.handleChange(e)}
                      />
                      <span className="input_error">
                        {this.state.errors.phone}
                      </span>
                    </div>

                    {process.env.REACT_APP_RECAPTCHA === 'true' ? (
                      <ReCAPTCHA
                        className="reCaptcha"
                        sitekey={process.env.REACT_APP_RECAPTCHAKEY_SITEKEY}
                        onChange={(e) => this.gonChange(e)}
                      />
                    ) : null}

                    {/* <div class="form-group">
                      <label for="exampleInputEmail1">Referral Code</label>
                      <input type="email" class="form-control" name="rcode"
                          value={rcode}
                          onChange={(e) => this.handleChange(e)}  />
                    </div> */}
                    <div className="custom-control custom-checkbox mb-2">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        required
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customCheck"
                      >
                        <span>
                          I am over age 18 and I agree to{' '}
                          <a
                            href={`${process.env.REACT_APP_FRONTEND}terms-and-conditions.pdf`}
                            target="_BLANK"
                            rel="noreferrer"
                          >
                            Terms & Conditions
                          </a>
                        </span>
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="login_Btn"
                      disabled={this.props.inProgress}
                    >
                      Get Started
                      {isLoading && (
                        <div className="loader-spinner">
                          <Spinner
                            className="spinner-xxs-white"
                            style={{ width: '15px', height: '15px' }}
                          />
                        </div>
                      )}
                    </button>
                    <span className="dontText">
                      Already have an account? <a href="/login">Login Now</a>
                    </span>
                  </form>
                  <div
                    className="d-block d-sm-none  col-12  "
                    style={{ marginLeft: '-35px' }}
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

export default Register;
