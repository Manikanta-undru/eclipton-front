import React from 'react';
import { Link } from 'react-router-dom';

import { alertBox } from '../../../../commonRedux';
import {
  getCarts,
  removeCart,
  updateCart,
  updateCartPrice,
} from '../../../../http/product-cart-calls';
import Button from '../../../../components/Button';
import { getAllPairs, productAddToCart } from '../../../../http/wallet-calls';
import { history } from '../../../../store';

require('../../../../pages/MarketArea/_styles/market-area.scss');

require('../../chatWithSeller/chat-with-seller.scss');
let cart = JSON.parse(window.localStorage.getItem('cartItem'));
class OrderItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.cartItem,
      quantity: 1,
      cart_total: 0,
      is_balance: false,
    };
  }

  componentDidMount() {
    cart = JSON.parse(window.localStorage.getItem('cartItem'));
    if (cart == null) {
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
          data.price = data.product_carts.price;
          data.currency = data.product_carts.currency;
          data.discount = data.product_carts.discount;
        });
        cart = JSON.parse(window.localStorage.getItem('cartItem'));
        if (cart === null || cart.length === 0) {
          window.localStorage.setItem('cartItem', JSON.stringify(resp));
        }
      },
      (error) => {}
    );
  }

  handleInput = (e, item, type) => {
    let val = document.getElementById(item._id + ' quantity').value;
    if (type === 'increment') {
      val++;
      document.getElementById(item._id + ' quantity').value = new Number(val);
    } else {
      if (val > 1) val--;
      document.getElementById(item._id + ' quantity').value = new Number(val);
    }
    if (item.stock > parseInt(val) || item.stock === parseInt(val)) {
      updateCart({
        product_id: item._id,
        quantity: val,
      }).then(
        async (resp) => {
          this.setState({
            quantity: val,
          });
          cart = JSON.parse(window.localStorage.getItem('cartItem'));
          if (cart === null) {
            this.getCartsData();
          }
          if (cart.length > 0) {
            let objIndex = cart.findIndex((obj) => obj._id === item._id);
            cart[objIndex].quantity = val;
            window.localStorage.setItem('cartItem', JSON.stringify(cart));
            item.quantity = val;
            alertBox(true, 'Quantity updated!', 'success');
          }
        },
        (error) => {
          alertBox(true, error.message);
        }
      );
    } else {
      alertBox(true, 'Out Of Stock!');
    }
  };

  handleCheckout = (e, item) => {
    console.log(item, 'itemsss');
    e.preventDefault();
    this.setState({
      isCheckout: true,
      is_error: false,
    });
    let updated_cart_item = [];

    getAllPairs().then(
      async (resp) => {
        const espected_key = 'Estimated' + item.delivery_data.currency;
        let currencydata = resp.data.find(
          ({ currencySymbol }) => currencySymbol === item.currency
        );

        let espected_value = currencydata[espected_key];
        const delivery_fee =
          item.delivery_data.amount !== '' && espected_value !== undefined
            ? item.delivery_data.amount * espected_value
            : 1;
        updateCartPrice({
          cart_id: item.cart_id,
          price: item.price * item.quantity * delivery_fee,
        }).then(
          (updatedPriceResp) => {},
          (err) => {}
        );

        this.setState({
          userinfo: resp,
        });
        const data = {
          productId: item._id,
          currency: item.currency,
          amount: item.price * item.quantity * delivery_fee,
          type: 'Pending',
          currId: currencydata._id,
          SellerID: item.userid,
        };
        productAddToCart(data).then(
          (resp) => {
            if (resp.Status == true) {
              updated_cart_item.push({
                is_balance: false,
                ...item,
              });
              this.setState({
                isCheckout: true,
              });
              history.push({
                pathname: '/market-checkout-information',
                state: { comments: this.state.comments, products_id: item._id },
              });
            } else {
              alertBox(true, resp.Message);

              updated_cart_item.push({
                is_balance: true,
                ...item,
              });
              this.setState({
                cartItems: updated_cart_item,
              });

              this.setState({
                is_error: true,
                isCheckout: true,
              });
            }
          },
          (err) => {}
        );
      },
      (error) => {}
    );
  };
  removeFromCart(e, item) {
    e.preventDefault();
    const objIndex = cart.findIndex((obj) => obj._id === item._id);
    if (objIndex > -1) {
      // only splice array when item is found
      cart.splice(objIndex, 1); // 2nd parameter means remove one item only
    }
    window.localStorage.setItem('cartItem', JSON.stringify(cart));
    this.setState({
      item: null,
    });
    removeCart({
      cart_id: item.cart_id,
    }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
      },
      (error) => {
        alertBox(true, error.message);
      }
    );
  }

  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout">
          {this.state.item && (
            <div className="cart-item">
              <div className="imgs">
                {this.state.item.attachment !== undefined &&
                  this.state.item.attachment !== null &&
                  Object.keys(this.state.item.attachment).length > 0 && (
                    <img
                      src={
                        this.state.item.attachment[
                          Object.keys(this.state.item.attachment)[0]
                        ].src
                      }
                    />
                  )}{' '}
              </div>
              <div className="detail">
                <h3> {this.state.item.title} </h3>
                <p className="price">
                  {this.state.item.price} {this.state.item.currency}
                  <span> {this.state.item.discount}% OFF</span>
                </p>
                <h3>
                  {' '}
                  Delivery fee{' '}
                  {this.state.item.delivery_data
                    ? this.state.item.delivery_data.currency -
                      this.state.item.delivery_data.amount
                    : ''}{' '}
                </h3>
                {this.state.item.is_balance === true && (
                  <h3 style={{ color: 'red', width: '100%' }}>
                    Error in checkout, please check your{' '}
                    {this.state.item.currency} balance
                    <Link to="/wallet/deposit"> Click here to buy now</Link>
                  </h3>
                )}
                {this.state.item.is_balance === false && (
                  <h3 style={{ color: 'green', width: '100%' }}>
                    Success continue to checkout, you have a sufficient balance
                    in {this.state.item.currency}
                  </h3>
                )}
                <Button
                  className="btn-1 btn-block proceed_to_checkout_btn"
                  id="proceed_to_checkout_btn"
                  onClick={(e) => this.handleCheckout(e, this.state.item)}
                >
                  {' '}
                  Proceed to Checkout{' '}
                </Button>
              </div>
              <div className="inc-dec">
                <div className="grouping">
                  <button
                    onClick={(e) =>
                      this.handleInput(e, this.state.item, 'increment')
                    }
                  >
                    {' '}
                    +{' '}
                  </button>
                  <input
                    type="text"
                    id={this.state.item._id + ' quantity'}
                    name="quantity"
                    placeholder="Quantity"
                    className="form-control"
                    value={this.state.item.quantity}
                    onClick={(e) =>
                      this.handleInput(e, this.state.item, 'decrement')
                    }
                  />
                  <button
                    onClick={(e) =>
                      this.handleInput(e, this.state.item, 'decrement')
                    }
                  >
                    {' '}
                    -{' '}
                  </button>
                </div>
                <h5>
                  <p>
                    {' '}
                    {(this.state.item.price * this.state.item.quantity).toFixed(
                      8
                    )}{' '}
                  </p>
                </h5>

                <button
                  className="btn-1 btn-block"
                  onClick={(e) => this.removeFromCart(e, this.state.item)}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
          {cart === null || (cart.length === 0 && <p>Your Cart is empty</p>)}
        </div>
      </div>
    );
  }
}

export default OrderItem;
