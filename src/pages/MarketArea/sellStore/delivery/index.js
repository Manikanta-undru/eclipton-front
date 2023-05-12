import React from 'react';
import MarketMenu from '../../../../components/Menu/MarketMenu';
import A from '../../../../components/A';
import Button from '../../../../components/Button';
import {
  createDelivery,
  getDelivery,
  updateDelivery,
} from '../../../../http/delivery-calls';
import { alertBox } from '../../../../commonRedux';
import SideMenu3 from '../../_widgets/sideMenu3';
import { getCurrentUser } from '../../../../http/token-interceptor';
import {
  getCitiesOfState,
  getCountryList,
  getStateList,
} from '../../../../http/http-calls';

require('../../_widgets/titleAndFilter/title-and-filter.scss');
require('../../_styles/market-area.scss');
require('./delivery.scss');
const coins = require('../../../Gionomy/add/coins.json');

const value = [];
const currentUser = JSON.parse(getCurrentUser());

class MarketDelivery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      coins: coins.slice(-5),
      country: '',
      states: [{ states_data: [] }],
      cities: [{ cities_data: [] }],
      delivery_id: '',
      delivery_details: [
        {
          title: '',
          country: '',
          state: '',
          city: '',
          amount: '',
          currency: '',
          type: '',
        },
      ],
    };
  }

  componentDidMount() {
    this.fetchData();
    this.getCountriesData();
  }

  getStateData = (isoCode, i) => {
    const state_temp = this.state.states;
    getStateList({ id: isoCode }).then(
      (resp) => {
        if (resp && resp.length > 0) {
          state_temp.splice(i, 0, { states_data: resp });
          this.setState({
            states: state_temp,
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

  getCityData = (countryCode, stateCode, i) => {
    const city_temp = this.state.cities;
    getCitiesOfState({ countryCode, stateCode }).then(
      (resp) => {
        if (resp && resp.length > 0) {
          city_temp.splice(i, 0, { cities_data: resp });
          this.setState({
            cities: city_temp,
          });
        }
      },
      (err) => {}
    );
  };

  fetchData() {
    getDelivery({
      userid: currentUser._id,
    }).then(
      async (resp) => {
        this.setState({
          delivery_id: resp._id,
          delivery_details: resp.delivery_details,
        });
        if (
          this.state.delivery_id !== undefined &&
          this.state.delivery_id !== ''
        ) {
          this.state.delivery_details.map((data, i) => {
            this.getCityData(data.country, data.state, i);
            if (data.country) this.getStateData(data.country, i);
          });
        }
      },
      (error) => {}
    );
  }

  handleDelivery = (i, e) => {
    const { name } = e.target;
    const temp = this.state.delivery_details;
    const val = e.target.value;
    temp[i][name] = val;
    if (name === 'country') {
      this.getStateData(val, i);
    }
    if (name === 'state') {
      this.getCityData(this.state.delivery_details[i].country, val, i);
    }

    this.setState({
      delivery_details: temp,
    });
  };

  submit = (e, t) => {
    e.preventDefault();
    const formData = {
      delivery_details: JSON.stringify(this.state.delivery_details),
    };
    if (this.state.delivery_id) {
      formData.delivery_id = this.state.delivery_id;
      updateDelivery(formData).then(
        async (res) => {
          alertBox(true, 'Delivery details Updated Successfully!', 'success');
        },
        (error) => {
          alertBox(true, 'Error update delivery detail!');
        }
      );
    } else {
      createDelivery(formData).then(
        async (res) => {
          alertBox(true, 'Delivery details created Successfully!', 'success');
        },
        (error) => {
          alertBox(true, 'Error create delivery detail!');
        }
      );
    }
  };

  addDelivery = () => {
    const temp = this.state.delivery_details;
    const state_temp = this.state.states;
    state_temp.push({ states_data: [] });
    const city_temp = this.state.cities;
    city_temp.push({ cities_data: [] });
    temp.push({
      title: '',
      country: '',
      state: '',
      city: [],
      amount: '',
      currency: '',
      type: '',
    });
    this.setState({
      delivery_details: temp,
      states: state_temp,
      cities: city_temp,
    });
  };

  removeDelivery = (i) => {
    const temp = this.state.delivery_details;
    const state_temp = this.state.states;
    const city_temp = this.state.cities;
    delete temp[i];
    delete state_temp[i];
    delete city_temp[i];
    this.setState({
      delivery_details: temp,
      states: state_temp,
      cities: city_temp,
    });
  };

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
                    <div className="head">
                      <div className="left">
                        <h2> Delivery Details </h2>
                      </div>
                    </div>
                    <form onSubmit={(e) => this.submit(e)} method="post">
                      {this.state.delivery_details.map((v, i) => (
                        <div className="delivery_details" key={i}>
                          <div className="row">
                            <div className="col-md-1" style={{ marginTop: 30 }}>
                              <label className="link-btn-2" htmlFor="">
                                <span className="badge"> {i + 1} </span>
                              </label>
                            </div>
                            <div className="col-md-11">
                              <label htmlFor="">Title</label>
                              <input
                                type="text"
                                required
                                placeholder="Enter the title"
                                name="title"
                                className="form-control w-100"
                                onChange={(e) => this.handleDelivery(i, e)}
                                value={this.state.delivery_details[i].title}
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="">Country</label>
                              <select
                                name="country"
                                id="country"
                                required
                                value={this.state.delivery_details[i].country}
                                className="form-control"
                                onChange={(e) => this.handleDelivery(i, e)}
                              >
                                <option value=""> --- </option>
                                {this.state.countries &&
                                  this.state.countries.length > 0 &&
                                  this.state.countries.map((e, i) => (
                                    <option
                                      value={e.isoCode}
                                      key={e.isoCode}
                                      // selected={e.shortName === this.state.delivery_details[i].country}
                                    >
                                      {e.name}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <label htmlFor="">State</label>
                              <select
                                name="state"
                                id="state"
                                required
                                value={this.state.delivery_details[i].state}
                                className={
                                  `form-control ` + `delivery_details_state${i}`
                                }
                                onChange={(e) => this.handleDelivery(i, e)}
                              >
                                <option value=""> --- </option>
                                {this.state.states[i] !== undefined &&
                                  this.state.states[i].states_data &&
                                  this.state.states[i].states_data.length > 0 &&
                                  this.state.states[i].states_data.map(
                                    (e, i) => (
                                      <option
                                        value={e.isoCode}
                                        key={e.isoCode}
                                        // selected={e === this.state.delivery_details[i].state}
                                      >
                                        {e.name}
                                      </option>
                                    )
                                  )}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <label htmlFor="">City</label>

                              {/* this.state.cities[i] !== undefined &&
                                                                     <MultiSelect
                                                                 options={this.state.cities[i].cities_data}
                                                                 value={this.state.delivery_details[i].city}
                                                                 onChange={(e) => this.handleDelivery(i, e)}
                                                                 labelledBy="Select"
                                                                     /> */}
                              {
                                <select
                                  name="city"
                                  id="city"
                                  required
                                  value={this.state.delivery_details[i].city}
                                  className={
                                    `form-control ` +
                                    `delivery_details_city${i}`
                                  }
                                  onChange={(e) => this.handleDelivery(i, e)}
                                >
                                  <option value=""> --- </option>
                                  {this.state.cities[i] !== undefined &&
                                    this.state.cities[i].cities_data &&
                                    this.state.cities[i].cities_data.length >
                                      0 &&
                                    this.state.cities[i].cities_data.map(
                                      (e, i) => (
                                        <option
                                          value={e.name}
                                          key={e.name}
                                          // selected={e === this.state.delivery_details[i].city}
                                        >
                                          {e.name}
                                        </option>
                                      )
                                    )}
                                </select>
                              }
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3">
                              <label htmlFor="">Delivery Type</label>
                              <select
                                name="type"
                                id="type"
                                value={this.state.delivery_details[i].type}
                                className="form-control"
                                onChange={(e) => this.handleDelivery(i, e)}
                              >
                                <option value="">--</option>
                                <option value="paid">Paid</option>
                                <option value="free_delivery">
                                  Free delivery
                                </option>
                                <option value="direct_delivery">
                                  Direct delivery
                                </option>
                              </select>
                            </div>
                            {this.state.delivery_details[i].type === 'paid' && (
                              <div className="col-md-3">
                                <label htmlFor="">Delivery Fee</label>
                                <input
                                  type="number"
                                  required
                                  placeholder="Enter the amount"
                                  name="amount"
                                  className="form-control w-100"
                                  onChange={(e) => this.handleDelivery(i, e)}
                                  value={this.state.delivery_details[i].amount}
                                />
                                <div
                                  className="input-condition-info"
                                  style={{ fontSize: 12 }}
                                >
                                  <p>
                                    {' '}
                                    The fiat currency has been changed to crypto
                                    currency during the checkout process{' '}
                                  </p>
                                </div>
                              </div>
                            )}
                            {this.state.delivery_details[i].type === 'paid' && (
                              <div className="col-md-3">
                                <label htmlFor="">Currency</label>
                                <select
                                  name="currency"
                                  id="currency"
                                  value={
                                    this.state.delivery_details[i].currency
                                  }
                                  className="form-control"
                                  onChange={(e) => this.handleDelivery(i, e)}
                                >
                                  <option value="">--</option>
                                  {this.state.coins.map((coin, key) => (
                                    <option
                                      // selected={ coin.currencySymbol === this.state.currency}
                                      value={coin.currencySymbol}
                                      key={key}
                                    >
                                      {coin.currencySymbol}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                            <div className="col-md-3" style={{ marginTop: 36 }}>
                              {i > 0 && (
                                <Button
                                  type="button"
                                  onClick={() => this.removeDelivery(i)}
                                  size="compact"
                                  variant="primary-outline"
                                >
                                  <i className="fa fa-minus" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <hr />
                        </div>
                      ))}
                      <br />
                      <div className="row d-flex">
                        <div className="col-md-4">
                          <Button
                            type="button"
                            onClick={this.addDelivery}
                            size="compact"
                            variant="primary-outline"
                          >
                            <i className="fa fa-plus" />
                          </Button>
                        </div>
                        <div className="col-md-8">
                          <div className="btn-groups ms-auto me-2">
                            <A href="/market-delivery">
                              <button className="btn-1">
                                {' '}
                                Save Delivery Details{' '}
                              </button>
                            </A>
                          </div>
                        </div>
                      </div>
                    </form>
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

export default MarketDelivery;
