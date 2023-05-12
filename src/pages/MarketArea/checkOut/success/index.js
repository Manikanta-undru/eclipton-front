import React from 'react';
import { Link } from 'react-router-dom';
import { getCheckouts } from '../../../../http/product-checkout-calls';
import { getCurrentUser } from '../../../../http/token-interceptor';

require('../../../../pages/MarketArea/_styles/market-area.scss');
const json_datas = require('countrycitystatejson');
let currentUser = JSON.parse(getCurrentUser());
class CheckoutSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkout_id:
        this.props.location && this.props.location.state
          ? this.props.location.state.checkout_id
          : null,
      from:
        this.props.location && this.props.location.state
          ? this.props.location.state.from
          : 'checkout',
      // '635925a3764c171daceb1bda'
    };
    this.orderDetail = this.orderDetail.bind(this);
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
      },
      (error) => {}
    );
  }

  orderDetail() {
    this.state.cart_items !== undefined &&
      this.state.cart_items.length > 0 &&
      this.state.cart_items.forEach((item, key) => {
        return (
          <div>
            <p>
              {' '}
              Title : <span> {item.title ? item.title : 'empty'} </span>{' '}
            </p>
            <p>
              {' '}
              Price :{' '}
              <span>
                {' '}
                {item.product_carts
                  ? item.product_carts.price * item.product_carts.quantity
                  : 'empty'}{' '}
              </span>{' '}
            </p>
            <p>
              {' '}
              Currency :{' '}
              <span>
                {' '}
                {item.product_carts
                  ? item.product_carts.currency
                  : 'empty'}{' '}
              </span>{' '}
            </p>
          </div>
        );
      });
  }

  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout">
          <div className="layout-3">
            {/* BEGIN :: HEAD */}
            <div className="head">
              <div className="left">
                <div className="imgs">
                  <span className="check">
                    <i className="fa fa-check"></i>
                  </span>
                </div>

                <div className="thank">
                  <p> Order #{this.state.checkout_id} </p>
                  <h2> Thank you! </h2>
                </div>
              </div>

              <div className="right">
                {this.state.from === 'checkout' && (
                  <Link to="/market-default-view" className="btn-1">
                    {' '}
                    Continue Shopping{' '}
                  </Link>
                )}
              </div>
            </div>
            {/* END :: HEAD */}

            {/* BEGIN :: HOLDER */}
            <div className="holder">
              {this.state.from === 'checkout' ? (
                <h2> Your Order is Confirmed! </h2>
              ) : (
                <h2> Your Order Info! </h2>
              )}
              {this.state.cart_items !== undefined &&
                this.state.cart_items.length > 0 &&
                this.state.cart_items.map((item, key) => {
                  if (
                    this.state.from === 'order_list' &&
                    item.userid === currentUser._id
                  ) {
                    return (
                      <div key={item._id}>
                        <p>
                          {' '}
                          Title :{' '}
                          <span>
                            {' '}
                            {item.title ? item.title : 'empty'}{' '}
                          </span>{' '}
                        </p>
                        <p>
                          {' '}
                          Price :{' '}
                          <span>
                            {' '}
                            {item.product_carts && item.product_carts.length > 0
                              ? item.product_carts[0].price *
                                item.product_carts[0].quantity
                              : 'empty'}{' '}
                          </span>{' '}
                        </p>
                        <p>
                          {' '}
                          Currency :{' '}
                          <span>
                            {' '}
                            {item.product_carts && item.product_carts.length > 0
                              ? item.product_carts[0].currency
                              : 'empty'}{' '}
                          </span>{' '}
                        </p>
                        <hr />
                      </div>
                    );
                  }
                  if (this.state.from === 'checkout') {
                    return (
                      <div key={item._id}>
                        <p>
                          {' '}
                          Title :{' '}
                          <span>
                            {' '}
                            {item.title ? item.title : 'empty'}{' '}
                          </span>{' '}
                        </p>
                        <p>
                          {' '}
                          Price :{' '}
                          <span>
                            {' '}
                            {item.product_carts && item.product_carts.length > 0
                              ? item.product_carts[0].price *
                                item.product_carts[0].quantity
                              : 'empty'}{' '}
                          </span>{' '}
                        </p>
                        <p>
                          {' '}
                          Currency :{' '}
                          <span>
                            {' '}
                            {item.product_carts && item.product_carts.length > 0
                              ? item.product_carts[0].currency
                              : 'empty'}{' '}
                          </span>{' '}
                        </p>
                        <hr />
                      </div>
                    );
                  }
                })}
            </div>
            {/* END :: HOLDER */}

            {/* BEGIN :: HOLDER */}
            <div className="holder">
              <h2> Customer Information </h2>
              <p>
                {' '}
                <span className="block"> Contact Information </span>{' '}
                {this.state.email}{' '}
              </p>
              <p>
                <span className="block"> Shipping address </span>
                Firstname: {this.state.firstname}
                <br />
                Address: {this.state.address} <br />
                Apartment: {this.state.apartment} <br />
                Postal_code: {this.state.postal_code} <br />
              </p>
              <p>
                <span className="block"> Payment method </span>
                Crypto Currency
                <br />
              </p>
              <p>
                <span className="block"> Comments </span>
                {this.state.comments}
                <br />
              </p>
            </div>
            {/* END :: HOLDER */}

            {/* BEGIN :: FOOTER */}
            <div className="foot">
              <div className="left">
                <p>
                  {' '}
                  <span> Need Help? Contact Us </span>{' '}
                </p>
              </div>

              <div className="right pull-right ms-auto me-2">
                {this.state.from === 'checkout' && (
                  <Link to="/market-default-view" className="btn-1">
                    {' '}
                    Continue Shopping{' '}
                  </Link>
                )}
              </div>
            </div>
            {/* END :: FOOTER */}
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutSuccess;
