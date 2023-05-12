import React from 'react';
import { alertBox, switchLoader } from '../../commonRedux';
import A from '../../components/A';
import Button from '../../components/Button';
import CoinSelector from '../../components/CoinSelector';
import WalletMenu from '../../components/Menu/WalletMenu';
import WalletMenuMobile from '../../components/Menu/WalletMenuMobile';
import Spinner from '../../components/Spinner/index';
import TabsUI from '../../components/Tabs/index';
import { formatDate } from '../../globalFunctions';
import WalletAllBalance from '../../components/Wallet/allBalance';
import walletCheck, { mapCommonStateToProps } from '../../hooks/walletCheck';
import {
  checkWithdrawal,
  getUserDetails,
  getUserWithdrawals,
  getWithdrawAddresses,
  withdrawRequest,
} from '../../http/wallet-calls';
import './styles.scss';
import { connect } from 'react-redux';

const WithdrawStatus = {
  0: 'Mail Sent',
  1: 'Pending',
  2: 'Completed',
  3: 'Cancelled',
  4: 'Cancelled',
  12: 'Transaction Failed',
};

const WithdrawType = {
  1: 'Fiat',
  0: 'Crypto',
};

function Enum({ state, enumVar }) {
  return <td>{enumVar[state]}</td>;
}

