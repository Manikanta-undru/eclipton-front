import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import closeIcon from '../../../../assets/images/market-place/icons/close.png';
import { alertBox } from '../../../../commonRedux';
import { history } from '../../../../store';
import Button from '../../../../components/Button';
import {
  removeCart,
  updateCart,
  updateCartPrice,
} from '../../../../http/product-cart-calls';
import { getProductPromotion } from '../../../../http/promotion-calls';
import { getAllPairs, productAddToCart } from '../../../../http/wallet-calls';

require('../../../../pages/MarketArea/_styles/market-area.scss');
require('./my-cart.scss');
let cart = JSON.parse(window.localStorage.getItem('cartItem'));

class CartItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheckout: this.props.isCheckout,
      item: this.props.cartItem,
      is_balance: false,
      quantity: 1,
      cart_total: 0,
    };
    this.handleCheckout = this.handleCheckout.bind(this);
  }

  componentDidMount = () => {
    if (this.state.item._id) {
      this.fetchData();
    }
  };

  fetchData() {
    var err = [];
    const formData = {
      product_id: this.state.item._id,
    };
    getProductPromotion(formData).then(
      async (res) => {
        if (res) {
          console.log('getProductPromotion', formData, res);
        }
      },
      (error) => {
        err.push(error.message);
      }
    );
  }

  handleClick = (e, item) => {
    var val = e.target.value;
    if (item.stock < parseInt(val) || item.stock === parseInt(val)) {
      alertBox(true, 'Out of Stock');
    }
  };

  handleInput = (e, item) => {
    const val = e.target.value;
    const name = e.target.name;
    updateCart({
      product_id: item._id,
      quantity: val,
    }).then(
      async (resp) => {
        const objIndex = cart.findIndex((obj) => obj._id === item._id);
        cart[objIndex].quantity = val;
        window.localStorage.setItem('cartItem', JSON.stringify(cart));
        item.quantity = val;
        this.setState({
          [name]: val,
        });
        alertBox(true, 'Quantity updated!', 'success');
      },
      (error) => {
        alertBox(true, error.message);
      }
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

  handleCheckout = (e, item) => {
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

  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout">
          {this.state.item && (
            <div className="body grid-equals">
              <div className="detail">
                <div className="left">
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
                    )}
                </div>
                <div className="right">
                  <h4> {this.state.item.title} </h4>
                  <p>
                    {' '}
                    Estimated delivery at{' '}
                    <span>
                      {' '}
                      {moment(new Date(this.state.item.cart_created_at))
                        .add(this.state.item.returns[0].no_of_days, 'days')
                        .format('MMM DD, YYYY')}{' '}
                    </span>
                    (may be some days changes happen due to some technical
                    issue)
                  </p>
                  <p>
                    {' '}
                    Delivery fee{' '}
                    {this.state.item.delivery_data != null
                      ? this.state.item.delivery_data?.currency +
                        '-' +
                        this.state.item.delivery_data?.amount
                      : ''}{' '}
                  </p>
                  {this.state.item.is_balance === true && (
                    <span style={{ color: 'red', width: '100%' }}>
                      Error in checkout, please check your{' '}
                      {this.state.item.currency} balance
                      <Link to="/wallet/deposit"> Click here to buy now</Link>
                    </span>
                  )}
                  {this.state.item.is_balance === false && (
                    <span style={{ color: 'green', width: '100%' }}>
                      Success continue to checkout, you have a sufficient
                      balance in {this.state.item.currency}
                    </span>
                  )}
                </div>
              </div>

              <div className="price">
                <p>
                  {' '}
                  {this.state.item.price.toFixed(8)} {this.state.item.currency}{' '}
                </p>
              </div>

              <div className="quantity">
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  max={this.state.item.stock}
                  placeholder="Quantity"
                  className="form-control"
                  value={this.state.item.quantity}
                  onChange={(e) => this.handleInput(e, this.state.item)}
                  onClick={(e) => this.handleClick(e, this.state.item)}
                />
              </div>

              <div className="total">
                <p>
                  {' '}
                  {(this.state.item.price * this.state.item.quantity).toFixed(
                    8
                  )}{' '}
                  {this.state.item.currency}
                </p>
              </div>
              <div className="checkout btns">
                <Button
                  className="btn-2"
                  onClick={(e) => this.handleCheckout(e, this.state.item)}
                >
                  {' '}
                  Proceed to Checkout{' '}
                </Button>
              </div>
              <span className="close-icon">
                <img
                  src={closeIcon}
                  alt=""
                  onClick={(e) => this.removeFromCart(e, this.state.item)}
                />
              </span>
            </div>
          )}
          {cart === null || (cart.length === 0 && <p>Add products to cart</p>)}
        </div>
      </div>
    );
  }
}

export default CartItem;
