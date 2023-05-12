import QRCode from 'qrcode.react';
import React from 'react';
import { connect } from 'react-redux';
import { alertBox, switchLoader } from '../../commonRedux';
import A from '../../components/A';
import CoinSelector from '../../components/CoinSelector/index';
import FileBrowse from '../../components/FormFields/FileBrowse';
import WalletMenu from '../../components/Menu/WalletMenu';
import WalletMenuMobile from '../../components/Menu/WalletMenuMobile';
import Spinner from '../../components/Spinner/index';
import TabsUI from '../../components/Tabs/index';
import WalletAllBalance from '../../components/Wallet/allBalance';
import { mapCommonStateToProps } from '../../hooks/walletCheck';
import {
  fiatDeposit,
  getAdminBankDetails,
  getAllPairs,
  getReceivedTransactions,
  getUserAddress,
} from '../../http/wallet-calls';
import './styles.scss';
import MobileNav from '../../components/Menu/MobileNav';

class WalletDeposit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clearJunction: '',
      attempt: 0,
      reset: false,
      transAmount: '',
      transId: '',
      transCurrency: '',
      transProof: null,
      received: [],
      bank: null,
      currentCoin: null,
      coins: null,
      fiatCoins: [],
      status: null,
      error: '',
      loading: false,
      content: 'loading',
      currentTab: 0,
      fields_enter: 0,
    };
  }

  inputChange = (e) => {
    const val = e.target.value;
    const input = e.target.getAttribute('name');
    this.setState({
      [input]: val,
      fields_enter: 1,
    });
  };

  fiatReset = () => {
    this.setState({
      transAmount: null,
      transId: null,
      transCurrency: '',
      depositTo: null,
      transProof: null,
      depositCurrency: null,
    });
    if (this.state.fields_enter == 1) {
      this.setState({
        reset: true,
      });
      setTimeout(() => {
        this.setState({
          reset: false,
          fields_enter: 0,
        });
      }, 200);
    }
  };

  fiatSubmit = () => {
    if (
      this.state.transCurrency == '' ||
      this.state.transId == '' ||
      this.state.transAmount == '' ||
      this.state.transProof == ''
    ) {
      alertBox(true, 'All fields are required!');
    } else if (this.state.transAmount <= 0) {
      alertBox(true, 'Amount should be greater than 0');
    } else if (/[^0-9a-zA-Z]/.test(this.state.transId)) {
      alertBox(true, 'Transaction ID should be numeric and alphabets');
    } else {
      switchLoader('Submitting Request...');
      const data = {
        currency: this.state.transCurrency,
        transactionid: this.state.transId,
        amount: this.state.transAmount,
        image: this.state.transProof,
        clearjunction_id: this.state.clearJunction,
      };
      fiatDeposit(data).then(
        async (resp) => {
          try {
            if (resp.status == true) {
              this.fiatReset();
              alertBox(true, resp.message, 'success');
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

  fileChange = (n, t, v) => {
    this.setState({
      [n]: t == 'upload' ? v : v,
      fields_enter: 1,
    });
  };

  componentDidMount() {
    this.checkWallet();
  }

  checkWallet = () => {
    this.allPairs();
    this.received();
    this.adminBankDetails();
    this.setState({ loading: false });
  };

  selectCurrency = (cur) => {
    this.setState(
      {
        loading: true,
        currentCoin: cur,
      },
      () =>
        this.walletAddress({
          currency: cur.currencySymbol,
          currency_id: cur._id,
        })
    );
  };

  copyThis = (e, value) => {
    const input = e.target.getAttribute('data-target');
    const val = document.getElementById(input).value;
    navigator.clipboard.writeText(val);
    if (value == 'address') {
      alertBox(true, 'Address Copied!', 'success');
    } else {
      alertBox(true, 'Tag Copied!', 'success');
    }
  };

  walletAddress = (param) => {
    getUserAddress(param).then(
      (resp) => {
        const temp = {
          address: resp.data,
          tag: resp.tag,
          add_id: resp.data._id,
          currencySymbol: this.state.currentCoin.currencySymbol,
        };
        this.setState({
          currentCoin: temp,
          loading: false,
        });
      },
      (err) => {
        alertBox(true, 'Error generating wallet');
      }
    );
  };

  received = () => {
    getReceivedTransactions().then(
      async (resp) => {
        this.setState({
          loading: false,
          received: resp.data,
          error: '',
        });
      },
      (error) => {
        this.setState({
          loading: false,
        });
      }
    );
  };

  allPairs = () => {
    let allPairs = [];
    getAllPairs().then(
      async (resp) => {
        allPairs = resp.data;
        const thePath = this.props.location.pathname;
        const coin = thePath.substring(thePath.lastIndexOf('/') + 1);
        const fc = [];
        let okay = 0;
        const len = allPairs.length;
        allPairs.forEach((e, i) => {
          if (e.currencySymbol == coin) {
            okay = 1;
          }
          if (e.curnType == 1) {
            fc.push(e);
          }
          if (i == len - 1) {
            this.setState(
              {
                loading: false,
                coins: allPairs,
                fiatCoins: fc,
                error: '',
              },
              () => {
                if (okay == 1) {
                  this.selectCurrency(e);
                }
              }
            );
          }
        });
      },
      (error) => {
        this.setState({
          loading: false,
        });
      }
    );
  };

  adminBankDetails = () => {
    getAdminBankDetails().then(
      (resp) => {
        this.setState({
          bank: resp.data,
        });
      },
      (error) => {}
    );
  };

  changeTab = (newValue) => {
    this.setState({
      content: [
        {
          date: '16:23, 12 dec 2018',
          amount: '0.0008',
          currency: 'BTC',
          tx_hash: 'sdfsldslksfJLKkLsdKJLKJKlkjkjj23423',
        },
      ],
      currentTab: newValue,
    });
  };

  render() {
    return (
      <div className="container my-wall-container depositPage">
        <div className="row mt-2 mobileNavRow">
          {/* <!-- left column --> */}
          <div className="col-sm empty-container-with-out-border left-column">
            <WalletMenu {...this.props} />
          </div>
          <div
            className="col-sm empty-container-with-border center-column mobileProfile"
            style={{ height: '100%' }}
          >
            <MobileNav />
            <div className="centerWrapper">
              <WalletMenuMobile {...this.props} />
              <TabsUI
                tabs={['Cryptocurrency', 'Bank Wire']}
                type="transactions"
                className="noBorder"
                currentTab={this.state.currentTab}
                changeTab={this.changeTab}
              />

              <div
                className={`tab row m--1 mt-2 ${
                  this.state.currentTab != 0 && 'd-none'
                }`}
              >
                <div className="col-md-5 p-1">
                  <div className="bordered depositeBox">
                    <CoinSelector selectCoin={this.selectCurrency} />
                  </div>
                </div>
                <div className="col-md-7 p-1">
                  {this.state.currentCoin == null ? (
                    <div className="bordered p-3">
                      <p>Select a coin from the list</p>
                    </div>
                  ) : (
                    <div className="bordered p-3">
                      {this.state.loading ? (
                        <Spinner />
                      ) : (
                        <div>
                          <div className="qrImgHold">
                            {this.state.currentCoin != null &&
                            this.state.currentCoin.address != undefined &&
                            this.state.currentCoin.address != null &&
                            this.state.currentCoin.address != '' ? (
                              <QRCode
                                value={this.state.currentCoin.address}
                                className="qrImg"
                              />
                            ) : null}
                          </div>
                          <label>
                            Scan QR Code or Copy address to deposit{' '}
                            {this.state.currentCoin.currencySymbol}
                          </label>

                          <div className="d-flex justify-content-start align-items fileButton">
                            <input
                              className="dark-bordered-input"
                              type="text"
                              placeholder="Wallet Address"
                              id="wal1"
                              value={this.state.currentCoin.address}
                            />
                            <button
                              className="filebrowseBtn_right"
                              onClick={(e) => this.copyThis(e, 'address')}
                              data-target="wal1"
                            >
                              Copy
                            </button>
                          </div>
                          {this.state.currentCoin.currencySymbol == 'XRP' ? (
                            <>
                              <label className="mt-3">Tag</label>

                              <div className="d-flex justify-content-start align-items fileButton">
                                <input
                                  className="dark-bordered-input"
                                  type="text"
                                  placeholder="Destination Tag"
                                  id="wal2"
                                  value={this.state.currentCoin.tag}
                                />
                                <button
                                  className="filebrowseBtn_right"
                                  onClick={(e) => this.copyThis(e, 'tag')}
                                  data-target="wal2"
                                >
                                  Copy
                                </button>
                              </div>
                            </>
                          ) : null}
                          <div className="note">
                            <p>
                              <strong>Note:</strong>
                            </p>
                            <p>
                              Minimum deposit is 0.001{' '}
                              {this.state.currentCoin.currencySymbol}, deposits
                              below that can not be recovered and would be lost
                              forever. Deposit only{' '}
                              {this.state.currentCoin.currencySymbol} to this
                              address. Minimum 30 blockchain confirmations
                              requied.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="subtitle mt-3 px-1">Recent Received</h3>
                <div className="table-responsive px-1">
                  <table className="table hisTable">
                    <tbody>
                      {this.state.received.map((e, i) => (
                        <tr className="whiteBg" key={i}>
                          <td className="time">{e.date}</td>
                          <td>
                            <img src={e.images} className="smallPic" />
                          </td>
                          <td>
                            <span className="fa fa-arrow-left" /> {e.hash}
                          </td>
                          <td className="amount">
                            {e.amount} {e.currencySymbol}{' '}
                            <span className="fa fa-check" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {this.state.reset ? (
                <Spinner />
              ) : (
                <div
                  className={`tab mt-3 p-2 bordered ${
                    this.state.currentTab != 1 && 'd-none'
                  }`}
                >
                  {this.props.samsubStatus !== 'Accept' &&
                    !this.state.loading && (
                      <div className="col-sm empty-container-with-border center-column">
                        <p className="text-danger text-center mt-4">
                          Finish KYC to use this feature
                        </p>
                        <div className="text-center">
                          <A href="/wallet/verification">
                            <button className="btn btn-main">
                              Go to Verification
                            </button>
                          </A>
                        </div>
                      </div>
                    )}
                  {!this.state.loading &&
                    this.props.samsubStatus === 'Accept' && (
                      <div>
                        <div className="note">
                          <p>
                            <strong>Wire Transfer Deposit-Bank Wire</strong>
                          </p>

                          <p>
                            <strong>
                              Deposit to your account using the information
                              below. You&apos;ll need to contact your bank for
                              specific instructions.
                            </strong>
                          </p>
                          <ul>
                            <li>
                              Be sure to include the &rsquo;Reference&rsquo;
                              code given below- this code identifies the deposit
                              with your account.
                            </li>
                            <li>
                              Don&apos;t exceed your daily or monthly funding
                              limits. If you exceed the limits, your account
                              will be frozen until you get verified for higher
                              limits or until the funds are returned to you.
                            </li>
                            <li>
                              Fees listed are what our bank charge us. Other
                              banks used during the transfer may charge
                              additional fees and are out of our control.
                            </li>
                            <li>
                              Multiple deposits of the same amounts within a few
                              days of each other may be delayed. If you must
                              make multiple deposit, consider sending different
                              amounts.
                            </li>
                            <li>
                              Important: The name on the bank account you are
                              depositing from must match the name entered for
                              verification on the Eclipton account you are
                              depositing into.
                            </li>
                            <li>
                              Fidor can accept international wire transfer
                              deposits (EUR only), but withdrawals can only be
                              sent to SEPA bank accounts.
                            </li>
                            <li>
                              Please be aware that Fidor can only accept Euro
                              transfers. Transfer sent in any other currency
                              will be rejected and returned to you
                              automatically.
                            </li>
                          </ul>
                        </div>

                        <div className="form-group mt-4">
                          <label>Bank Details</label>

                          {this.state.transCurrency == '' && (
                            <p className="text-danger text-small">
                              Choose a currency to see the bank details
                            </p>
                          )}
                          {this.state.bank == null ? (
                            <Spinner />
                          ) : (
                            this.state.bank.map(
                              (e, i) =>
                                e.currency == this.state.transCurrency &&
                                this.state.fields_enter == 1 && (
                                  <table className="table" key={i}>
                                    <tbody>
                                      <tr>
                                        <th width="200px">Account Name</th>
                                        <td>{e.acc_name}</td>
                                      </tr>
                                      <tr>
                                        <th width="200px">Address</th>
                                        <td>{e.address}</td>
                                      </tr>
                                      <tr>
                                        <th width="200px">Account Number</th>
                                        <td>{e.acc_number}</td>
                                      </tr>
                                      <tr>
                                        <th width="200px">IBAN</th>
                                        <td>{e.iban}</td>
                                      </tr>
                                      <tr>
                                        <th width="200px">Bank Name</th>
                                        <td>{e.bank_name}</td>
                                      </tr>
                                      <tr>
                                        <th width="200px">Bank Code</th>
                                        <td>{e.bank_code}</td>
                                      </tr>
                                      <tr>
                                        <th width="200px">Swift</th>
                                        <td>{e.swift_code}</td>
                                      </tr>
                                      <tr>
                                        <th width="200px">
                                          Bank/Branch Address
                                        </th>
                                        <td>{e.bank_address}</td>
                                      </tr>
                                      <tr>
                                        <th width="200px">Reference Code</th>
                                        <td>{e.reference_code}</td>
                                      </tr>
                                      <tr>
                                        <th width="200px">Currency</th>
                                        <td>{e.currency}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                )
                            )
                          )}
                        </div>

                        <div className="form-group mb-3">
                          <label>Transaction ID</label>
                          <input
                            type="text"
                            className="form-control"
                            required
                            placeholder="for Reference"
                            name="transId"
                            onChange={this.inputChange}
                          />
                        </div>
                        {this.state.transCurrency &&
                          this.state.transCurrency === 'EUR' && (
                            <div className="form-group mb-3">
                              <label>ClearJunction ID</label>
                              <input
                                type="text"
                                className="form-control"
                                required
                                placeholder="for Reference"
                                name="clearJunction"
                                onChange={this.inputChange}
                              />
                            </div>
                          )}

                        <div className="form-group mb-3">
                          <label>Amount</label>
                          <div className="d-flex justify-content-start align-items">
                            <select
                              className="form-control currencySelect"
                              name="transCurrency"
                              onChange={this.inputChange}
                            >
                              <option value="">Select</option>
                              {this.state.fiatCoins.length > 0 &&
                                this.state.fiatCoins.map((e, i) => (
                                  <option value={e.currencySymbol} key={i}>
                                    {e.currencySymbol}
                                  </option>
                                ))}
                            </select>
                            <input
                              className="form-control"
                              type="number"
                              placeholder="Amount"
                              name="transAmount"
                              onChange={this.inputChange}
                            />
                          </div>
                        </div>
                        <div className="form-group fileButton">
                          <label>Deposit Proof</label>
                          <FileBrowse
                            name="transProof"
                            type="upload"
                            fileChange={this.fileChange}
                            accept="image/*, application/pdf"
                          />
                        </div>

                        <div className="form-group mt-4 pt-2 d-flex align-items-center justify-content-end">
                          <button
                            className="secondaryBtn me-2 big"
                            onClick={this.fiatReset}
                          >
                            Reset
                          </button>
                          <button
                            className="primaryBtn"
                            onClick={this.fiatSubmit}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>

          <div className="col-sm empty-container-with-out-border right-column">
            <WalletAllBalance />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapCommonStateToProps)(WalletDeposit);
