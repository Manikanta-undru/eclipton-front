import React from 'react';
import { alertBox, switchLoader } from '../../commonRedux';
import WalletMenu from '../../components/Menu/WalletMenu';
import WalletAllBalance from '../../components/Wallet/allBalance';
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
    });
    orderDetailsData((resp) => {
      try {
        /* empty */
      } catch (error) {
        console.log(error);
      }
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
    });
  };

  render() {
    return (
      <div className="container my-wall-container tradePage">
        <div className="row mt-2">
          <div className="col-sm empty-container-with-out-border left-column">
            <WalletMenu {...this.props} />
          </div>
          <div className="col-sm empty-container-with-border center-column">
            <div className="comingsoon">
              <b>Trade Coming Soon...</b>
            </div>
          </div>
          <div className="col-sm empty-container-with-out-border right-column">
            {!this.state.reset && <WalletAllBalance />}
          </div>
        </div>
      </div>
    );
  }
}

export default WalletTrade;
