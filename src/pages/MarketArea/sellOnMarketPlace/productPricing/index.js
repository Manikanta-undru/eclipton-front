import React from 'react';
import { alertBox } from '../../../../commonRedux';
import A from '../../../../components/A';
import { get, update } from '../../../../http/product-calls';
import SideMenu1 from '../../../../pages/MarketArea/_widgets/sideMenu1';
import Button from '../../../../components/Button';
import { history } from '../../../../store';
import { getAllPairs } from '../../../../http/wallet-calls';
import Select from 'react-select';

require('../../../../pages/MarketArea/_styles/market-area.scss');
require('./product-pricing.scss');
let coins = require('../../../Gionomy/add/coins.json');

class MarketProductPricing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      discount_period: '',
      coins: [],
      CurrencyOptions: [],
      isValidAmount: true,
      isValidDiscount: true,
      isValidDiscountPeriod: true,
      product_id: this.props.location.state,
      price_currency: '',
      amount: '',
      discount: '',
      availableCurrency: [],
    };
    this.handleCancel = this.handleCancel.bind(this);
  }

  validateNumberField = (myNumber) => {
    const numberRegEx = /\-?\d*\.?\d{1,2}/;
    return numberRegEx.test(String(myNumber).toLowerCase());
  };

  handleChange = (selected) => {
    console.log(selected);
    this.setState({
      availableCurrency: selected,
    });
  };

  CoinChange = (e) => {
    this.setState({
      price_currency: e.target.value,
    });
  };

  handleInput = (e) => {
    const val = e.target.value;
    const name = e.target.name;
    let isValidDiscountPeriod = true;
    if (name === 'discount_period') {
      isValidDiscountPeriod = this.validateNumberField(val);
    }
    this.setState({
      [name]: val,
      isValidDiscountPeriod,
    });
  };

  componentDidMount() {
    if (this.state.product_id) {
      this.fetchData();
      this.GetallCurrencies();
    }
  }
  GetallCurrencies() {
    getAllPairs().then(
      async (curdata) => {
        let coinsdata = curdata.data.filter((resp) => resp.curnType == 1);
        let currencydata = curdata.data.filter((resp) => resp.curnType == 0);
        this.setState({
          coins: coinsdata,
        });
        let options = [];
        currencydata.map((curr, key) => {
          options.push({ value: curr._id, label: curr.currencySymbol });
        });
        this.setState({
          CurrencyOptions: options,
        });
      },
      (error) => {
        this.setState({ coins: null });
      }
    );
  }

  fetchData() {
    const formData = {
      product_id: this.state.product_id,
    };
    get(formData).then(
      async (res) => {
        let resp = res[0];
        let files2 = [];
        let videos2 = [];
        if (resp.attachment) {
          for (let x in resp.attachment) {
            if (resp.attachment[x].type === 'Video') {
              videos2.push({
                content_url: resp.attachment[x].src,
              });
            } else {
              files2.push({
                content_url: resp.attachment[x].src,
              });
            }
          }
        }

        if (resp.availableCurrency && resp.availableCurrency.length > 0) {
          let AvaCurrency = resp.availableCurrency;
          let currencylist = [];
          for (let x in AvaCurrency) {
            currencylist.push({
              label: AvaCurrency[x].label,
              value: AvaCurrency[x].value,
            });
          }
          this.setState({
            availableCurrency: currencylist,
          });
        } else {
          let currencylist = resp.availableCurrency;
          this.setState({
            availableCurrency: currencylist,
          });
        }
        this.setState({
          loading: false,
          title: resp.title,
          condition: resp.condition,
          category: resp.category,
          target_audience: resp.target_audience,
          stock: resp.stock,
          size:
            resp.size == undefined ||
            resp.size[0] == undefined ||
            resp.size[0] == ''
              ? []
              : resp.size,
          userid: resp.userid,
          description: resp.description,
          editorContent: resp.editorContent,
          status: resp.status,
          discount_period:
            resp.discount_period == 'null' ||
            resp.discount_period == 'undefined'
              ? ''
              : resp.discount_period,
          files2: files2,
          videos2: videos2,
          faqs: resp.faqs,
          returns: resp.returns,
          sub_category: resp.sub_category,
          address: resp.address,
          country: resp.country,
          state: resp.state,
          city: resp.city,
          zipcode: resp.zipcode,
          price_currency: resp.price_currency,
          amount:
            resp.amount == 'null' || resp.amount == 'undefined'
              ? ''
              : resp.amount,
          discount:
            resp.discount == 'null' || resp.discount == 'undefined'
              ? ''
              : resp.discount,
        });
      },
      (error) => {}
    );
  }

  handleCancel() {
    history.push({
      pathname: '/market-product-description',
      state: this.state.product_id,
    });
  }

  submit = async (e, t) => {
    e.preventDefault();
    let status = t === 1 ? this.state.status : 'draft';
    let hashsize = '';
    let err = [];
    if (this.state.discount_period === '')
      err.push('Discount Period is required');
    if (!this.state.isValidDiscountPeriod)
      err.push(
        'Kindly enter the valid discount period. Only number is allowed'
      );
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      if (this.state.size.length > 0) {
        hashsize = this.state.size.join(',');
      }
      const formData = {
        discount_period: this.state.discount_period,
        product_id: this.state.product_id,
        title: this.state.title,
        condition: this.state.condition,
        category: this.state.category,
        target_audience: this.state.target_audience,
        stock: this.state.stock,
        size: hashsize,
        userid: this.state.userid,
        description: this.state.description,
        editorContent: this.state.editorContent,
        status: status,
        files2: JSON.stringify(this.state.files2),
        videos2: JSON.stringify(this.state.videos2),
        faqs: JSON.stringify(this.state.faqs),
        returns: JSON.stringify(this.state.returns),
        sub_category: this.state.sub_category,
        address: this.state.address,
        country: this.state.country,
        state: this.state.state,
        city: this.state.city,
        zipcode: this.state.zipcode,
        price_currency: this.state.price_currency,
        amount: this.state.amount,
        discount: this.state.discount,
        availableCurrency: this.state.availableCurrency,
      };
      update(formData).then(
        async (resp) => {
          if (t === 1) {
            alertBox(true, 'Pricing has been saved!', 'success');
            history.push({
              pathname: '/market-product-gallery-preview',
              state: this.state.product_id,
            });
          } else {
            alertBox(true, 'Pricing draft has been saved!', 'success');
            history.push({
              pathname: '/market-product-pricing',
              state: this.state.product_id,
            });
          }
        },
        (error) => {
          alertBox(true, error.message);
        }
      );
    }
  };

  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout">
          <div className="layout-2">
            {/* BEGIN :: LEFT */}
            <div className="left">
              <SideMenu1 />
            </div>
            {/* END :: LEFT */}

            {/* BEGIN :: RIGHT */}
            <div className="right">
              {/* BEGIN :: FORM HOLDER 1 */}
              <div className="form-holder-1">
                <div className="title-with-button-block">
                  <div className="title-block">
                    <h2> Create Your Product Pricing </h2>
                  </div>
                </div>

                <form onSubmit={(e) => this.submit(e, 1)} method="post">
                  <div className="form-group">
                    <div className="left">
                      <strong>Product Price</strong>
                    </div>
                    <div className="right">
                      <table className="table table-bordered">
                        <tr>
                          <td colSpan={2}>
                            <label htmlFor=""> Discount in days</label>
                            <input
                              type="text"
                              required
                              placeholder="in days"
                              step="1"
                              min="1"
                              name="discount_period"
                              className="form-control w-100"
                              value={this.state.discount_period}
                              onChange={this.handleInput}
                            />
                            {!this.state.isValidDiscountPeriod && (
                              <span style={{ color: 'red', width: '100%' }}>
                                Kindly enter the number
                              </span>
                            )}
                          </td>
                          <td colSpan={2}>
                            <label htmlFor=""> Discount percentage </label>
                            <input
                              type="number"
                              required
                              placeholder="in %"
                              step="1"
                              min="1"
                              name="discount"
                              className="form-control w-100"
                              value={this.state.discount}
                              onChange={this.handleInput}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor=""> Currency </label>
                            <select
                              name="currency"
                              value={this.state.price_currency}
                              onChange={this.CoinChange}
                              required
                              className="form-control w-100"
                            >
                              <option value="">--</option>
                              {this.state.coins.map((coin, key) => {
                                return (
                                  <option
                                    value={coin.currencySymbol}
                                    selected={
                                      coin.currencySymbol ===
                                      this.state.price_currency
                                    }
                                    key={coin.currencySymbol}
                                  >
                                    {coin.currencySymbol}
                                  </option>
                                );
                              })}
                            </select>
                          </td>
                          <td>
                            <label htmlFor=""> Price </label>
                            <span className="input-icon">
                              {' '}
                              {this.state.price_currency}
                            </span>
                            <input
                              type="number"
                              required
                              placeholder={this.state.price_currency}
                              step="1"
                              min="1"
                              name="amount"
                              className="form-control w-100"
                              value={this.state.amount}
                              onChange={this.handleInput}
                            />
                          </td>
                          <td>
                            <label htmlFor=""> Available Currency </label>
                            <Select
                              name="availableCurrency"
                              options={this.state.CurrencyOptions}
                              placeholder="Select Currency"
                              value={this.state.availableCurrency}
                              onChange={this.handleChange}
                              isSearchable={true}
                              isMulti
                            />
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>

                  {/* BEGIN :: FORM GROUP */}
                  {/* END :: FORM GROUP */}

                  <div className="btn-groups pull-right ms-auto me-2">
                    <Button onClick={this.handleCancel} className="btn-2">
                      {' '}
                      Move to Previous{' '}
                    </Button>
                    <A href="/market-product-pricing">
                      <Button
                        className="btn-2"
                        onClick={(e) => this.submit(e, 2)}
                      >
                        {' '}
                        Save as Draft{' '}
                      </Button>
                    </A>
                    <A href="/market-product-pricing">
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

export default MarketProductPricing;
