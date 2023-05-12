import React from 'react';
import { alertBox, switchLoader } from '../../commonRedux';
import FrontPageFooter from '../../components/FrontPageFooter';
import { GetAssetImage } from '../../globalFunctions';
import { verifyAccessCodeService, checkEmailreg } from '../../http/http-calls';
import { history } from '../../store';
import { forgotPassword, forgotPasswordSubmit } from '../../auth/cognitoAuth';

require('../Login/styles.scss');

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forgotPassword: true,
      verificationPage: false,
      changePassword: false,
      fpInput: '',
      accessCodeInput: '',
      newPassword: '',
      confirmPassword: '',
      authKey: '',
      errors: null,
    };
  }

  componentDidMount() {}

  sendVerificationCode = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      const obj = { str: this.state.fpInput };

      checkEmailreg(obj).then(async (resp) => {
        if (resp.message == 'success') {
          switchLoader(true, 'Sending Access code. Please wait...');

          forgotPassword(this.state.fpInput).then(
            async (resp) => {
              switchLoader();
              alertBox(true, 'Please check your email', 'success');
              this.setPasswordStep('changePassword');
              this.setState({ authKey: resp.message });
            },
            (error) => {
              alertBox(true, error.message);
              switchLoader();
            }
          );
        } else {
          switchLoader();

          alertBox(true, resp.message);
        }
      });
    }
  };

  setPasswordStep = (obj) => {
    this.setState({
      forgotPassword: false,

      changePassword: false,
      [obj]: true,
    });
  };

  verifyAccessCode = (e) => {
    e.preventDefault();
    switchLoader(true, 'Verify Access code. Please wait...');
    const obj = {
      target: encodeURIComponent(this.state.fpInput),
      authkey: this.state.authKey,
      code: this.state.accessCodeInput,
    };
    const params = { str: JSON.stringify(obj) };
    verifyAccessCodeService(params).then(
      async (resp) => {
        switchLoader();
        alertBox(true, 'Verified', 'success');
        this.setPasswordStep('changePassword');
        // this.setState({authKey:resp.message});
      },
      (error) => {
        alertBox(true, error.data.message);
        switchLoader();
      }
    );
  };

  changeNewPassword = (e) => {
    e.preventDefault();
    const strongRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
    );

    if (this.state.newPassword == null || this.state.newPassword == '') {
      alertBox(true, 'Please enter the password');
    } else if (
      this.state.newPassword != '' &&
      !strongRegex.test(this.state.newPassword)
    ) {
      alertBox(
        true,
        'Minimum 8 Characters including, 1 uppercase, 1 lowercase, 1 numeric and 1 special charcater'
      );
    } else if (this.state.newPassword != this.state.confirmPassword) {
      alertBox(true, 'Confirm Password does not match');
    } else {
      switchLoader(true, 'Changing password. Please wait...');
      const obj = {
        target: this.state.fpInput,
        password: this.state.newPassword,
        confirmpassword: this.state.confirmPassword,
        step: '3',
      };

      forgotPasswordSubmit(
        this.state.fpInput,
        this.state.accessCodeInput,
        this.state.confirmPassword
      ).then(
        async (resp) => {
          switchLoader();
          alertBox(true, 'Password successfully updated', 'success');
          this.setPasswordStep('changePassword');
          history.push('/login');
        },
        (error) => {
          alertBox(true, error.message);
          switchLoader();
        }
      );
    }
  };

  handleChange = (evt) => {
    const { name, value } = evt.target;
    this.setState({ [name]: value });
  };

  handleValidation() {
    const fields = this.state;
    let formIsValid = true;
    const errorss = {};

    if (typeof fields.fpInput !== 'undefined' && fields.fpInput) {
      const lastAtPos = fields.fpInput.lastIndexOf('@');
      const lastDotPos = fields.fpInput.lastIndexOf('.');
      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          fields.fpInput.indexOf('@@') == -1 &&
          lastDotPos > 2 &&
          fields.fpInput.length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errorss.fpInput = 'Email is not valid';
        alertBox(true, 'Email is not valid');
      }
    }

    // if (!fields["password"]) {
    //   formIsValid = false;
    //   errors["password"] = "Cannot be empty";
    // }

    this.setState({ errors: errorss });
    return formIsValid;
  }

  render() {
    const {
      fpInput,
      accessCodeInput,
      forgotPassword,
      changePassword,
      newPassword,
      confirmPassword,
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
              <div className="newLogin_right">
                <div className="newLogin_right_box">
                  {forgotPassword && (
                    <form
                      className="newLogin_right_form"
                      action=""
                      method="post"
                      onSubmit={this.sendVerificationCode}
                    >
                      <h2>Forgot Password?</h2>
                      <h6 className="pb-4">
                        {`Enter your registered email address and we'll send`}
                        <br /> you the link to reset the password
                      </h6>

                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">
                          Enter your User Email
                        </label>
                        <input
                          autoComplete="off"
                          type="email"
                          required
                          className="form-control"
                          name="fpInput"
                          value={fpInput}
                          onChange={(e) => this.handleChange(e)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="login_Btn"
                        disabled={this.props.inProgress}
                      >
                        Continue
                      </button>
                      <span className="dontText">
                        Remember your Password?{' '}
                        <a href="/New-Login">Login Now</a>
                      </span>
                    </form>
                  )}
                  {changePassword && (
                    <form
                      className="newLogin_right_form"
                      action=""
                      method="post"
                      autoComplete="off"
                      onSubmit={this.changeNewPassword}
                    >
                      <h2>Reset Password</h2>
                      <h6 className="pb-4">
                        Enter access code received from your registered email
                        address.
                      </h6>

                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Access code</label>
                        <input
                          autoComplete="new-password"
                          type="text"
                          required
                          className="form-control"
                          name="accessCodeInput"
                          value={accessCodeInput}
                          onChange={(e) => this.handleChange(e)}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Password</label>
                        <input
                          autoComplete="new-password"
                          type="password"
                          required
                          className="form-control"
                          name="newPassword"
                          value={newPassword}
                          onChange={(e) => this.handleChange(e)}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">
                          Confirm Password
                        </label>
                        <input
                          autoComplete="new-password"
                          type="password"
                          required
                          className="form-control"
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => this.handleChange(e)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="login_Btn"
                        disabled={this.props.inProgress}
                      >
                        RESET PASSWORD
                      </button>
                      <span className="dontText">
                        Remember your Password?{' '}
                        <a href="/New-Login">Login Now</a>
                      </span>
                    </form>
                  )}
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

export default ForgotPassword;
