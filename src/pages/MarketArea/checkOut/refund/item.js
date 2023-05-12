import React from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../../../../http/product-calls';
import {
  completeCheckoutRefund,
  removeCheckoutCancelNotification,
} from '../../../../http/product-checkout-calls';
import {
  externalTransfer,
  productAddToCart,
} from '../../../../http/wallet-calls';
require('../../../../pages/MarketArea/_styles/market-area.scss');
require('./my-cart.scss');
const coins = require('../../../Gionomy/add/coins.json');

class RefundItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item.data,
      notification_id: this.props.item._id,
    };
  }

  handleConfirm(e, item) {
    const coin_result = coins.find(
      ({ currencySymbol }) => currencySymbol === item.currency
    );
    getUser({ userid: item.sender_id }).then(
      async (user_resp) => {
        const add_to_cart_data = {
          productId: item.product_id,
          currency: item.currency,
          amount: item.price,
          type: 'Pending',
          currId: coin_result._id,
          email: user_resp.email,
        };
        productAddToCart(add_to_cart_data).then(
          (resp) => {
            if (resp.Status == true) {
              const con = window.confirm(
                'You have a sufficient balance click ok to proceed to transaction'
              );
              if (con == true) {
                completeCheckoutRefund(item).then(
                  async (resp) => {
                    const data = {
                      currency: item.currency,
                      email: user_resp.email,
                      amt: item.price,
                      note: 'Product Checkout Refund',
                    };
                    externalTransfer(data).then(
                      async (transfer_resp) => {
                        removeCheckoutCancelNotification({
                          notification_id: this.state.notification_id,
                        }).then(
                          async (resp) => {},
                          (err) => {}
                        );
                      },
                      (error) => {}
                    );
                  },
                  (error) => {}
                );
              }
            } else {
              /* empty */
            }
          },
          (err) => {}
        );
      },
      (error) => {}
    );
  }

  render() {
    return (
      <div className="market-place-styles">
        <div className="refund_head">
          {this.state.item && (
            <div className="body grid-equals">
              <div className="detail">
                <Link
                  to={{
                    pathname:
                      '/market-product-detail-view/' +
                      this.state.item.product_id,
                  }}
                >
                  <a> {this.state.item.title} </a>
                </Link>
              </div>

              <div className="price">
                <p> {this.state.item.price} </p>
              </div>

              <div className="currency">
                <p> {this.state.item.currency} </p>
              </div>

              <button
                className="btn-1 btn-block"
                onClick={(e) => this.handleConfirm(e, this.state.item)}
              >
                Confrim
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default RefundItem;
