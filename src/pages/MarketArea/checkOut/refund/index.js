import React from 'react';
import MarketMenu from '../../../../components/Menu/MarketMenu';
import { checkoutCancelNotificationList } from '../../../../http/product-checkout-calls';
import RefundItem from './item';
import SideMenu3 from '../../_widgets/sideMenu3';

require('../../_styles/market-area.scss');
require('./my-cart.scss');

class CheckoutRefund extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refund_products:
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.refund_products.data
          ? this.props.location.state.refund_products.data
          : [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    checkoutCancelNotificationList().then(
      async (resp) => {
        this.setState({
          refund_products: resp,
        });
      },
      (err) => {}
    );
  }

  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout-1">
          <div className="layout-type-1">
            <div className="left">
              <MarketMenu {...this.props} current="/" />
            </div>

            <div className="middle content">
              <div className="split-type-1">
                <div className="left">
                  <SideMenu3 />
                </div>

                <div className="right">
                  <div className="form-holder-1">
                    <div className="my-cart-block">
                      <div className="top">
                        <h2> Refund Product List </h2>
                      </div>

                      <div className="bottom">
                        <div className="left">
                          {/* BEGIN :: HEAD */}
                          <div className="head grid-equals">
                            <div>
                              {' '}
                              <p> Title </p>{' '}
                            </div>
                            <div>
                              {' '}
                              <p> Price </p>{' '}
                            </div>
                            <div>
                              {' '}
                              <p> Currency </p>{' '}
                            </div>
                            <div> </div>
                          </div>
                          {/* END :: HEAD */}

                          <div className="holder">
                            {/* BEGIN :: BODY */}
                            {typeof this.state.refund_products === 'object' &&
                              this.state.refund_products.title && (
                                <RefundItem item={this.state.refund_products} />
                              )}
                            {typeof this.state.refund_products === 'object' &&
                              // this.state.refund_products.length > 0 &&
                              !this.state.refund_products.title &&
                              this.state.refund_products.map((item, key) => (
                                <RefundItem item={item} key={item._id} />
                              ))}
                            {/* END :: BODY */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutRefund;
