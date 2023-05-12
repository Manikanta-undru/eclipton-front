import React from 'react';
import SideMenu2 from '../../../../pages/MarketArea/_widgets/sideMenu2';
import { Link } from 'react-router-dom';
import A from '../../../../components/A';
import {
  createCheckout,
  getUserCheckoutInfo,
  updateCheckout,
} from '../../../../http/product-checkout-calls';
import { history } from '../../../../store';
import { getCarts } from '../../../../http/product-cart-calls';
import randomFourDigitPin from 'random-four-digit-pin';
import {
  getCitiesOfState,
  getCountryList,
  getStateList,
} from '../../../../http/http-calls';
import { alertBox } from '../../../../commonRedux';

require('../../../../pages/MarketArea/_styles/market-area.scss');

class CheckoutInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      comments:
        this.props.location && this.props.location.state
          ? this.props.location.state.comments
          : '',
      products_id:
        this.props.location && this.props.location.state
          ? this.props.location.state.products_id
          : '',
      states: [],
      cities: [],
      email: '',
      orderid: '',
      country: '',
      quantity: '',
      state: '',
      city: '',
      firstname: '',
      lastname: '',
      address: '',
      apartment: '',
      postal_code: '',
      phone_number: '',
      total_price: '',
      cart_items: [],
      is_information_saved: false,
      is_email_me: false,
      checkout_id:
        this.props.location && this.props.location.state
          ? this.props.location.state.checkout_id
          : null,
    };
  }
  componentDidMount() {
    this.getCheckoutInfoData();
    this.getCartsData();

    this.getCountriesData();
  }

  getStateData = (isoCode) => {
    getStateList({ id: isoCode }).then(
      (resp) => {
        if (resp && resp.length > 0) {
          this.setState({
            states: resp,
          });
        }
      },
      (err) => {}
    );
  };
  getCountriesData = () => {
    getCountryList().then(
      (resp) => {
        if (resp && resp.length > 0) {
          this.setState({
            countries: resp,
          });
        }
      },
      (err) => {}
    );
  };

  getCityData = (countryCode, stateCode) => {
    getCitiesOfState({ countryCode: countryCode, stateCode: stateCode }).then(
      (resp) => {
        if (resp && resp.length > 0) {
          this.setState({
            cities: resp,
          });
        }
      },
      (err) => {}
    );
  };

  getCheckoutInfoData() {
    getUserCheckoutInfo().then(
      async (resp) => {
        delete resp.comments;
        this.setState({
          countries: this.getCountriesData(),
          states: resp.country ? this.getStateData(resp.country) : [],
          cities:
            resp.country && resp.state
              ? this.getCityData(resp.country, resp.state)
              : [],
        });
        this.setState(resp);
      },
      (err) => {}
    );
  }

  getCartsData() {
    if (this.state.products_id != '') {
      getCarts({
        product_id: this.state.products_id,
      }).then(
        async (Proresp) => {
          Proresp.map((resp) => {
            let product_carts = resp.product_carts;

            product_carts.map((data) => {
              this.setState({
                quantity: Number(data.quantity),
              });

              this.setState({
                total_price: Number(data.quantity * data.price),
              });
            });
          });
        },
        (error) => {}
      );
    } else {
      /* empty */
    }
  }

  handleChange = (e) => {
    const val = e.target.value;
    const name = e.target.name;
    if (name === 'country') {
      this.getStateData(val);
    }
    if (name === 'state') {
      this.getCityData(this.state.country, val);
    }
    this.setState({
      [name]: val,
    });
  };

  handleInput = (e) => {
    const val = e.target.value;
    const name = e.target.name;
    this.setState({
      [name]: val,
    });
  };

  submit = (e) => {
    e.preventDefault();
    let err = [];
    if (this.state.email === '') err.push('Email is required');
    if (this.state.country === '') err.push('Country is required');
    if (this.state.state === '') err.push('State is required');
    if (this.state.city === '') err.push('City is required');
    if (this.state.firstname === '') err.push('Fristname is required');
    if (this.state.lastname === '') err.push('Lastname is required');
    if (this.state.address === '') err.push('Address is required');
    if (this.state.apartment === '') err.push('Apartment is required');
    if (this.state.postal_code === '') err.push('Postal code is required');
    if (this.state.phone_number === '') err.push('Phone number is required');
    const formData = {
      email: this.state.email,
      country: this.state.country,
      state: this.state.state,
      city: this.state.city,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      address: this.state.address,
      apartment: this.state.apartment,
      postal_code: this.state.postal_code,
      phone_number: this.state.phone_number,
      total_price: this.state.total_price,
      quantity: this.state.quantity,
    };
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      if (this.state.checkout_id) {
        updateCheckout(formData).then(
          async (resp) => {
            const checkout_id = resp._id;
            history.push({
              pathname: '/market-checkout-shipping',
              state: { checkout_id: checkout_id },
            });
          },
          (error) => {}
        );
      } else {
        getCarts({
          product_id: this.state.products_id,
        }).then(
          async (cart_resp) => {
            this.setState({
              cart_items: JSON.stringify(cart_resp),
            });
            formData.cart_items = JSON.stringify(cart_resp);
            formData.quantity = this.state.quantity;
            formData.orderid = randomFourDigitPin.generate();
            createCheckout(formData).then(
              async (resp) => {
                const checkout_id = resp._id;
                history.push({
                  pathname: '/market-checkout-shipping',
                  state: { checkout_id: checkout_id },
                });
              },
              (error) => {}
            );
          },
          (error) => {}
        );
      }
    }
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
              <div
                className="form-holder-1 checkout_form"
                style={{ padding: 45 }}
              >
                <div className="title-with-button-block">
                  <div className="title-block">
                    {' '}
                    <h2> Contact information </h2>{' '}
                  </div>
                  <div className="pull-right ms-auto me-2">
                    {' '}
                    <p>
                      {' '}
                      Already have an account ? <Link to="\"> Login </Link>{' '}
                    </p>{' '}
                  </div>
                </div>

                <form onSubmit={(e) => this.submit(e)} method="post">
                  {/* BEGIN :: FORM GROUP */}
                  <div className="form-group type-1">
                    <label htmlFor="email"> Email </label>
                    <div className="input-holder">
                      <input
                        type="text"
                        name="email"
                        className="form-control field"
                        value={this.state.email}
                        placeholder="Enter your email address"
                        onChange={this.handleInput}
                      />
                    </div>
                    {/* <div className="input-condition-info">
                    <label className="checkbox-holder"> 
                      <input type="checkbox" checked={this.state.is_email_me} 
                      onChange={(e) => this.setState({ is_email_me: e.target.checked })} /> 
                      Email me with news and offers 
                    </label>
                  </div> */}
                  </div>
                  {/* END :: FORM GROUP */}

                  {/* BEGIN :: FORM GROUP */}
                  <div className="form-group type-1">
                    <div className="title-with-button-block">
                      <div className="title-block">
                        {' '}
                        <h2> Shipping Address </h2>{' '}
                      </div>
                    </div>

                    <div className="input-holder">
                      <label htmlFor="country"> Country / Region </label>
                      <select
                        name="country"
                        id="country"
                        required
                        value={this.state.country}
                        className="form-control"
                        onChange={this.handleChange}
                      >
                        <option value=""> --- </option>
                        {this.state.countries &&
                          this.state.countries.length > 0 &&
                          this.state.countries.map((e, i) => {
                            return (
                              <option
                                value={e.isoCode}
                                key={e.isoCode}
                                selected={e.isoCode === this.state.country}
                              >
                                {e.name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <div className="input-holder">
                      <label htmlFor="title"> State </label>
                      <select
                        name="state"
                        id="state"
                        required
                        value={this.state.state}
                        className="form-control"
                        onChange={this.handleChange}
                      >
                        <option value=""> --- </option>
                        {this.state.states &&
                          this.state.states.length > 0 &&
                          this.state.states.map((e, i) => {
                            return (
                              <option
                                value={e.isoCode}
                                key={e.isoCode}
                                selected={e.isoCode === this.state.state}
                              >
                                {e.name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <div className="input-holder">
                      <label htmlFor="title"> City </label>
                      <select
                        name="city"
                        id="city"
                        required
                        value={this.state.city}
                        className="form-control"
                        onChange={this.handleChange}
                      >
                        <option value=""> --- </option>
                        {this.state.cities &&
                          this.state.cities.length > 0 &&
                          this.state.cities.map((e, i) => {
                            return (
                              <option
                                value={e.name}
                                key={e.name}
                                selected={e.name === this.state.city}
                              >
                                {e.name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  {/* BEGIN :: FORM GROUP */}
                  <div className="split-2 form-group type-1">
                    <div className="left">
                      <div className="input-holder">
                        <label htmlFor="firstname"> Firstname </label>
                        <input
                          name="firstname"
                          id="firstname"
                          value={this.state.firstname}
                          className="form-control"
                          onChange={this.handleInput}
                          placeholder="Enter your firstname"
                        />
                      </div>
                    </div>

                    <div className="right">
                      <div className="input-holder">
                        <label htmlFor="lastname"> Lastname </label>
                        <input
                          name="lastname"
                          id="lastname"
                          value={this.state.lastname}
                          className="form-control"
                          onChange={this.handleInput}
                          placeholder="Enter your lastname"
                        />
                      </div>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  {/* BEGIN :: FORM GROUP */}
                  <div className="form-group type-1">
                    <label htmlFor="address"> Address </label>
                    <div className="input-holder">
                      <input
                        name="address"
                        id="address"
                        value={this.state.address}
                        className="form-control"
                        onChange={this.handleInput}
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  {/* BEGIN :: FORM GROUP */}
                  <div className="form-group type-1">
                    <label htmlFor="apartment"> Apartment </label>
                    <div className="input-holder">
                      <input
                        name="apartment"
                        id="apartment"
                        value={this.state.apartment}
                        className="form-control"
                        onChange={this.handleInput}
                        placeholder="Apartment, suites, etc..(Optional)"
                      />
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  {/* BEGIN :: FORM GROUP */}
                  <div className="split-2 form-group type-1">
                    <div className="left">
                      <div className="input-holder">
                        <label htmlFor="postal_code"> Postal Code </label>
                        <input
                          name="postal_code"
                          id="postal_code"
                          value={this.state.postal_code}
                          className="form-control"
                          onChange={this.handleInput}
                          placeholder="Enter your country's postal code"
                        />
                      </div>
                    </div>

                    <div className="right">
                      <div className="input-holder">
                        <label htmlFor="phone_number"> Phone Number </label>
                        <input
                          name="phone_number"
                          id="phone_number"
                          value={this.state.phone_number}
                          className="form-control"
                          onChange={this.handleInput}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  {/* BEGIN :: FORM GROUP */}
                  <div className="form-group type-1">
                    <div className="input-condition-info">
                      <label className="checkbox-holder">
                        <input
                          type="checkbox"
                          name="is_information_saved"
                          className="me-2"
                          checked={this.state.is_information_saved}
                          onChange={(e) =>
                            this.setState({
                              is_information_saved: e.target.checked,
                            })
                          }
                        />
                        Save this information for next time
                      </label>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  <div className="btn-groups pull-right ms-auto me-2">
                    <A href="/market-my-cart">
                      <button className="btn-2"> Return to Cart </button>
                    </A>
                    <A
                      href="/market-checkout-information"
                      //href="/market-checkout-shipping"
                    >
                      <button className="btn-1"> Continue to Shipping </button>
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

export default CheckoutInformation;
