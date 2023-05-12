import React, { Component } from 'react';

import CloseIcon from '../../../../assets/images/market-place/icons/close.png';
import A from '../../../../components/A';
import OrderItem from './order_item';
require('../../../../pages/MarketArea/_styles/market-area.scss');
require('../../chatWithSeller/chat-with-seller.scss');
class UserReportModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trigger: false,
      isCheckOutModel: this.props.isCheckOutModel,
      cart: this.props.cart,
    };
    this.triggerModal = this.triggerModal.bind(this);
  }

  triggerModal(e, cart) {
    e.preventDefault();
    let trigger = !this.state.trigger;
    this.setState({ trigger });
    this.props.parentCallback({
      cart: cart,
      isCheckOutModel: false,
    });
  }

  render() {
    return (
      <div className="market-place-styles">
        <div className="modal-1 user-report-modal big active">
          <div
            className="overlay close-modal"
            //                onClick={(e) => this.triggerModal(e, this.state.cart)}
          ></div>

          <div className="content">
            <div className="head">
              <span
                className="close-modal icon-close-modal"
                onClick={(e) => this.triggerModal(e, this.state.cart)}
              >
                <img src={CloseIcon} alt="" />
              </span>

              <p> The following items has been added to your cart </p>
            </div>

            <div className="body">
              <div className="grid-cart-modal">
                <div className="left">
                  <div className="cart-head">
                    <h3> Quick Cart </h3>
                  </div>
                  <p> {this.state.cart.length} items in your shopping cart </p>

                  <div className="btns">
                    <A href="/market-default-view">
                      <button className="btn-2 btn-block">
                        {' '}
                        Continue Shopping{' '}
                      </button>
                    </A>
                    <A href="/market-my-cart">
                      <button className="btn-2 btn-block"> View Cart </button>
                    </A>
                  </div>
                </div>

                <div className="right">
                  <div className="cart-head">
                    <h3> Your Order </h3>
                  </div>

                  <div className="cart-item-list">
                    {this.state.cart &&
                      this.state.cart.map((item) => {
                        return <OrderItem cartItem={item} key={item._id} />;
                      })}
                  </div>
                </div>
              </div>

              {/* <div className="also-like">
                            <div className="title1">
                                <h2> You May Also Like </h2>
                            </div>
                            <div className="product-wrapper">
                                <Product category={this.state.cart[0].category} />
                            </div>
                        </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserReportModal;
