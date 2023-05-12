import React from 'react';
import { alertBox, switchLoader } from '../../commonRedux';
import A from '../../components/A';
import WalletMenu from '../../components/Menu/WalletMenu';
import WalletMenuMobile from '../../components/Menu/WalletMenuMobile';
import Spinner from '../../components/Spinner/index';
import TabsUI from '../../components/Tabs/index';
import WalletAllBalance from '../../components/Wallet/allBalance';
import { mapCommonStateToProps } from '../../hooks/walletCheck';
import {
  externalTransfer,
  getAllBalance,
  getAllPairs,
  internalTransfer,
  externalepayTransfer,
} from '../../http/wallet-calls';
import './styles.scss';
import {
  createExternalTransaction,
  createInternalTransaction,
} from '../../http/trans-calls';
import { getCurrentUser } from '../../http/token-interceptor';
import { connect } from 'react-redux';
import { displayApplicantDataForFe } from '../../http/http-calls';

const currentUser = JSON.parse(getCurrentUser());

class WalletTransfer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attempt: 0,
      estUsd: 0,
      filterCurrency: 'USD',
      resetExt: false,
      resetInt: false,
      extCurrency: '',
      intCurrency: '',
      extEmail: '',
      extAmount: '',
      extUsd: '',
      extAgree: false,
      extSave: false,
      extNote: '',
      intFrom: '',
      intTo: '',
      intAmount: '',
      status: null,
      intUsd: '',
      loading: true,
      coins: null,
      balances: null,
      content: 'loading',
      currentTab: 0,
      refer_site: 'eclipton',
      refer_id: '',
      checkoutType: '',
      fiatcurrency: '',
      refreshBal: false,
    };
    this.onUpdate = this.onUpdate.bind(this);
  }

  onUpdate(data) {
    this.setState({ refreshBal: true });
  }

  componentDidMount() {
    const thePath = this.props.location.pathname;
    const { search } = this.props.location;
    const refer = new URLSearchParams(search).get('refer');
    const refer_mail = new URLSearchParams(search).get('email');
    const orderId = new URLSearchParams(search).get('orderid');
    const amount = new URLSearchParams(search).get('amount');
    const checkoutType = new URLSearchParams(search).get('checkoutType');
    const fiatcurrency = new URLSearchParams(search).get('currency');

    if (
      refer != undefined &&
      refer != null &&
      refer_mail != undefined &&
      refer_mail != null &&
      orderId != undefined &&
      orderId != null &&
      amount != undefined &&
      amount != null &&
      checkoutType != undefined &&
      checkoutType != null &&
      fiatcurrency != undefined &&
      fiatcurrency != null
    ) {
      this.setState({ extEmail: refer_mail });
      this.setState({ refer_site: refer });
      this.setState({ refer_id: orderId });
      this.setState({ extUsd: amount });
      this.setState({ checkoutType });
      this.setState({ fiatcurrency });
    }
    this.checkWallet();
  }

  checkWallet = () => {
    const {
      walletDetails: { cognito_id },
    } = this.props.currentUser;

    displayApplicantDataForFe({ cognitoUserId: cognito_id }).then((res) => {
      const samStatus = res?.data?.applicantStatus || res?.data?.status;

      this.setState(
        {
          loading: false,
        },
        () => {
          if (samStatus == 'Accept') {
            this.allPairs();
          }
        }
      );
    });
  };

  inputChange = (e) => {
    const val = e.target.value;
    const input = e.target.getAttribute('name');
    if (input == 'extCurrency') {
      const estUsd = e.target.selectedOptions[0].getAttribute('data-usd');
      const amt = 1;
      const extUsd = Number(amt) / Number(estUsd);
      this.setState({
        extAmount: amt,
        extCurrency: val,
        estUsd,
        extUsd,
      });
    } else if (input == 'extAmount') {
      const temp = Number(val) / Number(this.state.estUsd);
      this.setState({
        extAmount: val,
        extUsd: temp,
      });
    } else if (input == 'extUsd') {
      const temp = Number(val) * Number(this.state.estUsd);
      this.setState({
        extAmount: temp,
        extUsd: val,
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
      const temp = val / this.state.estUsd;
      this.setState({
        intAmount: val,
        intUsd: temp,
      });
    } else if (val == 'check') {
      this.setState({
        [input]: !this.state[input],
      });
    } else if (input == 'intTo') {
      if (val != '') {
        if (this.state.intFrom == val) {
          alertBox(true, 'You cannot transfer funds between same wallet');
        } else {
          this.setState({
            [input]: val,
          });
        }
      } else {
        alertBox(true, 'Please select transfer to wallet');
      }
    } else if (input == 'intFrom') {
      if (val != '') {
        if (this.state.intTo == val) {
          alertBox(true, 'You cannot transfer funds between same wallet');
        } else {
          this.setState({
            [input]: val,
          });
        }
      } else {
        alertBox(true, 'Please select transfer from wallet');
      }
    } else {
      this.setState({
        [input]: val,
      });
    }
  };

  resetExt = () => {
    this.setState({
      extCurrency: '',
      extEmail: '',
      extAmount: '',
      extUsd: '',
      extAgree: false,
      extSave: false,
      extNote: '',
      refreshBal: false,
    });
  };

  resetInt = () => {
    this.setState({
      intCurrency: '',
      intFrom: '',
      intTo: '',
      intAmount: '',
      intUsd: '',
      refreshBal: false,
    });
  };

  submitExt = () => {
    console.log(this.state.extAmount);
    if (!this.state.extAgree) {
      alertBox(
        true,
        'You need to agree to the terms and conditions in order to continue!'
      );
    } else if (this.state.extAmount <= 0) {
      alertBox(true, 'Amount should be greater than 0');
    } else if (
      this.state.extCurrency == '' ||
      this.state.extEmail == '' ||
      this.state.extAmount == '' ||
      this.state.extUsd == ''
    ) {
      alertBox(true, 'Please fill all required fields');
    } else if (this.emailValidation()) {
      switchLoader('Submitting Transfer Request...');

      const data = {
        currency: this.state.extCurrency,
        email: this.state.extEmail,
        amt: this.state.extAmount,
        note: this.state.extNote,
        refer_site: this.state.refer_site,
        refer_id: this.state.refer_id,
      };

      if (this.state.extSave) {
        data.usd = this.state.extUsd;
        data.estUsd = this.state.estUsd;
        window.localStorage.setItem(
          'favourite_external_transfer',
          JSON.stringify(data)
        );
      }

      if (this.state.refer_site == 'epay') {
        data.checkoutType = this.state.checkoutType;
        data.fiatamt = this.state.extUsd;
        data.fiat = this.state.fiatcurrency;
        externalepayTransfer(data).then(
          async (resp) => {
            try {
              if (resp.status == true) {
                this.onUpdate();
                this.resetExt();
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
      } else {
        externalTransfer(data).then(
          async (resp) => {
            try {
              if (resp.status == true) {
                this.onUpdate();
                data.userid = currentUser._id;
                createExternalTransaction(data).then(async (resp) => {});
                this.resetExt();
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
    }
  };

  emailValidation() {
    console.log(this.state.extEmail, 'this.state.extEmail');
    const regex =
      /^(([^<>()[\],;:\s@"]+(\.[^<>()[\],;:\s@"]+)*)|(".+"))@(([^<>()[\],;:\s@"]+\.)+[^<>()[\],;:\s@"]{2,})$/i;
    if (!this.state.extEmail || regex.test(this.state.extEmail) === false) {
      alertBox(true, 'Email is not valid');

      return false;
    }
    return true;
  }

  submitInt = () => {
    if (
      this.state.intCurrency == '' ||
      this.state.intAmount == '' ||
      this.state.intTo == '' ||
      this.state.intFrom == ''
    ) {
      alertBox(true, 'Please fill all fields');
    } else if (
      this.state.intAmount === '0' ||
      parseInt(this.state.intAmount) < 0
    ) {
      alertBox(true, 'Amount should be greater than zero');
    } else {
      switchLoader('Submitting Transfer Request...');
      const data = {
        amount: this.state.intAmount,
        currency: this.state.intCurrency,
        receivee: this.state.intTo,
        sendd: this.state.intFrom,
        baseCurr: 'USD',
      };

      internalTransfer(data).then(
        async (resp) => {
          try {
            if (resp.success == 1) {
              this.onUpdate();
              data.userid = currentUser._id;
              createInternalTransaction(data).then(async (resp) => {});
              this.resetInt();
              alertBox(true, 'Successfully Transfered', 'success');
            } else {
              alertBox(true, resp.msg);
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

  allPairs = () => {
    getAllPairs().then(
      async (resp) => {
        this.setState(
          {
            loading: false,
            coins: resp.data,
            error: '',
          },
          () => {
            window.localStorage.setItem('allPairs', JSON.stringify(resp.data));
            if (this.state.extCurrency != '') {
              document.getElementById('extCurrency').value =
                this.state.extCurrency;
            }
          }
        );
      },
      (error) => {
        this.setState({
          loading: false,
        });
      }
    );

    let allBalance = window.localStorage.getItem('allBalance');
    if (allBalance != null) {
      allBalance = JSON.parse(allBalance);
      this.setState({
        loading: false,
        coins: allBalance,
        error: '',
      });
    }
    getAllBalance().then(
      async (resp) => {
        this.setState({
          loading: false,
          balances: resp.data,
          error: '',
        });
        window.localStorage.setItem('allBalance', JSON.stringify(resp.data));
      },
      (error) => {
        console.log(error);
      }
    );
  };

  changeTab = (newValue) => {
    this.setState({ currentTab: newValue });
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
          {this.props.samsubStatus !== 'Accept' && !this.state.loading && (
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
          {!this.state.loading && this.props.samsubStatus === 'Accept' && (
            <div className="col-sm empty-container-with-border center-column">
              <WalletMenuMobile {...this.props} />
              <TabsUI
                tabs={['External Transfer', 'Internal Transfer']}
                type="transactions"
                className="noBorder"
                currentTab={this.state.currentTab}
                changeTab={this.changeTab}
              />

              {this.state.resetExt ? (
                <Spinner />
              ) : (
                <div
                  className={`tab row m--1 mt-2 ${
                    this.state.currentTab != 0 && 'd-none'
                  }`}
                >
                  <div className="bordered w-100">
                    <div className="form-group mb-3">
                      <label>Currency</label>
                      <select
                        className="form-control"
                        name="extCurrency"
                        onChange={this.inputChange}
                        value={this.state.extCurrency}
                        id="extCurrency"
                      >
                        <option value="">Select</option>
                        {this.state.coins != null &&
                          this.state.coins.map((e, i) =>
                            e.curnType == 1 ||
                            e.currencySymbol == 'BLCK' ? null : (
                              <option
                                value={e.currencySymbol}
                                data-usd={e.EstimatedUSD}
                                key={i}
                              >
                                {e.currencySymbol}
                              </option>
                            )
                          )}
                      </select>
                    </div>

                    <div className="form-group mb-3">
                      <label>Recipient</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email"
                        name="extEmail"
                        onChange={this.inputChange}
                        value={this.state.extEmail}
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label>Amount</label>
                      <div className="row">
                        <div className="d-flex justify-content-start align-items col-md-6">
                          <input
                            type="text"
                            placeholder="Select"
                            value={this.state.extCurrency}
                            className="form-control currencySelect"
                            readOnly
                          />
                          <input
                            className="form-control"
                            type="number"
                            min="0"
                            placeholder="Amount"
                            name="extAmount"
                            value={this.state.extAmount}
                            onChange={this.inputChange}
                          />
                        </div>
                        <div className="d-flex justify-content-start align-items col-md-6">
                          <input
                            type="text"
                            placeholder="Select"
                            value="USD"
                            className="form-control currencySelect"
                            readOnly
                          />
                          <input
                            className="form-control"
                            type="number"
                            min="0"
                            placeholder="Amount"
                            name="extUsd"
                            value={this.state.extUsd}
                            onChange={this.inputChange}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group mb-3">
                      <label>Note</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Write a message (eg: Thanks for fast delivery)"
                        name="extNote"
                        onChange={this.inputChange}
                        value={this.state.extNote}
                      />
                    </div>
                    <div className="form-group">
                      <div className="checkbox checkBoxs">
                        <input
                          type="checkbox"
                          name="extAgree"
                          value="check"
                          onChange={this.inputChange}
                          checked={this.state.extAgree}
                        />{' '}
                        I agree
                        <A
                          href={`${process.env.REACT_APP_FRONTEND}terms-and-conditions.pdf`}
                          target="_BLANK"
                          className="text-main"
                        >
                          Terms & Conditions
                        </A>
                      </div>
                    </div>
                    <div className="form-group mt-80 d-flex align-items-center justify-content-end">
                      <button
                        className="secondaryBtn me-2"
                        onClick={this.resetExt}
                      >
                        Reset
                      </button>
                      <button className="primaryBtn" onClick={this.submitExt}>
                        Submit
                      </button>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center w-100 mt-4">
                    <h3 className="subtitle">Available Wallet Balance</h3>
                    <select
                      className="borderless"
                      name="filterCurrency"
                      onChange={this.inputChange}
                    >
                      <option>USD</option>
                      <option>EUR</option>
                    </select>
                  </div>
                  <div className="tableHold">
                    <table className="table">
                      <tbody>
                        {this.state.balances == null ? (
                          <Spinner />
                        ) : (
                          this.state.balances.map((e, i) => (
                            <tr className="whiteBg" key={i}>
                              <td className="">
                                <div>
                                  {e.currencyName} ({e.currencySymbol})
                                </div>
                                <div className="time">
                                  {e.balance != 0 ? e.balance : '0.00000000'}
                                </div>
                              </td>
                              <td className="time" align="right">
                                {this.state.filterCurrency}
                                <br />
                                {e.balance != 0
                                  ? e.balance /
                                    e[`Estimated${this.state.filterCurrency}`]
                                  : '0.00000000'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {this.state.resetInt ? (
                <Spinner />
              ) : (
                <div
                  className={`tab row m--1 mt-2 ${
                    this.state.currentTab == 0 && 'd-none'
                  }`}
                >
                  <div className="bordered w-100">
                    <div className="form-group mb-3">
                      <label>Currency</label>
                      <select
                        className="form-control"
                        name="intCurrency"
                        onChange={this.inputChange}
                        value={this.state.intCurrency}
                      >
                        <option value="">Select</option>
                        {this.state.coins != null &&
                          this.state.coins.map((e, i) =>
                            e.currencySymbol == 'BLCK' ? null : (
                              <option
                                value={e.currencySymbol}
                                data-usd={e.EstimatedUSD}
                                key={i}
                              >
                                {e.currencySymbol}
                              </option>
                            )
                          )}
                      </select>
                    </div>

                    <div className="form-group mb-3">
                      <label>Transfer From</label>
                      <select
                        className="form-control"
                        name="intFrom"
                        value={this.state.intFrom}
                        onChange={this.inputChange}
                      >
                        <option value="">Select</option>
                        <option value="trading" selected>
                          Exhange
                        </option>
                        <option value="p2p">P2P</option>
                        <option value="lending">Lending</option>
                      </select>
                    </div>

                    <div className="form-group mb-3">
                      <label>Transfer To</label>
                      <select
                        className="form-control"
                        name="intTo"
                        value={this.state.intTo}
                        onChange={this.inputChange}
                      >
                        <option value="">Select</option>
                        <option value="trading">Exhange</option>
                        <option value="p2p">P2P</option>
                        <option value="lending" selected>
                          Lending
                        </option>
                      </select>
                    </div>

                    <div className="form-group mb-3">
                      <label>Amount</label>
                      <div className="row">
                        <div className="d-flex justify-content-start align-items col-md-6">
                          <input
                            type="text"
                            placeholder="Select"
                            value={this.state.intCurrency}
                            className="form-control currencySelect"
                            readOnly
                          />
                          <input
                            className="form-control"
                            type="number"
                            min="0"
                            placeholder="Amount"
                            value={this.state.intAmount}
                            name="intAmount"
                            onChange={this.inputChange}
                          />
                        </div>
                        <div className="d-flex justify-content-start align-items col-md-6">
                          <input
                            type="text"
                            placeholder="Select"
                            value="USD"
                            className="form-control currencySelect"
                            readOnly
                          />
                          <input
                            className="form-control"
                            type="number"
                            min="0"
                            placeholder="Amount"
                            value={this.state.intUsd}
                            name="intUsd"
                            onChange={this.inputChange}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group mt-80 d-flex align-items-center justify-content-end">
                      <button
                        className="secondaryBtn me-2"
                        onClick={this.resetInt}
                      >
                        Reset
                      </button>
                      <button className="primaryBtn" onClick={this.submitInt}>
                        Submit
                      </button>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center w-100 mt-4">
                    <h3 className="subtitle">Available Wallet Balance</h3>
                  </div>
                  <div className="col-md-12">
                    <table className="table">
                      <thead>
                        <tr>
                          <td>Currency</td>
                          <td>Exchange</td>
                          <td>P2P</td>
                          <td>Lending</td>
                          <td>Tradeable</td>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.balances == null ? (
                          <Spinner />
                        ) : (
                          this.state.balances.map((e, i) => (
                            <tr key={i}>
                              <td className="">
                                {e.currencyName} ({e.currencySymbol})
                              </td>
                              <td className="time">
                                {e.balance ? e.balance : 0}
                              </td>
                              <td className="time">{e.p2p ? e.p2p : 0}</td>
                              <td className="time">
                                {e.lending ? e.lending : 0}
                              </td>
                              <td className="time">
                                {e.lending_hold ? e.lending_hold : 0}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="col-sm empty-container-with-out-border right-column">
            {this.state.resetExt ? (
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

export default connect(mapCommonStateToProps)(WalletTransfer);
