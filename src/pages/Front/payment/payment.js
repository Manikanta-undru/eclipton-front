import React, { Component } from 'react';

import { alertBox, switchLoader } from '../../../commonRedux';
import {
  mapCommonStateToProps,
  updateKycState,
} from '../../../hooks/walletCheck';
import {
  getUserDetails,
  PaymentRequest,
  getBalanceConverstion,
  getCryptoBalance,
} from '../../../http/wallet-calls';
import Spinner from '../../../components/Spinner';

import { GetAssetImage } from '../../../globalFunctions';
import '../style.scss';
import './style.scss';
import { connect } from 'react-redux';

class PaymentWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PaymentID: '',
      MerchantName: '',
      Amount: '',
      Fee: '',
      emptybal: false,
      merchant_url: '',
      success_url: '',
      cancel_url: '',
      webhook_url: '',
      tfa: '',
      buyModal: false,
      seller_perferred: '',
      agree: false,
      coins: [],
      balance: 0,
      loading: false,
      CustomerCurrency: '',
      estimatedAmount: 0,
    };
  }

  selectCurency = (e) => {
    this.setState({
      CustomerCurrency: e.target.value,
    });
  };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);

    this.setState({
      PaymentID: query.get('PaymentID'),
      MerchantName: query.get('MerchantName'),
      Amount: query.get('Amount'),
      Fee: query.get('Fee'),
      seller_perferred: query.get('Currency'),
      merchant_url: query.get('merchant_url'),
      success_url: query.get('success_url'),
      cancel_url: query.get('cancel_url'),
      webhook_url: query.get('webhook_url'),
    });
    if (!query.get('PaymentID')) {
      window.location.href = `${this.state.cancel_url}?status=cancelled`;
    } else if (
      !query.get('MerchantName') ||
      !query.get('Amount') ||
      !query.get('Currency') ||
      !query.get('Fee') ||
      !query.get('merchant_url') ||
      !query.get('success_url') ||
      !query.get('cancel_url') ||
      !query.get('webhook_url')
    ) {
      window.location.href = `${this.state.cancel_url}?paymentId=${query.get(
        'PaymentID'
      )}&status=cancelled`;
    }
    if (!this.props.samsubStatus) {
      updateKycState(this.props.currentUser);
      this.getDetails();
    }

    this.allBalance();
  }

  checkWallet = () => {
    console.log(this.props.samsubStatus, 'this.props.samsubStatus');
    if (this.props.samsubStatus == 'Accept') {
      this.setState({
        buyModal: true,
      });
    } else {
      console.log('false the modal');

      this.setState({
        loading: false,
      });
    }
  };

  allBalance = () => {
    getCryptoBalance().then(
      async (resp) => {
        this.setState({ coins: resp.data });

        let balance = 0;
        let CheckBal = 0;
        resp.data.forEach((element) => {
          const convertBal = element.balance / element.EstimatedUSD;
          if (element.balance == 0) {
            CheckBal += 1;
          }
          if (CheckBal == resp.data.length) {
            this.setState({
              emptybal: true,
            });
          }
          balance += convertBal;
        });
        this.setState({
          balance,
          loading: false,
        });
      },
      (error) => {}
    );
  };

  toggleBody = () => {
    const body = document.getElementById('walletWidgetBody');
    if (body.classList.contains('open')) {
      body.classList.remove('open');
    } else {
      body.classList.add('open');
    }
  };

  getDetails = () => {
    getUserDetails().then(
      async (resp) => {
        this.setState({
          loading: false,
          tfa_status: resp.data.tfa_status,
          with_pass: resp.data.withPassword,
        });
        this.checkWallet();
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

    this.setState({
      [input]: val,
    });
  };

  cancel = () => {
    window.location.href = `${this.state.cancel_url}?paymentId=${this.state.PaymentID}&status=cancelled`;
  };

  buttonCallFunction = () => {
    if (!this.state.agree) {
      alertBox(
        true,
        'You need to agree to the terms and conditions in order to continue!'
      );
    } else if (this.state.CustomerCurrency != '') {
      if (
        this.state.seller_perferred != '' &&
        this.state.Amount != '' &&
        this.state.Amount > 0
      ) {
        const data = {
          secondcurrency: this.state.CustomerCurrency,
          firstcurrency: this.state.seller_perferred,
          amount: this.state.Amount,
        };
        getBalanceConverstion(data).then(async (resp) => {
          if (resp.status == true) {
            this.setState({
              estimatedAmount: resp.data,
            });
            this.setState({
              buyModal: false,
            });
          } else {
            alertBox(true, 'Something went wrong');
            window.location.href = `${this.state.cancel_url}?paymentId=${this.state.PaymentID}&status=cancelled`;
          }
        });
      } else {
        alertBox(true, 'Something went wrong');
        window.location.href = `${this.state.cancel_url}?paymentId=${this.state.PaymentID}&status=cancelled`;
      }
    } else {
      alertBox(true, 'Please choose the currency');
    }
  };

  submit = () => {
    if (
      this.state.CustomerCurrency == null ||
      this.state.merchant_url == '' ||
      this.state.Amount == '' ||
      this.state.tfa == '' ||
      this.state.withPassword == ''
    ) {
      alertBox(true, 'Please fill all required fields');
    } else {
      switchLoader('Submitting Transfer Request...');
      const data = {
        merchant_url: this.state.merchant_url,
        withPassword: this.state.withPassword,
        withamount: Number(this.state.estimatedAmount),
        withType: this.state.takeFee ? 1 : 0,
        fees: this.state.Fee,
        tfa: Number(this.state.tfa),
        url: process.env.REACT_APP_WITHDRAW_URL,
        Withdraw_Type: 'External',
        PaymentID: this.state.PaymentID,
        MerchantName: this.state.MerchantName,
        withcurrency: this.state.CustomerCurrency,
        success_url: this.state.success_url,
        cancel_url: this.state.cancel_url,
        webhook_url: this.state.webhook_url,
      };

      PaymentRequest(data).then(
        async (resp) => {
          try {
            if (resp.status == true) {
              alertBox(true, resp.Message, 'success');
              if (resp.txid && resp.txid != '') {
                window.location.href =
                  `${this.state.success_url}?paymentId=${this.state.PaymentID}&status=success` +
                  `&txid=${resp.txid}&currency=${
                    this.state.CustomerCurrency
                  }&amount=${Number(this.state.estimatedAmount)}`;
              } else {
                window.location.href = `${this.state.cancel_url}?paymentId=${this.state.PaymentID}&status=cancelled`;
              }
            } else {
              alertBox(true, resp.Message);
              if (!resp.failedreason) {
                window.location.href = `${this.state.cancel_url}?paymentId=${this.state.PaymentID}&status=cancelled`;
              }
            }
          } catch (error) {
            alertBox(true, error == undefined ? 'Error' : error.toString());
            window.location.href = `${this.state.cancel_url}?paymentId=${this.state.PaymentID}&status=cancelled`;
          }
          switchLoader();
        },
        (error) => {
          alertBox(true, error == undefined ? 'Error' : error.toString());
          window.location.href = `${this.state.cancel_url}?paymentId=${this.state.PaymentID}&status=cancelled`;
          switchLoader();
        }
      );
    }
  };

  render() {
    return (
      <div>
        <div
          style={{ display: `${this.state.buyModal ? 'block' : 'none'}` }}
          className="buyModal"
        >
          <div className="buyModal_body">
            <div className="design-price" style={{ paddingTop: '1rem' }}>
              <div className="row">
                <ul className="list-group ">
                  {!this.state.emptybal ? (
                    <li
                      style={{ height: ' auto' }}
                      className="list-group-item d-flex justify-content-between align-items-start flex-column header-dark px-3 py-4 rounded-3 shadow-sm "
                    >
                      <div className="premium-design-price">
                        <b>
                          Total {this.state.seller_perferred} :{' '}
                          {this.state.Amount}
                        </b>
                      </div>

                      <div style={{ height: 'auto', marginTop: '1rem' }}>
                        <b>Available currency</b>

                        <div
                          className={`row empty-inner-container-with-out-border widget allBalance ${
                            this.props.variant != null &&
                            ` ${this.props.variant}`
                          }`}
                        >
                          <div className="col">
                            <div
                              className="widgetBody open"
                              id="walletWidgetBody"
                            >
                              <div className="balances">
                                {this.state.loading ? (
                                  <Spinner />
                                ) : (
                                  this.state.coins.length > 0 &&
                                  this.state.coins.map((e, i) =>
                                    e.balance > 0 ? (
                                      <div className="row itemrow" key={i}>
                                        <div className="col-md-7">
                                          <div className="item">
                                            <input
                                              type="radio"
                                              name="CustomerCurrency"
                                              value={e.currencySymbol}
                                              onClick={this.selectCurency}
                                            />

                                            <img src={e.image} />
                                            <div>
                                              <h4 className="currency">
                                                {e.currencyName}
                                              </h4>
                                              <div className="balance">
                                                {e.balance?.toFixed(8)}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-5">
                                          <div className="right">
                                            <div className="usd">
                                              {' '}
                                              {this.state.seller_perferred}
                                            </div>
                                            {this.state.seller_perferred ==
                                            'USD' ? (
                                              <div className="usd-balance">
                                                {(
                                                  e.balance / e.EstimatedUSD
                                                )?.toFixed(8)}
                                              </div>
                                            ) : this.state.seller_perferred ==
                                              'EUR' ? (
                                              <div className="eur-balance">
                                                {(
                                                  e.balance / e.EstimatedEUR
                                                )?.toFixed(8)}
                                              </div>
                                            ) : this.state.seller_perferred ==
                                              'INR' ? (
                                              <div className="inr-balance">
                                                {(
                                                  e.balance / e.EstimatedINR
                                                )?.toFixed(8)}
                                              </div>
                                            ) : this.state.seller_perferred ==
                                              'SGD' ? (
                                              <div className="sgd-balance">
                                                {(
                                                  e.balance / e.EstimatedSGD
                                                )?.toFixed(8)}
                                              </div>
                                            ) : this.state.seller_perferred ==
                                              'GBP' ? (
                                              <div className="gbp-balance">
                                                {(
                                                  e.balance / e.EstimatedGBP
                                                )?.toFixed(8)}
                                              </div>
                                            ) : (
                                              0
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ) : null
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div style={{ marginTop: '0' }}>
                          <div className="form-group agree-form">
                            <div className="checkbox ms-1 align-items-start">
                              <input
                                type="checkbox"
                                name="extAgree"
                                value={this.state.agree}
                                onClick={() => {
                                  this.setState({ agree: !this.state.agree });
                                }}
                              />
                              <span>I agree to the</span>{' '}
                              <a
                                href={`${process.env.REACT_APP_FRONTEND}terms-and-conditions.pdf`}
                                target="_BLANK"
                                className="text-main"
                                rel="noreferrer"
                              >
                                Terms & Conditions
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <br />
                      {/* <p>{enableEditButton || enablePremiumEditButton ? 'You have successfully initiated the handshake' : ''}</p> */}
                      <button
                        className="continueBtn button success mutal payment_btn mx-auto"
                        onClick={this.buttonCallFunction}
                      >
                        {' '}
                        Checkout{' '}
                      </button>
                    </li>
                  ) : (
                    <div className="col-sm empty-container-with-border center-column">
                      <p className="text-danger text-center mt-4">
                        {`You Don't have any balance in all currency .Please
                        Deposit balance`}
                      </p>
                      <div className="text-center">
                        <button
                          className="lightGreen_btn"
                          onClick={this.cancel}
                        >
                          Ok
                        </button>
                      </div>
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="creditCardPage">
          <div className="row">
            <div className="col-md-12">
              <nav>
                <div className="logo">
                  <img src={GetAssetImage('landing-logo.png')} alt="" />
                </div>
              </nav>
            </div>

            <div className="col-md-12 align-middle text-wrap">
              <div className="text-block">
                <div
                  className="swipe-lux-container"
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  {this.props.samsubStatus != 'Accept' &&
                  !this.state.loading ? (
                    <div className="col-sm  swipelux_widget">
                      <p className="text-danger text-center mt-4">
                        Finish KYC to use this feature
                      </p>
                      <div className="text-center">
                        <button
                          className="lightGreen_btn"
                          onClick={this.cancel}
                        >
                          Ok
                        </button>
                      </div>
                    </div>
                  ) : this.state.tfa_status != 1 ||
                    this.state.with_pass == '' ? (
                    <div className="d-flex align-items-center justify-content-center flex-column p-4 swipelux_widget">
                      <p>
                        You need to complete the below steps in order to
                        withdraw
                      </p>
                      {this.state.tfa_status != 1 && (
                        <div className="mt-2">Please Enable TFA</div>
                      )}
                      {this.state.with_pass == '' && (
                        <div className="mt-4">Pleasse set tfa password</div>
                      )}
                      <div className="text-center">
                        <button
                          className="lightGreen_btn"
                          onClick={this.cancel}
                        >
                          Ok
                        </button>
                      </div>
                    </div>
                  ) : (
                    !this.state.loading &&
                    this.props.samsubStatus == 'Accept' && (
                      <div className="swipelux_widget">
                        <h4 className="text-center">Payment Summary</h4>

                        <div className="table-responsive">
                          <table className="table payment">
                            <tbody>
                              <tr>
                                <td className="noborder">Payment ID</td>
                                <td className="text-right second">
                                  {' '}
                                  {this.state.PaymentID}
                                </td>
                              </tr>

                              <tr>
                                <td>Total Amount</td>
                                <td className="text-right second">
                                  {this.state.estimatedAmount}{' '}
                                  {this.state.CustomerCurrency}
                                </td>
                              </tr>
                              <tr>
                                <td>Fee Amount</td>
                                <td className="text-right second">
                                  {this.state.Fee} {this.state.CustomerCurrency}
                                </td>
                              </tr>
                              <tr>
                                <td>Total</td>
                                <td className="text-right second">
                                  {Number(this.state.estimatedAmount) +
                                    Number(this.state.Fee)}{' '}
                                  {this.state.CustomerCurrency}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="d-flex justify-content-start align-items">
                          <input
                            className="form-control"
                            type="text"
                            autoComplete="off"
                            placeholder="Google Authenticator Code"
                            name="tfa"
                            onChange={this.inputChange}
                            value={this.state.tfa}
                          />
                        </div>
                        <br />
                        <div className="d-flex justify-content-start align-items">
                          <input
                            className="form-control"
                            type="password"
                            placeholder="Withdraw Password"
                            name="withPassword"
                            onChange={this.inputChange}
                            value={this.state.withPassword}
                          />
                        </div>
                        <br />

                        <div className="d-flex btnGrp">
                          <button
                            className="button success mutal payment_btn me-4"
                            onClick={this.submit}
                          >
                            Pay
                          </button>
                          <button
                            className="button danger mutal payment_btn"
                            onClick={this.cancel}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapCommonStateToProps)(PaymentWallet);