class WalletWithdraw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attempt: 0,
      addresses: [],
      loading: true,
      reset: false,
      tfa_status: null,
      with_pass: null,
      to: '',
      address: '',
      withdrawals: null,
      amountCurrency: '',
      amount: '',
      usdCurrency: '',
      usd: '',
      tfa: '',
      withPassword: '',
      note: '',
      tag: '',
      fee: 0,
      estUsd: 0,
      agree: false,
      takeFee: true,
      status: null,
      currentCoin: null,
      coins: null,
      content: 'loading',
      currentTab: 0,
      with_id: '',
      receiveamount: 0,
      refreshBal: false,
    };
    this.onUpdate = this.onUpdate.bind(this);
  }

  onUpdate(data) {
    this.setState({ refreshBal: true });
  }

  changeTab = (newValue) => {
    this.setState({ currentTab: newValue });
  };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const withdrawId = query.get('with_id');
    if (withdrawId) {
      this.setState(
        {
          with_id: withdrawId,
        },
        () => {
          this.withdrawStatusFromEmail();
        }
      );
    }
    this.getDetails();
    this.getWithdrawals();
    this.checkWallet();
  }

  checkWallet = () => {
    walletCheck().then(
      (resp) => {
        this.setState(
          {
            loading: false,
            status: this.props.samsubStatus,
          },
          () => {}
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

  withdrawStatusFromEmail = () => {
    checkWithdrawal({
      id: this.state.with_id,
    }).then(
      async (resp) => {
        if (resp.status == true) {
          alertBox(true, resp.Message, 'success');
          this.onUpdate();
          this.getWithdrawals();
        } else {
          alertBox(true, resp.Message);
        }
      },
      (error) => {
        console.log(error);
        alertBox(true, error == undefined ? 'Error' : error.toString());
      }
    );
  };

  getDetails = () => {
    getUserDetails().then(
      async (resp) => {
        this.setState({
          loading: false,
          tfa_status: resp.data.tfa_status,
          with_pass: resp.data.withPassword,
        });
      },
      (err) => {
        this.setState({
          loading: false,
        });
      }
    );
  };

  getAddresses = () => {
    getWithdrawAddresses({
      currency: this.state.currentCoin.currencySymbol,
    }).then(
      async (resp) => {
        if (resp.status == true) {
          this.setState({
            addresses: resp.data,
          });
        } else {
          this.setState({
            addresses: [],
          });
        }
      },
      (err) => {
        this.setState({
          loading: false,
        });
      }
    );
  };

  inputChange = (e) => {
    const val = e.target.value;
    const input = e.target.getAttribute('name');

    if (input == 'amount') {
      let { usd } = this.state;
      let { fee } = this.state;
      if (this.state.currentCoin != null) {
        usd = val / this.state.currentCoin.EstimatedUSD;
        fee = (val * this.state.currentCoin.withdrawfee) / 100;
      }
      this.setState({
        amount: val,
        usd,
        fee,
        receiveamount: val - fee,
      });
    } else if (input == 'intCurrency') {
      const estUsd = e.target.selectedOptions[0].getAttribute('data-usd');
      let { intUsd } = this.state;
      if (this.state.intAmount != '') {
        intUsd = this.state.intAmount * estUsd;
      }
      this.setState({
        intCurrency: val,
        estUsd,
        intUsd,
      });
    } else if (input == 'intAmount') {
      const temp = val * this.state.estUsd;
      this.setState({
        intAmount: val,
        intUsd: temp,
      });
    } else if (val == 'check') {
      this.setState({
        [input]: !this.state[input],
      });
    } else if (input == 'to') {
      const Addrid = e.target.selectedOptions[0].getAttribute('data-id');

      const filterArray = this.state.addresses.filter((el) => el._id == val);

      if (filterArray.length > 0) {
        if (this.state.currentCoin.currencySymbol == 'XRP') {
          this.setState({
            tag: filterArray[0].tag,
            address: filterArray[0].address,
            to: val,
          });
        } else {
          this.setState({
            address: filterArray[0].address,
            to: val,
          });
        }
      }
    } else {
      this.setState({
        [input]: val,
      });
    }
  };

  getWithdrawals = () => {
    getUserWithdrawals().then(
      async (resp) => {
        this.setState({
          withdrawals: resp.data,
          error: '',
        });
      },
      (error) => {}
    );
  };

  selectCurrency = (cur) => {
    this.setState({
      currentCoin: '',
      to: '',
      address: '',
      withPassword: '',
      receiveamount: 0,
      note: '',
      tag: '',
      tfa: '',
      usd: 0,
      fee: 0,
      amount: 0,
    });
    let { usd } = this.state;
    let { fee } = this.state;
    this.setState(
      {
        currentCoin: cur,
      },
      () => {
        this.getAddresses();
      }
    );
    if (cur != null && this.state.amount != '' && this.state.amount > 0) {
      usd = this.state.amount / cur.EstimatedUSD;
      fee = (this.state.amount * cur.withdrawfee) / 100;

      this.setState(
        {
          usd,
          fee,
          receiveamount: this.state.amount - fee,
        },
        () => {}
      );
    }
  };

  submit = () => {
    if (!this.state.agree) {
      alertBox(
        true,
        'You need to agree to the terms and conditions in order to continue!'
      );
    } else if (
      this.state.currentCoin == null ||
      this.state.to == '' ||
      this.state.amount == '' ||
      this.state.tfa == '' ||
      this.state.withPassword == ''
    ) {
      alertBox(true, 'Please fill all required fields');
    } else {
      switchLoader('Submitting Transfer Request...');
      const data = {
        withcurrency: this.state.currentCoin._id,
        toAddress: this.state.address,
        withPassword: this.state.withPassword,
        withamount: Number(this.state.amount),
        withType: this.state.takeFee ? 1 : 0,
        fees: this.state.currentCoin.withdrawfee,
        receiveamount: this.state.receiveamount.toFixed(8),
        note: this.state.note,
        tag: this.state.tag,
        tfa: Number(this.state.tfa),
        url: process.env.REACT_APP_WITHDRAW_URL,
        Withdraw_Type: 'Internal',
      };

      withdrawRequest(data).then(
        async (resp) => {
          try {
            if (resp.status == true) {
              this.reset();
              this.getWithdrawals();
              alertBox(true, resp.Message, 'success');
            } else {
              alertBox(true, resp.Message);
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

  reset = () => {
    this.setState({
      reset: true,

      to: '',
      address: '',
      withPassword: '',
      receiveamount: 0,
      note: '',
      tag: '',
      tfa: '',
      usd: 0,
      fee: 0,
      amount: 0,
    });
    setTimeout(() => {
      this.setState({
        reset: false,
      });
    }, 200);
  };

  render() {
    return (
      <div className="container my-wall-container depositPage">
        <div className="row mt-2">
          <div className="col-sm empty-container-with-out-border left-column">
            <WalletMenu {...this.props} />
          </div>
          {this.state.loading && (
            <div className="col-sm empty-container-with-border center-column">
              <Spinner />
            </div>
          )}
          {this.props.samsubStatus != 'Accept' && !this.state.loading && (
            <div className="col-sm empty-container-with-border center-column">
              <p className="text-danger text-center mt-4">
                Finish KYC to use this feature
              </p>
              <div className="text-center">
                <A href="/wallet/verification">
                  <button className="btn btn-main">Go to Verification</button>
                </A>
              </div>
            </div>
          )}
          {!this.state.loading && this.props.samsubStatus == 'Accept' && (
            <div className="col-sm empty-container-with-border center-column">
              <WalletMenuMobile {...this.props} />
              <TabsUI
                tabs={['Withdraw', 'Recent Withdraw']}
                type="transactions"
                className="noBorder"
                currentTab={this.state.currentTab}
                changeTab={this.changeTab}
              />
              {this.state.reset ? (
                <Spinner />
              ) : this.state.tfa_status != 1 || this.state.with_pass == '' ? (
                <div className="d-flex align-items-center justify-content-center flex-column p-4">
                  <p>
                    You need to complete the below steps in order to withdraw
                  </p>
                  {this.state.tfa_status != 1 && (
                    <div className="mt-2">
                      <Button variant="primaryBtn" size="big">
                        <A href="/wallet/tfa">Enable TFA</A>
                      </Button>
                    </div>
                  )}
                  {this.state.with_pass == '' && (
                    <div className="mt-4">
                      <Button variant="primaryBtn" size="big">
                        <A href="/wallet/password">Set Withdrawal Password</A>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
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
                      <p className="p-4 text-center">
                        Choose a coin from the list
                      </p>
                    ) : (
                      <div className="bordered p-3">
                        <div className="form-group">
                          <label>To Address</label>
                          {this.state.addresses.length > 0 ? (
                            <select
                              value={this.state.to}
                              className="form-control"
                              placeholder="Wallet Address"
                              name="to"
                              onChange={this.inputChange}
                            >
                              <option value="">Select</option>
                              {this.state.addresses.map((el, i) => (
                                <option
                                  value={el._id}
                                  data-id={el.address}
                                  key={i}
                                >
                                  {el.name} - {el.address}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="">
                              <Button variant="primaryBtn mb-2">
                                <A
                                  href={`/wallet/address/${this.state.currentCoin.currencySymbol}`}
                                >
                                  <i className="fa fa-plus" /> Add Address
                                </A>
                              </Button>
                            </div>
                          )}
                        </div>
                        {this.state.addresses.length > 0 &&
                          this.state.currentCoin.currencySymbol == 'XRP' && (
                            <div className="form-group">
                              <label>Tag </label>

                              <input
                                type="text"
                                className="form-control"
                                autoComplete="off"
                                placeholder="Tag"
                                name="tag"
                                onChange={this.inputChange}
                                value={this.state.tag}
                                readOnly
                              />
                            </div>
                          )}
                        <div className="form-group">
                          <label>Amount</label>
                          <div className="d-flex justify-content-start align-items">
                            <input
                              type="text"
                              className="form-control currencySelect"
                              name="amountCurrency"
                              value={
                                this.state.currentCoin == null
                                  ? ''
                                  : this.state.currentCoin.currencySymbol
                              }
                              readOnly
                            />
                            <input
                              className="form-control"
                              type="number"
                              min="0"
                              placeholder="Amount"
                              name="amount"
                              onChange={this.inputChange}
                              value={this.state.amount}
                            />
                          </div>
                          <div className="mt-3 d-flex justify-content-start align-items">
                            <input
                              type="text"
                              className="form-control currencySelect"
                              name="usdCurrency"
                              readOnly
                              value="USD"
                            />
                            <input
                              className="form-control"
                              type="number"
                              min="0"
                              placeholder="Amount"
                              name="usd"
                              onChange={this.inputChange}
                              value={
                                this.state.usd
                                  ? this.state.usd.toFixed(8)
                                  : this.state.usd
                              }
                              readOnly
                            />
                          </div>

                          <small>
                            <p className="mt-1">
                              Receiving Amount:{' '}
                              {Number(this.state.receiveamount).toFixed(8)}
                            </p>
                          </small>
                        </div>
                        <div className="form-group">
                          <label>TFA </label>

                          <input
                            type="number"
                            className="form-control"
                            autoComplete="off"
                            placeholder="Google Authenticator Code"
                            name="tfa"
                            onChange={this.inputChange}
                            value={this.state.tfa}
                          />
                        </div>
                        <div className="form-group mt-3">
                          <label>Withdraw Password </label>

                          <input
                            type="password"
                            className="form-control"
                            placeholder="Withdraw Password"
                            name="withPassword"
                            onChange={this.inputChange}
                            value={this.state.withPassword}
                          />
                          <A href="/wallet/repassword" className="text-main">
                            <small>Reset Withdrawal Password</small>
                          </A>
                        </div>

                        <div className="form-group mt-2">
                          <label>Note</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Write a message (eg: Thanks for fast delivery)"
                            name="note"
                            onChange={this.inputChange}
                            value={this.state.note}
                          />
                        </div>
                        <div className="form-check mt-1">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="agree"
                            value="check"
                            onChange={this.inputChange}
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          >
                            I agree to the{' '}
                            <A
                              href={`${process.env.REACT_APP_FRONTEND}terms-and-conditions.pdf`}
                              target="_BLANK"
                              className="text-main"
                            >
                              Terms & Conditions
                            </A>
                          </label>
                        </div>

                        <div className="form-group mt-80 d-flex align-items-center justify-content-end">
                          <button
                            className="secondaryBtn"
                            onClick={this.submit}
                          >
                            Request Withdraw
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div
                className={`tab mt-3${this.state.currentTab != 1 && 'd-none'}`}
                style={{ overflowX: 'auto' }}
              >
                <div className="tableHold mt-3">
                  <table className="table">
                    <thead>
                      <tr className="whiteBg titleClr">
                        <td>Date & Time</td>
                        <td>Currency</td>
                        <td>Transaction ID</td>
                        <td>Amount</td>
                        <td>Type</td>
                        <td>Reason</td>
                        <td>Status</td>
                        {/* <td>Action</td> */}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.withdrawals == null ||
                      this.state.withdrawals.length == 0 ? (
                        // <Spinner />
                        <tr>
                          <td colSpan="7">
                            <p className="no-found">No Data Found</p>
                          </td>
                        </tr>
                      ) : null}
                      {this.state.withdrawals != null &&
                      this.state.withdrawals.length > 0
                        ? this.state.withdrawals.map((e, i) => (
                            <tr key={i}>
                              <td className="time">{formatDate(e.date)}</td>
                              <td className="time">{e.currencySymbol}</td>
                              <td className="time">
                                {e.txhash != '' ? e.txhash : '--'}
                              </td>
                              <td className="time">{e.amount}</td>
                              {/* <td className="time">{e.withType}</td> */}
                              <Enum state={e.withType} enumVar={WithdrawType} />
                              <td className="time">
                                {e.status == 3
                                  ? 'Cancelled By User'
                                  : e.status == 4
                                  ? 'Cancelled By Admin'
                                  : e.reason != ''
                                  ? e.reason
                                  : e.rejectReason != ''
                                  ? e.rejectReason
                                  : '----'}
                              </td>
                              <td className="time">
                                {e.status == 2 &&
                                e.fireblockStatus != 'COMPLETED' ? (
                                  'Processing'
                                ) : (
                                  <Enum
                                    state={e.status}
                                    enumVar={WithdrawStatus}
                                  />
                                )}
                              </td>
                              {/* <td className="time">{e.status} <span className="dot bg-warning"></span></td> */}
                              {/* <td><A className="text-main" href="">View</A></td> */}
                            </tr>
                          ))
                        : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* <!-- end center column --> */}
          <div className="col-sm empty-container-with-out-border right-column">
            {this.state.reset ? (
              <Spinner />
            ) : (
              <WalletAllBalance refreshBal={this.state.refreshBal} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapCommonStateToProps)(WalletWithdraw);
