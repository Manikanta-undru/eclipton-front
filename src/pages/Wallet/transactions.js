import React from 'react';
import { Button } from '@material-ui/core';
import WalletMenu from '../../components/Menu/WalletMenu';
import WalletMenuMobile from '../../components/Menu/WalletMenuMobile';
import Spinner from '../../components/Spinner/index';
import TabsUI from '../../components/Tabs/index';
import WalletAllBalance from '../../components/Wallet/allBalance';
import { formatDate } from '../../globalFunctions';
import walletCheck from '../../hooks/walletCheck';
import {
  getReceivedTransactions,
  getSentTransactions,
} from '../../http/wallet-calls';
import {
  AccordionOne,
  AccordionTwo,
  AccordionThree,
} from '../../components/Accordion/Accordion';
import './styles.scss';
import { getInternalTransactions } from '../../http/trans-calls';

class WalletTransactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attempt: 0,
      content: 'loading',
      currentMainTab: 0,
      currentTab: 0,
      status: null,
      sent: [],
      received: [],
      deposit_received: [],
      internal_trans: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.checkWallet();
    this.internal();
  }

  checkWallet = () => {
    walletCheck().then(
      (resp) => {
        this.setState(
          {
            status: resp.data.status == undefined ? '' : resp.data.status,
          },
          () => {
            this.sent();
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

  sent = () => {
    getSentTransactions().then(
      async (resp) => {
        const sentTrans = resp.data;
        const sent_trans = [];
        const receive_trans = [];
        sentTrans.map((el) => {
          if (
            el.senderemail == this.props.currentUser.email &&
            el.type == 'Send'
          ) {
            sent_trans.push(el);
          }
        });
        sentTrans.map((el) => {
          if (
            el.senderemail == this.props.currentUser.email &&
            el.type == 'Received'
          ) {
            receive_trans.push(el);
          }
        });
        this.setState({
          loading: false,
          sent: sent_trans,
          received: receive_trans,
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

  internal = () => {
    getInternalTransactions().then(
      async (resp) => {
        this.setState({
          internal_trans: resp,
        });
      },
      (err) => {}
    );
  };

  received = () => {
    getReceivedTransactions().then(
      async (resp) => {
        this.setState({
          loading: false,
          deposit_received: resp.data,
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

  changeTab = (newValue) => {
    this.setState({
      loading: true,
      currentTab: newValue,
    });
    if (newValue == 0) {
      this.sent();
    } else {
      this.received();
    }
  };

  render() {
    const { sent } = this.state;
    const receive = this.state.received;
    const { deposit_received } = this.state;
    const merge = deposit_received.concat(receive);
    function dateComparison(a, b) {
      const date1 = new Date(a.created_at);
      const date2 = new Date(b.created_at);

      return date2 - date1;
    }

    merge.sort(dateComparison);
    return (
      <div className="container my-wall-container transactionPage">
        <div className="row mt-2">
          <div className="col-sm empty-container-with-out-border left-column">
            <WalletMenu {...this.props} />
          </div>
          <div className="col-sm center-column">
            <WalletMenuMobile {...this.props} />
            <div className="transaction-page">
              <h4 className="transaction_h4">Transactions history</h4>
              <div className="btn-grp">
                <Button
                  className={this.state.currentMainTab == 0 && 'active'}
                  variant="outlined"
                  onClick={() => {
                    this.internal();
                    this.setState({ currentMainTab: 0 });
                  }}
                >
                  Internal
                </Button>
                <span className="me-2" />
                <Button
                  className={this.state.currentMainTab == 1 && 'active'}
                  onClick={() => {
                    this.sent();
                    this.setState({ currentMainTab: 1 });
                  }}
                >
                  External
                </Button>
              </div>
            </div>
            <div className="col-sm empty-container-with-border center-column">
              {this.state.currentMainTab === 0 && (
                <div style={{ marginTop: '10px' }}>
                  {this.state.internal_trans.length > 0 ? (
                    this.state.internal_trans.map((el, i) => (
                      <AccordionOne
                        from={el.sentType}
                        to={el.receiveType}
                        note=""
                        at={formatDate(el.createdAt)}
                        amount={el.amount}
                        currency={el.currency}
                        key={i}
                      />
                    ))
                  ) : (
                    <p className="no-found">No Data Found</p>
                  )}
                </div>
              )}
              {this.state.currentMainTab === 1 && (
                <>
                  <TabsUI
                    tabs={['Sent', 'Received']}
                    className="noBorder"
                    currentTab={this.state.currentTab}
                    changeTab={this.changeTab}
                  />

                  {this.state.currentMainTab === 1 &&
                    this.state.currentTab == 0 && (
                      <div className="tabPanelItem ">
                        {this.state.loading ? (
                          <div className="col-sm  center-column">
                            <Spinner />
                          </div>
                        ) : (
                          <div>
                            {this.state.sent.length > 0 ? (
                              this.state.sent.map((el, i) => (
                                <AccordionTwo
                                  type="To"
                                  email={el.receiveremail}
                                  currency={el.currency}
                                  amount={el.amount}
                                  note={el.note}
                                  at={formatDate(el.created_at)}
                                  key={i}
                                />
                              ))
                            ) : (
                              <p className="no-found">No Data Found</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                </>
              )}

              {this.state.currentMainTab === 1 &&
                this.state.currentTab == 1 && (
                  <div className="tabPanelItem ">
                    {this.state.loading ? (
                      <div className="col-sm center-column">
                        <Spinner />
                      </div>
                    ) : (
                      <div>
                        {merge.length > 0 ? (
                          merge.map((el, i) =>
                            el.senderemail == this.props.currentUser.email &&
                            el.type == 'Received' ? (
                              <AccordionTwo
                                type="From"
                                email={el.receiveremail}
                                currency={el.currency}
                                amount={el.amount}
                                note={el.note}
                                at={formatDate(el.created_at)}
                                key={i}
                              />
                            ) : (
                              el.depType == 1 && (
                                <AccordionThree
                                  type="From"
                                  email={el.address}
                                  currency={el.currencySymbol}
                                  amount={el.amount}
                                  transType={el.type}
                                  at={formatDate(el.date)}
                                  hash={el.hash}
                                />
                              )
                            )
                          )
                        ) : (
                          <p className="no-found">No Data Found</p>
                        )}
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

export default WalletTransactions;
