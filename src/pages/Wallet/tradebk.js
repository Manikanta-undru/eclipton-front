import * as moment from 'moment';
import React from 'react';
import { alertBox } from '../../commonRedux';
import A from '../../components/A';
import WalletMenu from '../../components/Menu/WalletMenu';
import WalletMenuMobile from '../../components/Menu/WalletMenuMobile';
import Spinner from '../../components/Spinner';
import TabsUI from '../../components/Tabs/index';
import WalletAllBalance from '../../components/Wallet/allBalance';
import walletCheck from '../../hooks/walletCheck';
import {
  cancelOrder,
  createOrder,
  currentMarketPrice,
  getAllBalance,
  getAllPairs,
  getPairDetails,
  getTradeDetails,
} from '../../http/wallet-calls';
import './styles.scss';

class WalletTrade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attempt: 0,
      primaryCurrency: 'BTC',
      secondaryCurrency: 'EUR',
      price: '',
      amount: '',
      primaryBalance: 0,
      currentPrice: 0,
      secondaryBalance: 0,
      orderType: 'instant',
      tradeType: 'buy',
      activeTrades: [],
      cancelledTrades: [],
      tradeHistory: [],
      pairs: [],
      coins: [],
      status: null,
      loading: false,
      content: 'loading',
      currentTab: 0,
    };
  }

  componentDidMount() {
    localStorage.removeItem('walletToken');
    try {
      const { pair } = this.props.match.params;
      if (pair != undefined && pair != null && pair != '') {
        const pairs = pair.split('_');
        this.setState({
          primaryCurrency: pairs[0],
          secondaryCurrency: pairs[1],
        });
      }
    } catch (error) {
      console.log(error);
    }

    this.checkWallet();
  }

  checkWallet = () => {
    // var kycStatus = window.localStorage.getItem("kycStatus");
    // if(kycStatus != null){
    //     kycStatus = kycStatus;
    //     this.setState({
    //         loading:false,
    //         status : kycStatus
    //     }, () => {
    //         this.allPairs();
    //         this.received();
    //         this.adminBankDetails();
    //     });
    // }
    walletCheck().then(
      (resp) => {
        window.localStorage.setItem('kycStatus', resp.data.status);
        this.setState(
          {
            loading: false,
            status: resp.data.status == undefined ? '' : resp.data.status,
          },
          () => {
            if (resp.data.status == 'Accept') {
              this.allCoins();
              this.allPairs();
              this.getCurrentPrice();
              this.getBalance();
            }
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

  // componentDidMount = () => {
  //     this.allCoins();
  //     this.allPairs();
  //     this.getCurrentPrice();
  //     this.getBalance();
  // }

  allPairs = () => {
    getPairDetails().then(
      (resp) => {
        this.setState({
          pairs: resp.message,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  };

  allCoins = () => {
    getAllPairs().then(
      (resp) => {
        this.setState({
          coins: resp.data,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  };

  changeTab = (newValue) => {
    if (newValue == 1 || newValue == 2) {
      this.setState({ currentTab: newValue, loading: true });
      this.getTransactions();
    } else {
      this.setState({ currentTab: newValue, loading: false });
    }
  };

  handlePrimary = (newValue) => {
    this.setState(
      {
        primaryCurrency: newValue,
        currentPrice: 0,
        amount: '',
        price: '',
        primaryBalance: 0,
        secondaryBalance: 0,
      },
      () => {
        this.getCurrentPrice();
        this.getBalance();
      }
    );
  };

  cancel = (id, pair) => {
    let pairid = 0;
    this.state.pairs.forEach((element) => {
      if (element.pair == pair) {
        pairid = element._id;
      }
    });
    const data = {
      order_id: id,
      pair_id: pairid,
    };
    cancelOrder(data).then(
      (resp) => {
        if (resp.data.success) {
          alertBox(true, resp.data.msg, 'success');
          this.getTransactions();
        } else {
          alertBox(true, resp.data.msg);
        }
        this.setState({
          loading: false,
        });
      },
      (error) => {
        this.setState({
          loading: false,
        });
        alertBox(true, 'Unknown Error');
      }
    );
  };

  submit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('walletToken');
    let pairid = 0;
    this.state.pairs.forEach((element) => {
      if (
        element.pair ==
        `${this.state.primaryCurrency}_${this.state.secondaryCurrency}`
      ) {
        pairid = element._id;
      }
    });
    const data = {
      amount: Number(this.state.amount),
      ordertype: this.state.orderType,
      pair: pairid,
      price:
        this.state.orderType == 'instant'
          ? Number(this.state.currentPrice)
          : Number(this.state.price),
      stop_price: this.state.currentPrice,
      tocurrency_price: this.state.currentPrice,
      type: this.state.tradeType,
    };
    if (this.state.amount == '' || this.state.amount == 0) {
      alertBox(true, 'Please fill the valid amount!');
    } else if (
      this.state.tradeType == 'buy' &&
      this.state.price > this.state.secondaryBalance
    ) {
      alertBox(true, `Insufficient ${this.state.secondaryCurrency} balance`);
    } else if (
      this.state.tradeType == 'sell' &&
      this.state.amount > this.state.primaryBalance
    ) {
      alertBox(true, `Insufficient ${this.state.primaryCurrency} balance`);
    } else {
      this.setState({
        loading: true,
      });
      createOrder(data).then(
        (resp) => {
          if (resp.data.success) {
            alertBox(true, resp.data.msg, 'success');
            this.setState({
              price: '',
              amount: '',
            });
          } else {
            alertBox(true, resp.data.msg);
          }
          this.setState({
            loading: false,
          });
        },
        (error) => {
          this.setState({
            loading: false,
          });
          alertBox(true, 'Unknown Error');
        }
      );
    }
  };

  handleSecondary = (e) => {
    this.setState(
      {
        secondaryCurrency: e.target.value,
        currentPrice: 0,
        amount: '',
        price: '',
        primaryBalance: 0,
        secondaryBalance: 0,
      },
      () => {
        this.getCurrentPrice();
        this.getBalance();
      }
    );
  };

  getBalance = () => {
    getAllBalance().then(
      (resp) => {
        resp.data.forEach((element) => {
          if (element.currencySymbol == this.state.primaryCurrency) {
            this.setState({
              primaryBalance: element.balance,
            });
          }
          if (element.currencySymbol == this.state.secondaryCurrency) {
            this.setState({
              secondaryBalance: element.balance,
            });
          }
        });
      },
      (err) => {}
    );
  };

  handleAmountChange = (e) => {
    const val = e.target.value;
    const price = (val * this.state.currentPrice).toFixed(8);
    this.setState({ price, amount: val });
  };

  handlePriceChange = (e) => {
    const val = e.target.value;
    const amount = (val / this.state.currentPrice).toFixed(8);
    this.setState({ amount, price: val });
  };

  getTransactions = () => {
    getTradeDetails({
      pair: `${this.state.primaryCurrency}_${this.state.secondaryCurrency}`,
    }).then(
      (resp) => {
        this.setState({
          tradeHistory:
            resp.data.trade_history == undefined ? [] : resp.data.trade_history,
          activeTrades:
            resp.data.active_orders == undefined ? [] : resp.data.active_orders,
          cancelledTrades:
            resp.data.cancelled_orders == undefined
              ? []
              : resp.data.cancelled_orders,
          loading: false,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  };

  getCurrentPrice = () => {
    currentMarketPrice({
      pair: `${this.state.primaryCurrency}_${this.state.secondaryCurrency}`,
    }).then(
      (resp) => {
        this.setState({
          currentPrice: resp.data.marketPrice,
        });
      },
      (err) => {
        console.log(err);
      }
    );
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
          {this.state.status != 'Accept' && this.state.status == null && (
            <div className="col-sm empty-container-with-border center-column">
              <Spinner />
            </div>
          )}
          {this.state.status != 'Accept' && this.state.status != null && (
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
          {this.state.status == 'Accept' && (
            <div className="col-sm empty-container-with-out-border center-column">
              <WalletMenuMobile {...this.props} />

              <TabsUI
                tabs={['Buy / Sell', 'Order History', 'Trade History']}
                type="transactions"
                className="noBorder"
                currentTab={this.state.currentTab}
                changeTab={this.changeTab}
              />
              {this.state.currentTab == 0 ? (
                <div className="tab row m--1 mt-2">
                  <div className="col-md-5 p-1">
                    <div className="bordered p-3">
                      <select
                        className="form-control mb-2"
                        onChange={this.handleSecondary}
                      >
                        {this.state.coins.length > 0 &&
                          this.state.coins.map((r, i) =>
                            r.currencySymbol == this.state.primaryCurrency ||
                            (r.curnType == 1 &&
                              (this.state.primaryCurrency == 'INR' ||
                                this.state.primaryCurrency == 'EUR' ||
                                this.state.primaryCurrency == 'USD')) ? null : (
                              <option
                                value={r.currencySymbol}
                                selected={
                                  this.state.secondaryCurrency ==
                                  r.currencySymbol
                                }
                                key={i}
                              >
                                {r.currencySymbol}
                              </option>
                            )
                          )}
                      </select>
                      <input type="text" placeholder="Search" />

                      <div className="bottom-border-list">
                        {this.state.coins.length > 0 &&
                          this.state.coins.map((r, i) =>
                            r.currencySymbol == this.state.secondaryCurrency ||
                            (r.curnType == 1 &&
                              (this.state.secondaryCurrency == 'INR' ||
                                this.state.secondaryCurrency == 'EUR' ||
                                this.state.secondaryCurrency ==
                                  'USD')) ? null : (
                              <div
                                className={`list-item pointer ${
                                  this.state.primaryCurrency == r.currencySymbol
                                    ? 'bg-main text-white'
                                    : ''
                                }`}
                                onClick={() =>
                                  this.handlePrimary(r.currencySymbol)
                                }
                                key={i}
                              >
                                {r.currencyName} ({r.currencySymbol}){' '}
                                <span className="fa fa-chevron-right" />
                              </div>
                            )
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7 p-1">
                    <div className="bordered p-3">
                      <p>
                        <strong>Pair:</strong> {this.state.primaryCurrency}_
                        {this.state.secondaryCurrency}
                      </p>
                      <div className="form-group">
                        <div className="switch-buttons mb-4">
                          <button
                            onClick={() => {
                              this.setState({ tradeType: 'buy' });
                            }}
                            className={`btn box ${
                              this.state.tradeType == 'buy'
                                ? 'btn-main'
                                : 'btn-light'
                            }`}
                          >
                            Buy
                          </button>
                          <button
                            onClick={() => {
                              this.setState({ tradeType: 'sell' });
                            }}
                            className={`btn box ${
                              this.state.tradeType == 'sell'
                                ? 'btn-main'
                                : 'btn-light'
                            }`}
                          >
                            Sell
                          </button>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="switch-buttons mb-4">
                          <button
                            onClick={() => {
                              this.setState({ orderType: 'market' });
                            }}
                            className={`btn box ${
                              this.state.orderType == 'market'
                                ? 'btn-main'
                                : 'btn-light'
                            }`}
                          >
                            Market
                          </button>
                          <button
                            onClick={() => {
                              this.setState({ orderType: 'instant' });
                            }}
                            className={`btn box ${
                              this.state.orderType == 'instant'
                                ? 'btn-main'
                                : 'btn-light'
                            }`}
                          >
                            Limit
                          </button>
                        </div>
                      </div>
                      <div className="form-group">
                        {/* <div className="d-flex justify-content-between"><label>Guranteed Order</label><span className="text-secondary">$ 19.22 per XBT</span></div> */}
                        {this.state.currentPrice > 0 ? (
                          <label className=" btn-secondary p-2">
                            1 {this.state.primaryCurrency} ={' '}
                            {this.state.currentPrice.toFixed(8)}{' '}
                            {this.state.secondaryCurrency}
                          </label>
                        ) : null}
                        <div className="d-flex justify-content-start align-items">
                          <input
                            type="text"
                            value={this.state.primaryCurrency}
                            className="form-control currencySelect"
                            disabled
                          />
                          <input
                            className="form-control"
                            type="number"
                            placeholder="Amount"
                            value={this.state.amount}
                            onChange={this.handleAmountChange}
                          />
                          <input
                            type="text"
                            value={`Bal: ${this.state.primaryBalance}`}
                            className="form-control balance"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Total</label>
                        <div className="d-flex justify-content-start align-items">
                          <input
                            type="text"
                            value={this.state.secondaryCurrency}
                            className="form-control currencySelect"
                            disabled
                          />
                          <input
                            className="form-control"
                            type="number"
                            placeholder="Amount"
                            onChange={this.handlePriceChange}
                            readOnly={this.state.orderType != 'instant'}
                            value={this.state.price}
                          />
                          <input
                            type="text"
                            value={`Bal: ${this.state.secondaryBalance}`}
                            className="form-control balance"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="form-group mt-80 d-flex align-items-center justify-content-end">
                        <button
                          className="btn btn-main box text-uppercase"
                          disabled={this.state.loading}
                          onClick={this.submit}
                        >
                          {this.state.loading ? (
                            <Spinner />
                          ) : (
                            <div>
                              {this.state.tradeType}{' '}
                              {this.state.primaryCurrency}
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* <table className="table">
                                <tr className="whiteBg title">
                                  <td>Pair</td>
                                  <td>Change</td>
                                  <td>Sell</td>
                                  <td>Buy</td>
                                  <td>High/Low</td> 
                                </tr>
                                <tr>
                                    <td className="time">XBTETH</td>
                                    <td className="time">-12.2%</td>
                                    <td className="time"><button className="btn btn-danger box">Sell</button></td>
                                    <td className="time"><button className="btn btn-success box">Buy</button></td>
                                    <td className="time">11,54654</td>
                                    
                                </tr>
                                <tr>
                                <td className="time">XBTETH</td>
                                    <td className="time">-12.2%</td>
                                    <td className="time"><button className="btn btn-danger box">Sell</button></td>
                                    <td className="time"><button className="btn btn-success box">Buy</button></td>
                                    <td className="time">11,54654</td>
                                </tr>
                                <tr>
                                <td className="time">XBTETH</td>
                                    <td className="time">-12.2%</td>
                                    <td className="time"><button className="btn btn-danger box">Sell</button></td>
                                    <td className="time"><button className="btn btn-success box">Buy</button></td>
                                    <td className="time">11,54654</td>
                                    
                                </tr>
                            </table> */}
                </div>
              ) : this.state.currentTab == 1 ? (
                <div className="tab mt-3 p-2">
                  {this.state.loading ? (
                    <Spinner />
                  ) : (
                    <div className="p-2">
                      <h3>Active Orders</h3>
                      {this.state.activeTrades.length > 0 ? (
                        <table className="table">
                          <tr className="whiteBg title">
                            <td>Placed at</td>
                            <td>Pair</td>
                            <td>Order ID</td>
                            <td>Order Type</td>
                            <td>Type</td>
                            <td>Price</td>
                            <td>Qty</td>
                            <td>Fee</td>
                          </tr>
                          {this.state.activeTrades.map((r, i) => (
                            <tr key={i}>
                              <td className="time">
                                {moment(r.created_at).format(
                                  'MMM DD, YY hh:mm A'
                                )}
                              </td>
                              <td className="time">{r.pair}</td>
                              <td className="time">
                                {r.orderId}{' '}
                                <button
                                  className="btn btn-danger"
                                  onClick={() => this.cancel(r.orderId, r.pair)}
                                >
                                  Cancel Order
                                </button>
                              </td>
                              <td className="time">{r.ordertype}</td>
                              <td className="time">{r.type}</td>
                              <td className="time">{r.askPrice.toFixed(8)}</td>
                              <td className="time">{r.askAmount}</td>
                              <td className="time">{r.fee.toFixed(8)}</td>
                            </tr>
                          ))}
                        </table>
                      ) : (
                        <p className="bordered no-found">No Orders Found</p>
                      )}
                      <h3 className="mt-4">Cancelled Orders</h3>
                      {this.state.cancelledTrades.length > 0 ? (
                        <table className="table">
                          <tr className="whiteBg title">
                            <td>Placed at</td>
                            <td>Pair</td>
                            <td>Order ID</td>
                            <td>Order Type</td>
                            <td>Type</td>
                            <td>Price</td>
                            <td>Qty</td>
                            <td>Fee</td>
                          </tr>
                          {this.state.cancelledTrades.map((r, i) => (
                            <tr key={i}>
                              <td className="time">
                                {moment(r.created_at).format(
                                  'MMM DD, YY hh:mm A'
                                )}
                              </td>
                              <td className="time">{r.pair}</td>
                              <td className="time">{r.orderId}</td>
                              <td className="time">{r.ordertype}</td>
                              <td className="time">{r.type}</td>
                              <td className="time">{r.askPrice.toFixed(8)}</td>
                              <td className="time">{r.askAmount}</td>
                              <td className="time">{r.fee.toFixed(8)}</td>
                            </tr>
                          ))}
                        </table>
                      ) : (
                        <p className="bordered no-found">No Orders Found</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="tab mt-3 p-2">
                  {this.state.loading ? (
                    <Spinner />
                  ) : (
                    <div>
                      <h3>Trade History</h3>
                      {this.state.tradeHistory.length > 0 ? (
                        <table className="table">
                          <tr className="whiteBg title">
                            <td>Placed at</td>
                            <td>Pair</td>
                            <td>Order ID</td>
                            <td>Order Type</td>
                            <td>Type</td>
                            <td>Price</td>
                            <td>Qty</td>
                            <td>Fee</td>
                          </tr>
                          {this.state.tradeHistory.map((r, i) => (
                            <tr key={i}>
                              <td className="time">
                                {moment(r.created_at).format(
                                  'MMM DD, YY hh:mm A'
                                )}
                              </td>
                              <td className="time">{r.pair}</td>
                              <td className="time">{r.orderId}</td>
                              <td className="time">{r.ordertype}</td>
                              <td className="time">{r.type}</td>
                              <td className="time">{r.askPrice.toFixed(8)}</td>
                              <td className="time">{r.askAmount}</td>
                              <td className="time">{r.fee.toFixed(8)}</td>
                            </tr>
                          ))}
                        </table>
                      ) : (
                        <p className="bordered no-found">No Orders Found</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {/* <!-- end center column --> */}
          <div className="col-sm empty-container-with-out-border right-column">
            {this.state.status == 'Accept' && <WalletAllBalance />}
          </div>
        </div>
      </div>
    );
  }
}

export default WalletTrade;
