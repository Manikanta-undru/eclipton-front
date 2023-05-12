import React from 'react';
import SideMenu2 from '../../../../pages/MarketArea/_widgets/sideMenu2';
import { Link } from 'react-router-dom';
import A from '../../../../components/A';
import {
  getCheckouts,
  updateCheckout,
} from '../../../../http/product-checkout-calls';
import { history } from '../../../../store';
import Button from '../../../../components/Button';
import { getDelivery } from '../../../../http/delivery-calls';
const json_datas = require('countrycitystatejson');
let cart = JSON.parse(window.localStorage.getItem('cartItem'));

require('../../../../pages/MarketArea/_styles/market-area.scss');

class CheckoutShipping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      delivery_details: [],
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
    getDelivery().then(
      async (resp) => {
        this.setState({
          delivery_details: resp.delivery_details,
        });
      },
      (err) => {}
    );
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

  handleButtonClick() {
    history.push({
      pathname: '/market-checkout-information',
      state: {
        checkout_id: this.state.checkout_id,
      },
    });
  }

  submit = (e) => {
    e.preventDefault();
    const formData = this.state;
    //    formData.checkout_id = this.state.checkout_id
    updateCheckout(formData).then(
      async (resp) => {
        const checkout_id = resp._id;
        history.push({
          pathname: '/market-checkout-payment',
          state: { checkout_id: checkout_id },
        });
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
                    {/* END :: SHIPPING INFO BOX */}
                  </div>
                  {/* END :: SHIPPING INFO BOX WRAPPRE */}

                  <table className="table">
                    <th>Title</th>
                    <th>Country</th>
                    <th>State</th>
                    <th>City</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    {cart.length > 0 &&
                      cart.map((data, key) => {
                        if (data.delivery_data.title !== undefined)
                          return (
                            <tr key={data._id}>
                              <td>{data.delivery_data.title}</td>
                              <td>{data.delivery_data.country}</td>
                              <td>{data.delivery_data.state}</td>
                              <td>{data.delivery_data.city}</td>
                              <td>{data.delivery_data.type}</td>
                              <td>
                                {data.delivery_data.type === 'paid'
                                  ? data.delivery_data.amount
                                  : null}
                              </td>
                              <td>
                                {data.delivery_data.type === 'paid'
                                  ? data.delivery_data.currency
                                  : null}
                              </td>
                            </tr>
                          );
                      })}
                  </table>
                  {/* BEGIN :: FORM GROUP 
                <div className="form-group type-1">
                  <label htmlFor=""> Shipping Method </label>
                  <div className="input-holder fixed-input">
                    <input type="text" className="form-control field" placeholder="Fixed Rate" />
                    <p className="abs">
                      <span className="strike"> ${this.state.total_price} </span>
                      <span> </span>
                    </p>
                  </div>
                </div>
              END :: FORM GROUP */}

                  <div className="btn-groups pull-right ms-auto me-2">
                    <Button
                      style={{ height: '40px' }}
                      onClick={this.handleButtonClick}
                      className="btn-2"
                    >
                      {' '}
                      Return to Information{' '}
                    </Button>
                    <A href="/market-checkout-shipping">
                      {' '}
                      <button className="btn-1"> Continue to Payment </button>
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
