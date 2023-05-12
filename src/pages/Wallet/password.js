import React from 'react';
import { alertBox, switchLoader } from '../../commonRedux';
import Button from '../../components/Button';
import WalletMenu from '../../components/Menu/WalletMenu';
import WalletMenuMobile from '../../components/Menu/WalletMenuMobile';
import Spinner from '../../components/Spinner/index';
import WalletAllBalance from '../../components/Wallet/allBalance';
import walletCheck from '../../hooks/walletCheck';
import {
  getUserDetails,
  updateWithdrawPassword,
} from '../../http/wallet-calls';
import './styles.scss';

class WithdrawalPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attempt: 0,
      reset: false,
      tfa: '',
      status: 0,
      code: '',
      code2: '',
      loading: true,
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

  submit = (e) => {
    e.preventDefault();
    const strongRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
    );
    if (this.state.code == null || this.state.code == '') {
      alertBox(true, 'Please enter the password');
    } else if (this.state.code != '' && !strongRegex.test(this.state.code)) {
      alertBox(
        true,
        'Minimum 8 Characters including, 1 uppercase, 1 lowercase, 1 numeric and 1 special charcater'
      );
    } else if (this.state.code != this.state.code2) {
      alertBox(true, 'Confirm Password does not match');
    } else {
      switchLoader('Updating...');
      const data = {
        withPassword: this.state.code,
      };

      updateWithdrawPassword(data).then(
        async (resp) => {
          try {
            if (resp.status == true) {
              alertBox(true, resp.message, 'success');
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
    }
  };

  render() {
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

              <div className="p-2 pt-4">
                <p className="subtitle text-left">Update Withdrawal Password</p>
                <form action="" onSubmit={this.submit} method="post">
                  <div className="input-group mb-3">
                    <div>
                      <input
                        type="password"
                        required
                        name="code"
                        placeholder="Password"
                        value={this.state.code}
                        onChange={this.handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <div>
                      <input
                        type="password"
                        required
                        name="code2"
                        placeholder="Confirm Password"
                        value={this.state.code2}
                        onChange={this.handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <Button variant="primary" size="big">
                      Update
                    </Button>
                  </div>
                </form>
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

export default WithdrawalPassword;
