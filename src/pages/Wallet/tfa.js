import React from 'react';
import { alertBox, switchLoader } from '../../commonRedux';
import Button from '../../components/Button';
import WalletMenu from '../../components/Menu/WalletMenu';
import WalletMenuMobile from '../../components/Menu/WalletMenuMobile';
import Spinner from '../../components/Spinner/index';
import WalletAllBalance from '../../components/Wallet/allBalance';
import walletCheck from '../../hooks/walletCheck';
import { getUserDetails, updateTFA } from '../../http/wallet-calls';
import './styles.scss';

class TFA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attempt: 0,
      reset: false,
      tfa: '',
      status: 0,
      code: '',
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
    if (this.state.code == null || this.state.code == '') {
      alertBox(true, 'Please enter the code');
    } else {
      switchLoader('Updating...');
      const data = {
        tfa_code: this.state.code,
      };

      updateTFA(data).then(
        async (resp) => {
          try {
            if (resp.status == true) {
              alertBox(true, resp.message, 'success');
              this.setState({
                code: '',
              });
              this.checkWallet();
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
              <h3>Scan this QR code with google authenticator app</h3>
              <p className="text-danger">
                {this.state.status === 0
                  ? 'If you have already added this in your google authenticator and disabled 2FA, please remove it and scan again'
                  : ''}
              </p>
              {this.state.tfa && <img src={this.state.tfa} />}
              <div>
                Status:{' '}
                <span
                  className={
                    this.state.status === 0 ? 'text-danger' : 'text-success'
                  }
                >
                  {this.state.status === 0 ? 'Not Enabled' : 'Enabled'}
                </span>
              </div>
              <div>
                <form action="" onSubmit={this.submit} method="post">
                  <div className="input-group mb-3">
                    <label>
                      Enter Google Authenticator code to{' '}
                      {this.state.status === 0 ? 'Enable' : 'Disable'} 2FA
                    </label>
                    <input
                      type="text"
                      required
                      name="code"
                      placeholder=""
                      value={this.state.code}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="col-md-12 mb-3 text-end">
                    <Button variant="primaryBtn" size="big">
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

export default TFA;
