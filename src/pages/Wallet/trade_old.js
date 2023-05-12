import * as moment from 'moment';
import React from 'react';
import ToggleButton from 'react-toggle-button';
import { alertBox, switchLoader } from '../../commonRedux';
import A from '../../components/A';
import Button from '../../components/Button';
import WalletMenu from '../../components/Menu/WalletMenu';
import WalletMenuMobile from '../../components/Menu/WalletMenuMobile';
import Spinner from '../../components/Spinner';
import TabsUI from '../../components/Tabs/index';
import WalletAllBalance from '../../components/Wallet/allBalance';
import { GetAssetImage } from '../../globalFunctions';
import { orderDetailsData, rewardFee, ticker } from '../../hooks/socket';
import walletCheck from '../../hooks/walletCheck';
import {
  cancelOrder,
  createOrder,
  currentMarketPrice,
  getActiveOrders,
  getAllBalance,
  getPairDetails,
  getRewardFeeSettings,
  getTradeDetails,
  getTradePairs,
  getUserDetails,
  getUserFav,
  updateRewardFeeSettings,
  updateUserFav,
} from '../../http/wallet-calls';
import './styles.scss';

class WalletTrade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: 0,
      takeFee: false,
      attempt: 0,
      favs: [],
      favPairs: false,
      primaryCurrency: 'BTC',
      secondaryCurrency: 'USD',
      price: '',
      reset: false,
      amount: '',
      primaryBalance: 0,
      currentPrice: 0,
      secondaryBalance: 0,
      orderType: 'instant',
      tradeType: 'buy',
      activeTrades: [],
      cancelledTrades: [],
      curKey: 0,
      tradeHistory: [],
      pairs: [],
      coins: [],
      trade_pairs: [],
      status: null,
      loading: true,
      content: 'loading',
      currentTab: 0,
    };
  }

  componentDidMount() {
    // localStorage.removeItem("walletToken");
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

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.pair != this.props.match.params.pair) {
      try {
        const { pair } = this.props.match.params;
        if (pair != undefined && pair != null && pair != '') {
          const pairs = pair.split('_');
          this.setState(
            {
              primaryCurrency: pairs[0],
              secondaryCurrency: pairs[1],
            },
            () => {
              this.getCurrentPrice();
              this.getBalance();
            }
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  fav = (id) => {
    updateUserFav({ fav: id }).then(
      (resp) => {
        alertBox(true, 'Favourite list updated', 'success');
      },
      (err) => {
        alertBox(true, 'Something went wrong');
      }
    );
  };

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
        this.setState(
          {
            loading: false,
            status: resp.data.status == undefined ? '' : resp.data.status,
          },
          () => {
            if (resp.data.status == 'Accept') {
              this.allCoins();
              // this.getFavs();
              this.getReward();
              this.getTickerPrice();
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

  getFavs = () => {
    getUserFav().then(
      (resp) => {
        this.setState({
          favs: resp.data,
        });
      },
      (err) => {}
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
    // getAllPairs().then(resp => {
    //     this.setState({
    //         coins: resp.data
    //     })
    // }, err => {
    //     console.log(err);
    // });
    const d = [];
    let index;
    getTradePairs().then(
      (resp) => {
        if (resp != null) {
          this.setState({
            pairs: resp,
          });
          resp.forEach((el) => {
            if (
              el.status == 1 &&
              el.toCurrency != null &&
              el.toCurrency.curnType == 1
            ) {
              index = d.findIndex(
                (item, i) => item.coin === el.toCurrency.currencySymbol
              );
              if (index == -1) {
                d.push({
                  coin: el.toCurrency.currencySymbol,
                  id: el.toCurrency._id,
                  children: [
                    {
                      currencySymbol: el.fromCurrency.currencySymbol,
                      currencyName: el.fromCurrency.currencyName,
                      id: el.fromCurrency._id,
                    },
                  ],
                });
              } else {
                d[index].children.push({
                  currencySymbol: el.fromCurrency.currencySymbol,
                  currencyName: el.fromCurrency.currencyName,
                  id: el.fromCurrency._id,
                });
              }
            }
          });
          const second = this.state.secondaryCurrency;
          var index = d.findIndex((item, i) => item.coin === second);
          this.setState({
            trade_pairs: d,
            curKey: index,
          });
        }
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
      // this.activeTrades();
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
        // this.getCurrentPrice();
        // this.getBalance();
        this.props.history.push(
          `/wallet/trading/${newValue}_${this.state.secondaryCurrency}`
        );
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
          // this.activeTrades();
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
      price: Number(this.state.currentPrice),
      stop_price: Number(this.state.currentPrice),
      tocurrency_price: Number(this.state.currentPrice),
      tosymbol: this.state.secondaryCurrency,
      type: this.state.tradeType,
      action: 'NEW',
      app: 'SOCIAL',
    };
    if (this.state.amount == '' || this.state.amount <= 0) {
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
      switchLoader(true, 'Submitting your order, please wait...');
      createOrder(data).then(
        (resp) => {
          if (resp.data.success) {
            alertBox(true, resp.data.msg, 'success');
            this.setState({
              price: '',
              amount: '',
            });
            this.getBalance();
          } else {
            alertBox(true, resp.data.msg);
          }
          switchLoader();
          this.setState(
            {
              reset: true,
            },
            () => {
              setTimeout(() => {
                this.setState({
                  reset: false,
                });
              }, 1000);
            }
          );
        },
        (error) => {
          switchLoader();
          alertBox(true, 'Unknown Error');
        }
      );
    }
  };

  getPairId = () => {
    let pairid = 0;
    this.state.pairs.forEach((element) => {
      if (
        element.pair ==
        `${this.state.primaryCurrency}_${this.state.secondaryCurrency}`
      ) {
        pairid = element._id;
      }
    });
    return pairid;
  };

  handleSecondary = (e) => {
    const index = this.state.trade_pairs.findIndex(
      (item, i) => item.coin === e.target.value
    );
    this.setState(
      {
        secondaryCurrency: e.target.value,
        currentPrice: 0,
        amount: '',
        price: '',
        primaryBalance: 0,
        secondaryBalance: 0,
        curKey: index,
      },
      () => {
        this.props.history.push(
          `/wallet/trading/${this.state.primaryCurrency}_${this.state.secondaryCurrency}`
        );
        // this.getCurrentPrice();
        // this.getBalance();
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

  activeTrades = () => {
    getActiveOrders({
      FilPerpage: 5,
      FilPage: 1,
    }).then((resp) => {
      this.setState({
        activeTrades: resp.data,
      });
    });
  };

  getTransactions = () => {
    getTradeDetails({
      FilPerpage: 10,
      FilPage: 1,
      pair: `${this.state.primaryCurrency}_${this.state.secondaryCurrency}`,
    }).then(
      (resp) => {
        this.setState({
          loading: false,
          tradeHistory: resp.data,
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
        if (resp.data != undefined) {
          this.setState({
            currentPrice: resp.data.marketPrice,
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  changeFee = () => {
    const d = {
      feesStatus: this.state.takeFee ? 0 : 1,
    };
    updateRewardFeeSettings(d).then(
      (resp) => {},
      (err) => {}
    );
  };

  getReward = () => {
    getUserDetails().then((resp) => {
      try {
        this.setState({
          takeFee: resp.data.feesStatus == 1,
        });
      } catch (error) {
        console.log(error);
      }
    });
    getRewardFeeSettings().then(
      (resp) => {
        try {
          this.setState({
            toggle: resp.data[0].status,
          });
        } catch (error) {
          console.log(error);
        }
      },
      (err) => {}
    );
    rewardFee((resp) => {
      try {
        this.setState({
          toggle: resp[0].status,
        });
      } catch (error) {
        console.log(error);
      }
      // if(data.pair == this.state.primaryCurrency+"_"+this.state.secondaryCurrency){
      //    this.setState({
      //     currentPrice: data.marketPrice
      //    })
      // }
      // var temp = coins;
      // temp[i].marketPrice = data.marketPrice;
      // setCoins(temp);
    });
    orderDetailsData((resp) => {
      // if(data.pair == this.state.primaryCurrency+"_"+this.state.secondaryCurrency){
      //    this.setState({
      //     currentPrice: data.marketPrice
      //    })
      // }
      // var temp = coins;
      // temp[i].marketPrice = data.marketPrice;
      // setCoins(temp);
    });
  };

  getTickerPrice = () => {
    ticker(`liquiditypairdetails`, (data) => {
      if (
        data.pair ==
        `${this.state.primaryCurrency}_${this.state.secondaryCurrency}`
      ) {
        this.setState({
          currentPrice: data.marketPrice,
        });
      }
      // var temp = coins;
      // temp[i].marketPrice = data.marketPrice;
      // setCoins(temp);
    });
  };

  render() {
    return (
      <div className="container my-wall-container tradePage">
        <div className="row mt-2">
          {/* <!-- left column --> */}
          <div className="col-sm empty-container-with-out-border left-column">
            <WalletMenu {...this.props} />
          </div>
          {/* <!-- end left column --> */}

          {/* <!-- center column --> */}
          {this.state.loading && (
            <div className="col-sm empty-container-with-border center-column">
              <Spinner />
            </div>
          )}
          {this.state.status != 'Accept' && !this.state.loading && (
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
          {!this.state.loading && this.state.status == 'Accept' && (
            <div className="col-sm empty-container-with-border center-column">
              <WalletMenuMobile {...this.props} />
              <TabsUI
                tabs={['Buy / Sell', 'Trade History']}
                type="transactions"
                className="noBorder"
                currentTab={this.state.currentTab}
                changeTab={this.changeTab}
              />
              {this.state.currentTab == 0 ? (
                <div className="tab row m--1 mt-2">
                  <div className="col-md-5 p-1">
                    <div className="bordered p-3">
                      <div className="basePairs d-flex align-items-center justify-between">
                        {/* <div className="favButton mb-2 form-control mr-1 pointer" onClick={()=>this.setState({favPairs: !this.state.favPairs})}><i className="fa fa-star"></i> Fav</div> */}
                        <select
                          className="form-control mb-2"
                          onChange={this.handleSecondary}
                        >
                          {this.state.trade_pairs.length > 0 &&
                            this.state.trade_pairs.map((r, i) => (
                              <option
                                value={r.coin}
                                selected={
                                  this.state.secondaryCurrency == r.coin
                                }
                                key={i}
                              >
                                {r.coin}
                              </option>
                            ))}
                        </select>
                      </div>
                      {/* <select className="form-control mb-2" onChange={this.handleSecondary}>
                                    {
                                        this.state.coins.length > 0 && this.state.coins.map((r, i) => {
                                            return ((r.currencySymbol == this.state.primaryCurrency) || (r.curnType == 1 && (this.state.primaryCurrency == 'INR' || this.state.primaryCurrency == 'EUR' || this.state.primaryCurrency == 'USD'))) ? null : <option value={r.currencySymbol} selected={this.state.secondaryCurrency == r.currencySymbol ? true : false}>{r.currencySymbol}</option>
                                        })
                                    }   
                                </select> */}
                      {/* <input type="text" placeholder="Search" /> */}

                      <div className="bottom-border-list">
                        {this.state.favPairs
                          ? null
                          : this.state.trade_pairs[this.state.curKey] !=
                              undefined &&
                            this.state.trade_pairs[this.state.curKey].children
                              .length > 0 &&
                            this.state.trade_pairs[
                              this.state.curKey
                            ].children.map((r, i) => (
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
                                {r.currencyName}({r.currencySymbol}){' '}
                                <span className="fa fa-chevron-right" />
                              </div>
                            ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7 p-1">
                    <div className="bordered p-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <p>
                          <strong>Pair:</strong> {this.state.primaryCurrency}_
                          {this.state.secondaryCurrency}
                        </p>
                        <p className="text-small  text-right">
                          1{' '}
                          <span className="text-primary">
                            {this.state.primaryCurrency}
                          </span>{' '}
                          = {this.state.currentPrice.toFixed(8)}{' '}
                          <span className="text-primary">
                            {this.state.secondaryCurrency}
                          </span>
                        </p>
                      </div>

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
                      {/* <div className="form-group">
                                    <div className="switch-buttons mb-4">
                                        <button onClick={() => {this.setState({orderType: 'market'})}} className={"btn box "+(this.state.orderType == 'market' ? 'btn-main' : 'btn-light')}>Market</button>
                                        <button onClick={() => {this.setState({orderType: 'instant'})}} className={"btn box "+(this.state.orderType == 'instant' ? 'btn-main' : 'btn-light')}>Limit</button>
                                    </div>
                                    </div> */}
                      <div className="form-group">
                        {/* <div className="d-flex justify-content-between"><label>Guranteed Order</label><span className="text-secondary">$ 19.22 per XBT</span></div> */}
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
                            min={0}
                            placeholder="Amount"
                            value={this.state.amount}
                            onChange={this.handleAmountChange}
                          />
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <div className="tradeBal_name">
                            {this.state.primaryCurrency} Bal
                          </div>
                          <div className="tradeBal_val">
                            <small>
                              {this.state.primaryBalance.toFixed(8)}
                            </small>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="tradeBal_name">
                            {this.state.secondaryCurrency} Bal
                          </div>
                          <div className="tradeBal_val">
                            <small>
                              {this.state.secondaryBalance.toFixed(8)}
                            </small>
                          </div>
                        </div>
                      </div>
                      {/* <div className="form-group">
                                        <label>Total</label>
                                        <div className="d-flex justify-content-start align-items">
                                        <input type="text" value={this.state.secondaryCurrency} className="form-control currencySelect" disabled />
                                        <input className="form-control" type="number" placeholder="Amount"  onChange={this.handlePriceChange} readOnly={this.state.orderType == 'instant' ? false : true} value={this.state.price} />
                                        <input type="text" value={"Bal: "+this.state.secondaryBalance} className="form-control balance" disabled />
                                        </div>
                                    </div> */}
                      <div className="form-group mt-80 d-flex align-items-center justify-content-between">
                        {this.state.toggle == 1 ? (
                          <div>
                            <ToggleButton
                              value={this.state.takeFee || false}
                              onToggle={(value) => {
                                this.setState(
                                  {
                                    takeFee: !value,
                                  },
                                  this.changeFee()
                                );
                              }}
                            />
                            <small>Take fee from Reward Points </small>
                          </div>
                        ) : (
                          <div />
                        )}
                        <Button
                          size="big"
                          className="text-uppercase"
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
                        </Button>
                      </div>
                      <a
                        href={`${
                          process.env.REACT_APP_TRADEBASE
                        }#/validate?from=${this.state.primaryCurrency}&to=${
                          this.state.secondaryCurrency
                        } &pair=${this.getPairId()}&token=${localStorage.getItem(
                          'jwt'
                        )}`}
                        className="advancedTrading"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img src={GetAssetImage('candlestick2.png')} />
                        <div>
                          <h3>Advanced Trading</h3>
                          <p>Charts, Order Books, Market Depth, etc...</p>
                        </div>
                      </a>
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
              ) : (
                // :
                // this.state.currentTab == 1 ?

                // <div className="tab mt-3 p-2">
                //     {
                //         this.state.loading ? <Spinner /> :
                //         <div className="p-2">
                //         <h3>Active Orders</h3>
                //         {
                //             this.state.activeTrades.length > 0 ?
                //             <table className="table">
                //         <tr className="whiteBg title">
                //           <td>Placed at</td>
                //           <td>Pair</td>
                //           <td>Order ID</td>
                //           <td>Order Type</td>
                //           <td>Type</td>
                //           <td>Price</td>
                //           <td>Qty</td>
                //           <td>Fee</td>
                //         </tr>
                //         {
                //             this.state.activeTrades.map((r, i) => {
                //                 return <tr>
                //                     <td className="time">{moment(r.created_at).format('MMM DD, YY hh:mm A')}</td>
                //                     <td className="time">{r.pair}</td>
                //                     <td className="time">{r.orderId} <button className="btn btn-danger" onClick={()=>this.cancel(r.orderId, r.pair)}>Cancel Order</button></td>
                //                     <td className="time">{r.ordertype}</td>
                //                     <td className="time">{r.type}</td>
                //                     <td className="time">{r.askPrice.toFixed(8)}</td>
                //                     <td className="time">{r.askAmount}</td>
                //                     <td className="time">{r.fee.toFixed(8)}</td>
                //                 </tr>
                //             })
                //         }
                //     </table>
                //             :
                //             <p className="bordered no-found">No Orders Found</p>
                //         }
                //         <h3 className="mt-4">Cancelled Orders</h3>
                //         {
                //             this.state.cancelledTrades.length > 0 ?
                //             <table className="table">
                //         <tr className="whiteBg title">
                //           <td>Placed at</td>
                //           <td>Pair</td>
                //           <td>Order ID</td>
                //           <td>Order Type</td>
                //           <td>Type</td>
                //           <td>Price</td>
                //           <td>Qty</td>
                //           <td>Fee</td>
                //         </tr>
                //         {
                //             this.state.cancelledTrades.map((r, i) => {
                //                 return <tr>
                //                     <td className="time">{moment(r.created_at).format('MMM DD, YY hh:mm A')}</td>
                //                     <td className="time">{r.pair}</td>
                //                     <td className="time">{r.orderId}</td>
                //                     <td className="time">{r.ordertype}</td>
                //                     <td className="time">{r.type}</td>
                //                     <td className="time">{r.askPrice.toFixed(8)}</td>
                //                     <td className="time">{r.askAmount}</td>
                //                     <td className="time">{r.fee.toFixed(8)}</td>
                //                 </tr>
                //             })
                //         }
                //     </table>
                //             :
                //             <p className="bordered no-found">No Orders Found</p>
                //         }
                //     </div>
                //     }

                // </div>
                <div className="tab mt-3 p-2">
                  {this.state.loading ? (
                    <Spinner />
                  ) : (
                    <div>
                      <h3>
                        Trade History -{' '}
                        {`${this.state.primaryCurrency}_${this.state.secondaryCurrency}`}
                      </h3>
                      {this.state.tradeHistory.length > 0 ? (
                        <table className="table">
                          <tr>
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
                              <td className="time">
                                {r.type.toLowerCase() == 'buy'
                                  ? r.buyuorderId
                                  : r.selluorderId}
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
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {/* <!-- end center column --> */}
          <div className="col-sm empty-container-with-out-border right-column">
            {!this.state.reset && <WalletAllBalance />}
          </div>
        </div>
      </div>
    );
  }
}

export default WalletTrade;
