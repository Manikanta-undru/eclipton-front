import React from 'react';
import SideMenu2 from '../../../../pages/MarketArea/_widgets/sideMenu2';
import { Link } from 'react-router-dom';
import A from '../../../../components/A';
import {
  completeCheckout,
  getCheckouts,
  updateCheckout,
} from '../../../../http/product-checkout-calls';
import { history } from '../../../../store';
import Button from '../../../../components/Button';
import { getCarts } from '../../../../http/product-cart-calls';
import { PayMarketplaceAmount } from '../../../../http/wallet-calls';
import { getUser } from '../../../../http/product-calls';
import { alertBox } from '../../../../commonRedux';

const json_datas = require('countrycitystatejson');

require('../../../../pages/MarketArea/_styles/market-area.scss');

class CheckoutShipping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total_price: 0,
      quantity: '',
      checkout_id:
        this.props.location && this.props.location.state
          ? this.props.location.state.checkout_id
          : null,
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentDidMount() {
    if (this.state.checkout_id) {
      this.fetchData();
    }
  }

  fetchData() {
    getCheckouts({
      checkout_id: this.state.checkout_id,
    }).then(
      async (resp) => {
        const city_data = json_datas.getCities(resp.country, resp.state);
        const cities = city_data.length > 0 ? city_data : [resp.state];
        this.setState({
          states: resp.country ? json_datas.getStatesByShort(resp.country) : [],
          cities: resp.country && resp.state ? cities : [],
        });
        this.setState(resp);
        resp.cart_items.map((item) => {
          this.setState({
            currency: item.product_carts.currency,
          });
        });
        console.log(resp, 'respresp');
      },
      (error) => {}
    );
  }

  handleButtonClick() {
    history.push({
      pathname: '/market-checkout-shipping',
      state: {
        checkout_id: this.state.checkout_id,
      },
    });
  }
  submit = (e) => {
    e.preventDefault();
    const formData = this.state;
    updateCheckout(formData).then(
      async (resp) => {},
      (error) => {}
    );

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
          this.setState({
            quantity: data.product_carts.quantity,
          });
        });
        completeCheckout({
          checkout_id: this.state.checkout_id,
          cartItem: resp,
        }).then(
          async (check_resp) => {
            resp.map((item) => {
              getUser({ userid: item.userid }).then(async (user_resp) => {
                const total_amount = item.product_carts.price;
                const data = {
                  currency: item.product_carts.currency,
                  email: user_resp.email,
                  amt: total_amount,
                  note: 'Product Checkout',
                  checkout_id: this.state.checkout_id,
                  product_id: item.product_carts.productid,
                  quantity: this.state.quantity,
                };
                console.log(data, 'datadata');
                PayMarketplaceAmount(data).then(
                  async (transfer_resp) => {
                    if (transfer_resp.status) {
                      history.push({
                        pathname: '/market-checkout-success',
                        state: {
                          checkout_id: this.state.checkout_id,
                          from: 'checkout',
                        },
                      });
                      window.localStorage.removeItem('cartItem');
                    } else {
                      alertBox(true, transfer_resp.message);
                    }
                  },
                  (error) => {}
                );
              });
            });
          },
          (error) => {}
        );
      },
      (error) => {}
    );
  };

  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout">
          <div className="layout-2">
            {/* BEGIN :: LEFT */}
            <div className="left">
              <SideMenu2 />
            </div>
            {/* END :: LEFT */}

            {/* BEGIN :: RIGHT */}
            <div className="right">
              {/* BEGIN :: FORM HOLDER 1 */}
              <div className="form-holder-1 checkout_form">
                <div className="title-with-button-block">
                  <div className="title-block">
                    {' '}
                    <h2> Shipping information </h2>{' '}
                  </div>
                  <div className="pull-right ms-auto me-2"> </div>
                </div>

                <form onSubmit={(e) => this.submit(e)} method="post">
                  {/* BEGIN :: SHIPPING INFO BOX WRAPPRE*/}
                  <div className="shipping-info-box-wrapper">
                    {/* BEGIN :: SHIPPING INFO BOX */}
                    <div className="shipping-info-box">
                      <div className="value">
                        {' '}
                        <p> Contact </p>{' '}
                      </div>
                      <div className="data">
                        {' '}
                        <p> {this.state.email} </p>{' '}
                      </div>
                      <div className="action">
                        {' '}
                        <Link
                          to={{
                            pathname: '/market-checkout-information',
                            state: {
                              checkout_id: this.state.checkout_id,
                            },
                          }}
                        >
                          {' '}
                          Change{' '}
                        </Link>{' '}
                      </div>
                    </div>

                    <div className="shipping-info-box">
                      <div className="value">
                        {' '}
                        <p> Ship to </p>{' '}
                      </div>
                      <div className="data">
                        {' '}
                        <p>
                          {' '}
                          {this.state.address}, {this.state.state},{' '}
                          {this.state.city}{' '}
                        </p>{' '}
                      </div>
                      <div className="action">
                        {' '}
                        <Link
                          to={{
                            pathname: '/market-checkout-information',
                            state: {
                              checkout_id: this.state.checkout_id,
                            },
                          }}
                        >
                          {' '}
                          Change{' '}
                        </Link>{' '}
                      </div>
                    </div>

                    <div className="shipping-info-box">
                      <div className="value">
                        {' '}
                        <p> Method </p>{' '}
                      </div>
                      <div className="data">
                        {' '}
                        <p>
                          {' '}
                          Fixed Rate {this.state.total_price}{' '}
                          {this.state.currency}
                        </p>{' '}
                      </div>
                      <div className="action">
                        {' '}
                        <Link
                          to={{
                            pathname: '/market-checkout-shipping',
                            state: {
                              checkout_id: this.state.checkout_id,
                            },
                          }}
                        >
                          {' '}
                          Change{' '}
                        </Link>{' '}
                      </div>
                    </div>
                    {/* END :: SHIPPING INFO BOX */}
                  </div>
                  {/* END :: SHIPPING INFO BOX WRAPPRE */}

                  {/* BEGIN :: PAYMENT BOX 1 
                <div className="payment-box-1">
                  <ul class="radio-1">
                    <li>
                      <input type="radio" id="option1" name="paymentOption" />
                      <label for="option1"> Pay through crypto wallet </label>

                      <div className="payment-option-detail">
                        <div className="icon">
                          <i className="fa fa-credit-card"></i>
                        </div>
                        <div className="detail">
                          <p> After clicking “Complete order”, you will be redirected to Debit - Credit Card to complete your purchase securely. </p>
                        </div>
                      </div>
                    </li>

                    <li>
                      <input type="radio" id="option2" name="paymentOption" />
                      <label for="option2"> Debit | Credit CardP </label>

                      <div className="payment-option-detail">
                        <div className="icon">
                          <i className="fa fa-credit-card"></i>
                        </div>
                        <div className="detail">
                          <p> After clicking “Complete order”, you will be redirected to Debit - Credit Card to complete your purchase securely. </p>
                        </div>
                      </div>
                    </li>

                    <li>
                      <input type="radio" id="option3" name="paymentOption" />
                      <label for="option3"> Bank Deposit </label>

                      <div className="payment-option-detail">
                        <div className="icon">
                          <i className="fa fa-credit-card"></i>
                        </div>
                        <div className="detail">
                          <p> After clicking “Complete order”, you will be redirected to Debit - Credit Card to complete your purchase securely. </p>
                        </div>
                      </div>
                    </li>

                    <li>
                      <input type="radio" id="option4" name="paymentOption" />
                      <label for="option4"> Cash on delivery </label>

                      <div className="payment-option-detail">
                        <div className="icon">
                          <i className="fa fa-credit-card"></i>
                        </div>
                        <div className="detail">
                          <p> After clicking “Complete order”, you will be redirected to Debit - Credit Card to complete your purchase securely. </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                 END :: PAYMENT BOX 1 */}

                  <div className="btn-groups pull-right ms-auto me-2">
                    <Button
                      style="height: 40px;"
                      onClick={this.handleButtonClick}
                      className="btn-2"
                    >
                      {' '}
                      Return to Shipping{' '}
                    </Button>
                    <A href="/market-checkout-payment">
                      <button className="btn-1"> Complete Offer </button>
                    </A>
                  </div>
                </form>
              </div>
              {/* END :: FORM HOLDER 1 */}
            </div>
            {/* END :: RIGHT */}
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutShipping;
