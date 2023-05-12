import React from 'react';
import { alertBox, switchLoader } from '../../commonRedux';
import Button from '../../components/Button';
import WalletMenu from '../../components/Menu/WalletMenu';
import WalletMenuMobile from '../../components/Menu/WalletMenuMobile';
import Spinner from '../../components/Spinner/index';
import WalletAllBalance from '../../components/Wallet/allBalance';
import walletCheck from '../../hooks/walletCheck';
import { SendVerifyCode, CheckVerifyCode } from '../../http/http-calls';
import {
  getUserDetails,
  updateWithdrawPassword,
} from '../../http/wallet-calls';

import './styles.scss';

class WithdrawalRepassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loading: true,
      ResetPassword: true,
      changePassword: false,
      fpInput: '',
      accessCodeInput: '',
      authKeyTime: '',
      errors: null,
    };
  }

  componentDidMount() {
    this.checkWallet();
  }

  checkWallet = () => {
    walletCheck().then(
      (resp) => {
        this.setState(
          {
            loading: false,
          },
          () => {
            this.getDetails();
          }
        );
      },
      (err) => {
        this.setState({
          loading: false,
          error: 'Authentication Error!',
        });
      }
    );
  };

  handleChange = (e) => {
    const val = e.target.value;
    const input = e.target.getAttribute('name');

    this.setState({
      [input]: val,
    });
  };

  getDetails = () => {
    getUserDetails().then(
      async (resp) => {
        this.setState({
          loading: false,
          tfa: resp.data.tfa_url,
          status: resp.data.tfa_status,
        });
      },
      (err) => {
        this.setState({
          loading: false,
        });
        alertBox(true, 'Error getting your data, try again');
      }
    );
  };

  setPasswordStep = (obj) => {
    this.setState({
      ResetPassword: false,
      changePassword: false,
      [obj]: true,
    });
  };

  sendVerificationCode = (e) => {
    e.preventDefault();
    if (this.state.email == null) {
      alertBox(true, 'Please enter the email');
    } else {
      switchLoader(true, 'Sending Access code. Please wait...');
      const obj = { str: this.state.email };

      SendVerifyCode(obj).then(async (resp) => {
        if (resp.message.code != '') {
          alertBox(true, 'Please check your email', 'success');
          switchLoader();
          this.setState({
            authKeyTime: resp.message.timestamp,
          });
          this.setPasswordStep('changePassword');
        }
      });
    }
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
        authKeyTime: this.state.authKeyTime,
        code: this.state.accessCodeInput,
        password: this.state.newPassword,
        confirmpassword: this.state.confirmPassword,
        _id: this.props.currentUser._id,
        step: '3',
      };
      CheckVerifyCode(obj).then(async (resp) => {
        if (resp.message == 'Verified') {
          // Wallet Password Update
          const data = {
            withPassword: this.state.newPassword,
          };
          updateWithdrawPassword(data).then(
            async (resp) => {
              try {
                if (resp.status == true) {
                  alertBox(true, 'Successfully Reset the password', 'success');
                  this.props.history.push('/wallet/withdraw');
                } else {
                  alertBox(true, resp.message);
                }
              } catch (error) {
                alertBox(true, error == undefined ? 'Error' : error.toString());
              }
              switchLoader();
            },
            (error) => {
              alertBox(true, error == undefined ? 'Error' : error.toString());
              switchLoader();
            }
          );
        } else {
          switchLoader();
          alertBox(true, resp.message);
          this.props.history.push('/wallet/repassword');
        }
      });
    }
  };

  render() {
    const {
      ResetPassword,
      changePassword,
      accessCodeInput,
      newPassword,
      confirmPassword,
    } = this.state;

    return (
      <div className="container my-wall-container depositPage">
        <div className="row mt-2">
          {/* <!-- left column --> */}
          <div className="col-sm empty-container-with-out-border left-column">
            <WalletMenu {...this.props} />
          </div>
          {/* <!-- end left column --> */}

          {/* <!-- center column --> */}
          {this.state.loading && (
            <div className="col-sm empty-container-with-border center-column text-center">
              <Spinner />
            </div>
          )}
          {!this.state.loading && (
            <div className="col-sm empty-container-with-border center-column text-center">
              <WalletMenuMobile {...this.props} />

              <div className="p-8 pt-4">
                <p className="subtitle text-left">Reset Withdrawal Password</p>
                {ResetPassword && (
                  <form
                    action=""
                    onSubmit={this.sendVerificationCode}
                    method="post"
                  >
                    <div className="mb-3">
                      <div>
                        <input
                          type="email"
                          required
                          name="email"
                          placeholder="Enter Email"
                          value={this.state.email}
                          onChange={this.handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="input-group mb-3">
                      <Button variant="primary" size="big">
                        Submit
                      </Button>
                    </div>
                  </form>
                )}

                {changePassword && (
                  <form
                    action=""
                    method="post"
                    autoComplete="off"
                    onSubmit={this.changeNewPassword}
                  >
                    <p className="text-secondary">
                      Enter access code received from your registered email
                      address.
                    </p>
                    <div className="input-group mb-3">
                      <input
                        autoComplete="new-password"
                        required
                        type="text"
                        className="form-control bl_0"
                        placeholder="Access code"
                        name="accessCodeInput"
                        value={accessCodeInput}
                        onChange={(e) => this.handleChange(e)}
                      />
                    </div>

                    <div className="input-group mb-3">
                      <input
                        autoComplete="new-password"
                        required
                        type="password"
                        className="form-control bl_0"
                        placeholder="Password"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => this.handleChange(e)}
                      />
                    </div>
                    <div className="input-group mb-3">
                      <input
                        autoComplete="off"
                        required
                        type="password"
                        className="form-control bl_0"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => this.handleChange(e)}
                      />
                    </div>
                    <div className="form-group">
                      <Button
                        variant="primary"
                        className="big box w-100  mt-2 d-block"
                        disabled={this.props.inProgress}
                      >
                        RESET PASSWORD
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
          {/* <!-- end center column --> */}
          <div className="col-sm empty-container-with-out-border right-column">
            <WalletAllBalance />
          </div>
        </div>
      </div>
    );
  }
}

export default WithdrawalRepassword;
