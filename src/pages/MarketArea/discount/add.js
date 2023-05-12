import React from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { createDiscount, getDiscount } from '../../../http/promotion-calls';
import { alertBox } from '../../../commonRedux';
import A from '../../../components/A';
import Button from '../../../components/Button';
import { history } from '../../../store';
import MarketMenu from '../../../components/Menu/MarketMenu';
import { getAllProduct } from '../../../http/product-calls';

require('../_styles/market-area.scss');
const coins = require('../../Gionomy/add/coins.json');
const times = require('./time.json');

class DiscountAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins,
      times,
      currency: '',
      code: '',
      price: '',
      type: '',
      start_date: new Date(),
      end_date: new Date(),
      start_time: '10:00',
      end_time: '10:00',
      isValidAmount: true,
      isValidDiscount: true,
      productOptions: [],
      product_ids: [],
      discount_id: this.props.location.state
        ? this.props.location.state.discount_id
        : '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
    this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
  }

  validateNumberField = (myNumber) => {
    const numberRegEx = /-?\d*\.?\d{1,2}/;
    return numberRegEx.test(String(myNumber).toLowerCase());
  };

  componentDidMount() {
    if (this.state.discount_id) {
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
    let isValidDiscount = true;
    if (name === 'price') {
      isValidDiscount = this.validateNumberField(val);
    }
    if (name === 'currency') {
      getAllProduct({ currency: val }).then(
        (resp) => {
          const options = [];
          resp.map((data, key) => {
            console.log(' getAllProduct data', data, key);
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
                    <Link
                      to={{
                        pathname: `/market-product-detail-view/${data._id}`,
                      }}
                    >
                      <p className="media-heading">
                        {data.title} | {data.amount} - {data.price_currency}{' '}
                      </p>
                    </Link>
                  </div>
                </div>
              ),
            });
            console.log(' getAllProduct options', options);
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
      isValidDiscount,
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
    const err = [];
    const formData = {
      discount_id: this.state.discount_id,
    };
    getDiscount(formData).then(
      async (res) => {
        this.setState(res);
      },
      (error) => {
        err.push(error.message);
      }
    );
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

  submit = (e) => {
    e.preventDefault();
    const err = [];
    if (this.state.currency === '') err.push('Currency is required');
    if (this.state.price === '') err.push('Amount is required');
    if (this.state.type === '') err.push('Type is required');
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      const formData = this.state;
      createDiscount(formData).then(
        async (res) => {
          alertBox(true, 'Discount has been saved!', 'success');
          history.push({
            pathname: '/market-discounts',
          });
        },
        (error) => {
          alertBox(true, 'Error Update Promotion!');
        }
      );
    }
  };

  handleProductChange = (selected) => {
    console.log(selected);
    this.setState({
      product_ids: selected,
    });
  };

  render() {
    return (
      <div className="container-fluid container-layout">
        <div className="layout-2">
          <div className="left">
            <MarketMenu {...this.props} current="/" />
          </div>

          <div className="middle content">
            {/* <div className="left">
                <SideMenu3 />
              </div> */}

            {/* BEGIN :: RIGHT */}
            <div className="right">
              {/* BEGIN :: FORM HOLDER 1 */}
              <div className="form-holder-1">
                <div className="title-with-button-block">
                  <div className="title-block">
                    <h2> Create Your Discount </h2>
                  </div>
                </div>

                <form onSubmit={(e) => this.submit(e)} method="post">
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
                              key={key}
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
                    <A href="/market-discounts">
                      <Button className="btn-2"> Cancel </Button>
                    </A>
                    <A href="/market-discount-add">
                      <Button className="btn-1"> Save </Button>
                    </A>
                  </div>
                </form>
              </div>
              {/* END :: FORM HOLDER 1 */}
            </div>
          </div>
          {/* END :: RIGHT */}
        </div>
      </div>
    );
  }
}

export default DiscountAdd;
