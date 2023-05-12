import React from 'react';
import { Link } from 'react-router-dom';

import A from '../../../../components/A';
import CartItem from './item';
import { getCarts } from '../../../../http/product-cart-calls';
require('../../../../pages/MarketArea/_styles/market-area.scss');
require('./my-cart.scss');
let cart = JSON.parse(window.localStorage.getItem('cartItem'));

class MyCart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems:
        this.props.location &&
        this.props.location.cart &&
        this.props.location.cart.length > 0
          ? this.props.location.cart
          : this.getCarts(cart),
      quantity: 1,
      cart_total: 0,
      updatedCartItems: [],
      isCheckout: false,
      comments: '',
      //is_error: false
    };
    //this.handleCheckout = this.handleCheckout.bind(this)
  }

  getCarts(cart) {
    if (cart && cart.length > 0) {
      return cart;
    } else {
      return [];
    }
  }

  componentDidMount() {
    if (this.state.cartItems === null || this.state.cartItems.length === 0) {
      this.getCartsData();
    }
  }

  getCartsData() {
    getCarts({
      //product_id: this.state.products._id
    }).then(
      async (resp) => {
        resp.map((data) => {
          data.quantity = data.product_carts.quantity;
          data.cart_id = data.product_carts._id;
          data.cart_created_at = data.product_carts.createdAt;
          data.price = data.product_carts.price;
          data.currency = data.product_carts.currency;
          data.discount = data.product_carts.discount;
        });
        this.setState({
          cartItems: resp,
        });
        let cart = JSON.parse(window.localStorage.getItem('cartItem'));
        if (cart === null || cart.length === 0) {
          window.localStorage.setItem('cartItem', JSON.stringify(resp));
        }
      },
      (error) => {}
    );
  }

  handleChange = (e) => {
    const val = e.target.value;
    const name = e.target.name;
    this.setState({
      [name]: val,
    });
  };

  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout">
          <div className="breadcrumb-1">
            <ul>
              <li>
                {' '}
                <Link to="/market-default-view"> Home </Link>{' '}
              </li>
              <li> Shopping Cart </li>
            </ul>
          </div>

          <div className="my-cart-block">
            <div className="top">
              <h2> My Cart </h2>
              {/* <div className="progress-area">
              <div className="progress">
                <div className="progress-bar" style={{ width: "20%" }} role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                  <span> 20% </span>
                </div>
              </div>
            </div>

            <div className="progress-status"> Only <span> $649.00 </span> away from Free Shipping </div> */}
            </div>

            <div className="bottom">
              <div className="left">
                {/* BEGIN :: HEAD */}
                <div className="head grid-equals">
                  <div>
                    {' '}
                    <p> Your Order </p>{' '}
                  </div>
                  <div>
                    {' '}
                    <p> Price </p>{' '}
                  </div>
                  <div>
                    {' '}
                    <p> Quantity </p>{' '}
                  </div>
                  <div>
                    {' '}
                    <p> Total </p>{' '}
                  </div>
                  <div>
                    {' '}
                    <p> Checkout </p>{' '}
                  </div>
                  <div> </div>
                </div>
                {/* END :: HEAD */}

                <div className="holder">
                  {/* BEGIN :: BODY */}
                  {!this.state.isCheckout &&
                    this.state.cartItems &&
                    this.state.cartItems.length > 0 &&
                    this.state.cartItems.map((item) => {
                      return (
                        <CartItem
                          cartItem={item}
                          key={item._id}
                          isCheckout={this.state.isCheckout}
                        />
                      );
                    })}
                  {this.state.isCheckout &&
                    this.state.cartItems &&
                    this.state.cartItems.length > 0 &&
                    this.state.cartItems.map((item) => {
                      return (
                        <CartItem
                          cartItem={item}
                          key={item._id}
                          isCheckout={this.state.isCheckout}
                        />
                      );
                    })}
                  {/* END :: BODY */}
                </div>

                <form action="">
                  <div className="form-group type-1">
                    <label htmlFor=""> Additional Comments </label>

                    <textarea
                      name="comments"
                      value={this.state.comments}
                      onChange={(e) => this.handleChange(e)}
                      placeholder="Special instructions for seller ..."
                      className="form-control"
                    ></textarea>
                  </div>
                </form>
              </div>

              <div className="right">
                <div className="body">
                  {/* BEGIN :: SUMMARY TOTAL */}

                  {/* END :: SUMMARY TOTAL */}

                  {/* BEGIN :: BTNS */}
                  <div className="btns">
                    <A href="/market-default-view">
                      {' '}
                      <button className="btn-2"> Continue Shopping </button>
                    </A>
                  </div>
                  {/* END :: BTNS */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyCart;
