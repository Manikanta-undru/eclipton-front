import React from 'react';
import { connect } from 'react-redux';
import A from '../../components/A';
import WalletMenu from '../../components/Menu/WalletMenu';
import WalletMenuMobile from '../../components/Menu/WalletMenuMobile';
import Spinner from '../../components/Spinner';
import WalletAllBalance from '../../components/Wallet/allBalance';
import { mapCommonStateToProps } from '../../hooks/walletCheck';
import { getAllPairs } from '../../http/wallet-calls';
import './styles.scss';
import MobileNav from '../../components/Menu/MobileNav';

class WalletDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attempt: 0,
      coins: [],
      status: '',
      error: '',
      loading: true,
      tabContent: 'loading',
      currentTab: 0,
    };
  }

  componentDidMount() {
    this.checkWallet();
  }

  checkWallet = () => {
    this.allPairs();
  };

  allPairs = () => {
    let allPairs = window.localStorage.getItem('allPairs');
    if (allPairs != null) {
      allPairs = JSON.parse(allPairs);
      this.setState({
        loading: false,
        coins: allPairs,
        error: '',
      });
    }
    getAllPairs().then(
      async (resp) => {
        this.setState({
          loading: false,
          coins: resp.data,
          error: '',
        });
        window.localStorage.setItem('allPairs', JSON.stringify(resp.data));
      },
      (error) => {
        try {
          this.setState({
            loading: false,
            error: error.data.toString(),
          });
        } catch (error) {
          this.setState({
            loading: false,
            error: 'Error',
          });
        }
      }
    );
  };

  render() {
    return (
      <div className="container my-wall-container walletPage">
        <div className="row mt-2 mobileNavRow">
          {/* <!-- left column --> */}
          <div className="col-sm empty-container-with-out-border left-column">
            <WalletMenu {...this.props} />
          </div>
          {/* <!-- end left column --> */}

          {/* <!-- center column --> */}
          <div
            className="col-sm empty-container-with-border center-column mobileProfile"
            style={{ height: '100%' }}
          >
            <MobileNav />
            <div className="centerWrapper">
              <WalletMenuMobile {...this.props} />
              <h1 className="title">My Wallet</h1>
              {this.state.loading ? (
                <Spinner />
              ) : (
                <div className="center-inner wallet-dashboard">
                  {this.state.error != '' ? (
                    <p className="text-danger">{this.state.error}</p>
                  ) : (
                    this.state.coins &&
                    this.state.coins.map((e, i) => (
                      <div className="walletItemHold" key={i}>
                        <div className="walletItem">
                          <div className="flex-row-between">
                            <div className="symbol">{e.currencySymbol}</div>
                            <img
                              src={process.env.REACT_APP_WALLETIMGURL + e.image}
                            />
                          </div>
                          <div className="flex-row-between mt-auto">
                            <h4 className="currency">{e.currencyName}</h4>
                            <div className="balance">{e.krakenBalance}</div>
                          </div>
                          <div className="actionBar">
                            <A href={`/wallet/deposit/${e.currencySymbol}`}>
                              Deposit
                            </A>
                            <A href={`/wallet/withdraw/${e.currencySymbol}`}>
                              Withdraw
                            </A>
                            <A href={`/wallet/transfer/${e.currencySymbol}`}>
                              Transfer
                            </A>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          {!this.state.loading && (
            <div className="col-sm empty-container-with-out-border right-column">
              <WalletAllBalance />
              {this.state.kyc == '' && (
                <div className="row secureDiv">
                  <h3>Secure Your Account</h3>
                  <div className="d-flex align-items-center justify-content-between">
                    <p>Itendity Proof and Bank Verification is PENDING</p>
                    <A href="/wallet/verification">
                      <button className="btn">Verify Now</button>
                    </A>
                  </div>
                </div>
              )}
              {this.props.samsubStatus == 'pending' && (
                <div className="row secureDiv bg-warning">
                  <h3>Secure Your Account</h3>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="text-dark">
                      Itendity Proof and Bank Verification is Being Processed
                    </p>
                  </div>
                </div>
              )}
              <div className="row mt-4" />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(mapCommonStateToProps)(WalletDashboard);
