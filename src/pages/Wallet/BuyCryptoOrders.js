import React from 'react';

import A from '../../components/A';
import WalletMenu from '../../components/Menu/WalletMenu';
import WalletMenuMobile from '../../components/Menu/WalletMenuMobile';
import Spinner from '../../components/Spinner/index';
import WalletAllBalance from '../../components/Wallet/allBalance';
import { mapCommonStateToProps } from '../../hooks/walletCheck';
import { getAllSwipeluxOrders } from '../../http/wallet-calls';
import './styles.scss';
import { connect } from 'react-redux';
import { displayApplicantDataForFe } from '../../http/http-calls';

import { getCurrentUser } from '../../http/token-interceptor';
let currentUser = JSON.parse(getCurrentUser());

class BuyCryptoOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      loading: true,
    };
  }

  componentDidMount = () => {
    const {
      walletDetails: { cognito_id },
    } = this.props.currentUser;
    displayApplicantDataForFe({ cognitoUserId: cognito_id }).then((res) => {
      const samStatus = res?.data?.applicantStatus || res?.data?.status;
      if (samStatus == 'Accept') {
        this.Swipeluxorders();
      } else {
        <div>
          <p>Finish KYC to use this feature</p>
          <A href="/wallet/verification">
            <button className="btn btn-main">Go to Verification</button>
          </A>
        </div>;
      }
      this.setState({ loading: false });
    });
  };

  Swipeluxorders = () => {
    console.log('swipelux orders');

    getAllSwipeluxOrders().then(
      async (resp) => {
        if (resp.status) {
          this.setState({
            loading: false,
            orders: resp.data,
            error: '',
          });
        } else {
          //   alertBox(true, "Something went wrong");
        }
      },
      (error) => {
        console.log(error);
      }
    );
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

              <div className="tab row m--1">
                <div className="d-flex justify-content-between align-items-center w-100">
                  <h3 className="subtitle">Buy crypto Orders</h3>
                </div>
                <div className="col-md-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <td>Pay</td>
                        <td>Buy</td>
                        <td>Order ID</td>
                        <td>Status</td>
                        <td>Reason</td>
                        <td>Date & Time</td>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.orders == null ? (
                        <Spinner />
                      ) : (
                        this.state.orders.map((e, i) => {
                          return (
                            <tr key={i}>
                              <td className="">
                                {e.payamount + ' ' + e.payCurrency}
                              </td>
                              <td className="time">
                                {e.buyamount + ' ' + e.buyCurrency}
                              </td>
                              <td className="time">{e.orderid}</td>
                              <td className="time">{e.status}</td>
                              <td className="time">
                                {e.reason != '' ? e.reason : '--'}
                              </td>
                              <td className="time">{e.updatedtime}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          <div className="col-sm empty-container-with-out-border right-column">
            <WalletAllBalance />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapCommonStateToProps)(BuyCryptoOrders);
