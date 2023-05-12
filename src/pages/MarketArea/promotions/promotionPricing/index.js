import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import A from '../../../../components/A';
import Button from '../../../../components/Button';
import {
  getPromotion,
  promotionUpdatePricing,
} from '../../../../http/promotion-calls';
import { history } from '../../../../store';
import 'react-datepicker/dist/react-datepicker.css';
import { alertBox } from '../../../../commonRedux';
import { getAllProduct } from '../../../../http/product-calls';

require('../../_styles/market-area.scss');
const coins = require('../../../Gionomy/add/coins.json');
const times = require('./time.json');

class PromotionPricing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins,
      times,
      currency: '',
      code: '',
      price: '',
      type: '',
      productOptions: [],
      product_ids: [],
      start_date: new Date(),
      end_date: new Date(),
      start_time: '10:00',
      end_time: '10:00',
      promotion_id: this.props.location.state
        ? this.props.location.state.promotion_id
        : '',
    };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
    this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
  }

  componentDidMount() {
    if (this.state.promotion_id) {
      this.fetchData();
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  handleInput = (e) => {
    const val = e.target.value;
    const { name } = e.target;
    if (name === 'currency') {
      getAllProduct({ currency: val }).then(
        (resp) => {
          const options = [];
          resp.map((data, key) => {
            options.push({
              value: data._id,
              label: (
                <div
                  key={data._id}
                  className="media w-100 d-flex align-items-center"
                >
                  <Link
                    to={{ pathname: `/market-product-detail-view/${data._id}` }}
                  >
                    <div className="media-left">
                      {data.attachment !== undefined &&
                        data.attachment !== null &&
                        Object.keys(data.attachment).length > 0 && (
                          <img
                            className="media-object pic circle"
                            src={
                              data.attachment[Object.keys(data.attachment)[0]]
                                .src
                            }
                          />
                        )}
                    </div>
                  </Link>
                  <div className="media-body">
                    <p className="media-heading">
                      {data.title} | {data.amount} - {data.price_currency}{' '}
                    </p>
                  </div>
                </div>
              ),
            });
          });
          this.setState({
            productOptions: options,
          });
        },
        (err) => {}
      );
    }
    this.setState({
      [name]: val,
    });
  };

  handleChange = (e) => {
    const val = e.target.value;
    const { name } = e.target;
    this.setState({
      [name]: val,
    });
  };

  fetchData() {
    const formData = {
      promotion_id: this.state.promotion_id,
    };
    getPromotion(formData).then(
      async (res) => {
        this.setState(res);
      },
      (error) => {}
    );
  }

  handleCancel() {
    history.push({
      pathname: '/market-promotion-overview',
      state: { promotion_id: this.state.promotion_id },
    });
  }

  handleChangeStartDate(date) {
    this.setState({
      start_date: date,
    });
  }

  handleChangeEndDate(date) {
    this.setState({
      end_date: date,
    });
  }

  handleProductChange = (selected) => {
    console.log(selected);
    this.setState({
      product_ids: selected,
    });
  };

  submit = (e, t) => {
    e.preventDefault();
    let err = [];
    if (this.state.currency === '') err.push('Currency is required');
    if (this.state.offer === '') err.push('Offer is required');
    if (this.state.offer_type === '') err.push('Type is required');
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      const formData = this.state;
      if (this.state.promotion_id) {
        promotionUpdatePricing(formData).then(
          async (res) => {
            if (t === 1) {
              alertBox(true, 'Pricing has been saved!', 'success');
              history.push({
                pathname: '/market-promotion-banner',
                state: { promotion_id: res._id },
              });
            } else {
              alertBox(true, 'Pricing draft has been saved!', 'success');
              history.push({
                pathname: '/market-promotion-pricing',
                state: { promotion_id: res._id },
              });
            }
          },
          (error) => {
            alertBox(true, 'Error Update Promotion!');
          }
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
              <div className="side-menu-1">
                <div className="holder">
                  <NavLink className="step" to="/market-promotion-overview">
                    {' '}
                    Promotion Overview{' '}
                  </NavLink>
                  <NavLink className="step" to="/market-promotion-pricing">
                    {' '}
                    Pricing{' '}
                  </NavLink>
                  <NavLink className="step" to="/market-promotion-banner">
                    {' '}
                    Banner{' '}
                  </NavLink>
                </div>
              </div>
            </div>
            {/* END :: LEFT */}

            {/* BEGIN :: RIGHT */}
            <div className="right">
              {/* BEGIN :: FORM HOLDER 1 */}
              <div className="form-holder-1">
                <div className="title-with-button-block">
                  <div className="title-block">
                    <h2> Create Your Promotion Duration </h2>
                  </div>
                </div>

                <form onSubmit={(e) => this.submit(e, 1)} method="post">
                  {/* BEGIN :: FORM GROUP */}
                  <div className="form-group type-1">
                    <div className="row">
                      <div className="col-md-6">
                        <label htmlFor=""> Discount Code </label>
                        <input
                          type="text"
                          name="code"
                          value={this.state.code}
                          onChange={this.handleInput}
                          className="form-control field"
                          placeholder="Enter your code"
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor=""> Discount Type </label>
                        <div className="input-holder">
                          <select
                            name="type"
                            id="type"
                            value={this.state.type}
                            onChange={this.handleInput}
                            className="form-control"
                          >
                            <option value="">---</option>
                            <option value="amount"> Amount </option>
                            <option value="percentage"> Percentage </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group type-1">
                    <div className="row">
                      <div className="col-md-6">
                        <label htmlFor="">
                          {' '}
                          Discount Price In {this.state.type}{' '}
                        </label>
                        <div className="input-holder">
                          <div className="left">
                            <input
                              type="number"
                              min="0"
                              className="form-control field"
                              name="price"
                              value={this.state.price}
                              onChange={this.handleInput}
                              placeholder={`Enter your ${this.state.type}`}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor=""> Discount Currency </label>
                        <select
                          name="currency"
                          id="currency"
                          value={this.state.currency}
                          className="form-control"
                          onChange={this.handleInput}
                        >
                          <option value="">--</option>
                          {this.state.coins.map((coin, key) => (
                            <option
                              value={coin.currencySymbol}
                              selected={
                                coin.currencySymbol === this.state.currency
                              }
                              key={coin.currencySymbol}
                            >
                              {coin.currencySymbol}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  <div className="form-group type-1">
                    <div className="row">
                      <div className="col-md-12">
                        <label htmlFor=""> Select Products </label>
                        <Select
                          name="product_ids"
                          options={this.state.productOptions}
                          placeholder="Select Product"
                          value={this.state.product_ids}
                          onChange={this.handleProductChange}
                          isSearchable
                          isMulti
                        />
                      </div>
                    </div>
                  </div>

                  {/* END :: FORM GROUP */}

                  {/* BEGIN :: FORM GROUP */}
                  <div className="form-group type-1 grid-2-equal">
                    <div className="left">
                      <label htmlFor=""> Start Date </label>
                      <DatePicker
                        selected={new Date(this.state.start_date)}
                        onChange={this.handleChangeStartDate}
                        name="start_date"
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>

                    <div className="right">
                      <label htmlFor=""> End Date </label>
                      <DatePicker
                        selected={new Date(this.state.end_date)}
                        onChange={this.handleChangeEndDate}
                        name="end_date"
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  {/* BEGIN :: FORM GROUP */}
                  <div className="form-group type-1 grid-2-equal">
                    <div className="left">
                      <label htmlFor=""> Start Time </label>
                      {/* <TimePicker onChange={this.handleChangeStartTime} value={this.state.start_time} /> */}
                      <div className="input-holder">
                        <select
                          name="start_time"
                          id="start_time"
                          value={this.state.start_time}
                          onChange={this.handleInput}
                          className="form-control"
                        >
                          <option value="">--</option>
                          {this.state.times.map((time, key) => (
                            <option
                              value={time.key}
                              selected={time.key === this.state.start_time}
                              key={key}
                            >
                              {time.value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="right">
                      <label htmlFor=""> End Time </label>
                      {/* <TimePicker onChange={this.handleChangeEndTime} value={this.state.end_time} /> */}
                      <div className="input-holder">
                        <select
                          name="end_time"
                          id="end_time"
                          value={this.state.end_time}
                          onChange={this.handleInput}
                          className="form-control"
                        >
                          <option value="">--</option>
                          {this.state.times.map((time, key) => (
                            <option
                              value={time.key}
                              selected={time.key === this.state.end_time}
                              key={key}
                            >
                              {time.value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  <div className="btn-groups pull-right ms-auto me-2">
                    <Button onClick={this.handleCancel} className="btn-2">
                      {' '}
                      Move to Previous{' '}
                    </Button>
                    <A href="/market-promotion-pricing">
                      <Button
                        className="btn-2"
                        onClick={(e) => this.submit(e, 2)}
                      >
                        {' '}
                        Save as Draft{' '}
                      </Button>
                    </A>
                    <A href="/market-promotion-pricing">
                      <Button className="btn-1"> Save & Continue </Button>
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

export default PromotionPricing;
