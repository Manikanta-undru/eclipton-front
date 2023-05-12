import React from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { Tabs, Tab } from 'react-bootstrap-tabs';

import './styles.scss';
import ReactDatePicker from 'react-datepicker';
import moment from 'moment';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import MarketMenu from '../../../../components/Menu/MarketMenu';
import OrderContent from './tabs_content/order';
import PromotionContent from './tabs_content/promotion';
import RecentContent from './tabs_content/recent';
import SearchContent from './tabs_content/search';
import {
  getAllOrder,
  getTotalSales,
} from '../../../../http/product-checkout-calls';
import { getAllPromotion } from '../../../../http/promotion-calls';
import 'react-datepicker/dist/react-datepicker.css';
import { topTrendingProduct } from '../../../../http/product-calls';
import { getAllBalance } from '../../../../http/wallet-calls';
import dashboardImg from '../../../../assets/images/market-place/marketplace-dashboard-right.svg';

require('../../_styles/market-area.scss');
require('../dashboard.scss');
const coins = require('../../../Gionomy/add/coins.json');

class MarketplaceDasboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: 'Order Status',
      coins,
      currency: '',
      success_orders: [],
      pending_orders: [],
      promotions: [],
      active_promotions: [],
      in_active_promotions: [],
      search_key: '',
      start_date: new Date(),
      end_date: new Date(),
      prev_total_sales_amount: '',
      total_sales_amount: '',
      total_sales_ratio: '',
      total_sales_ratio_text: '',
      products: [],
      chart_data: [],
    };
    this.myRef = React.createRef();
    this.myRef2 = React.createRef();
    this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
    this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  dataChange = (data = {}) => {
    if (data.search_key !== undefined) {
      this.fetchData(data.search_key, 'search_key');
    }
    if (data.start_date !== undefined) {
      this.fetchData(data.start_date, 'start_date');
    }
    if (data.end_date !== undefined) {
      this.fetchData(data.end_date, 'end_date');
    }
  };

  fetchData(data, key) {
    this.getAllOrders(data, key);
    this.getAllPromotions('all', data, key);
    this.getAllPromotions('active', data, key);
    this.getAllPromotions('in_active', data, key);
    this.getTrendingProducts(data, key);
    this.getTotalSalesAmount();
  }

  getTotalSalesAmount(data, key) {
    getAllBalance().then(
      async (resp) => {
        this.setState({
          all_balance: resp.data,
        });
      },
      (error) => {}
    );
    const formData = {};
    let format_start_date;
    if (key === 'currency') {
      formData.currency = data;
    }
    if (key === 'start_date') {
      formData.start_date = data;
      format_start_date = moment(data).format('DD-MM-YYYY');
    }
    let format_end_date;
    if (key === 'end_date') {
      formData.end_date = data;
      format_end_date = moment(data).format('DD-MM-YYYY');
    }
    if (format_start_date === undefined) {
      format_start_date = moment(this.state.start_date).format('DD-MM-YYYY');
    }
    if (format_end_date === undefined) {
      format_end_date = moment(this.state.end_date).format('DD-MM-YYYY');
    }
    const a = moment(format_start_date, 'DD-MM-YYYY');
    const b = moment(format_end_date, 'DD-MM-YYYY');
    let date_diff = a.diff(b, 'days');
    date_diff = date_diff === 0 ? -30 : date_diff;
    const prev_start_data = moment(this.state.start_date).subtract(
      date_diff,
      'days'
    );
    getTotalSales({
      start_date: new Date(prev_start_data),
      end_date: this.state.start_date,
    }).then(
      async (prev_resp) => {
        let prev_balance = 0;
        prev_resp.forEach((element) => {
          element.cart_items.forEach((data) => {
            if (
              this.state.all_balance !== undefined &&
              this.state.all_balance.length > 0
            ) {
              const balance_data = this.state.all_balance.find(
                (balance) =>
                  balance.currencySymbol === data.product_carts.currency
              );
              const estimatedUSD_value = balance_data.EstimatedUSD;
              prev_balance += element.total_price / estimatedUSD_value;
            }
          });
        });
        this.setState({
          prev_total_sales_amount: prev_balance,
        });

        getTotalSales(formData).then(
          async (resp) => {
            let balance = 0;
            const chart_data = [];
            resp.forEach((element) => {
              element.cart_items.forEach((data) => {
                if (
                  this.state.all_balance !== undefined &&
                  this.state.all_balance.length > 0
                ) {
                  const balance_data = this.state.all_balance.find(
                    (balance) =>
                      balance.currencySymbol === data.product_carts.currency
                  );
                  const estimatedUSD_value = balance_data.EstimatedUSD;
                  balance += element.total_price / estimatedUSD_value;
                }
              });
              chart_data.push({
                days: moment(element.createdAt).format('MMM DD, YYYY'),
                sales: balance,
              });
            });
            this.setState({
              total_sales_amount: balance,
              chart_data,
            });

            const prev_total_ratio = prev_balance / 100;
            const current_total_ratio = balance / 100;
            const total_sales_ratio_text =
              prev_total_ratio > current_total_ratio ? 'red' : 'green';
            const total_sales_ratio =
              prev_total_ratio < current_total_ratio
                ? current_total_ratio - prev_total_ratio
                : prev_total_ratio - current_total_ratio;
            this.setState({
              total_sales_ratio_text,
              total_sales_ratio,
            });
          },
          (err) => {}
        );
      },
      (err) => {}
    );
  }

  getTrendingProducts(data, key) {
    const formData = {};
    if (key === 'search_key') {
      formData.search_key = data;
    }
    if (key === 'start_date') {
      formData.start_date = data;
    }
    if (key === 'end_date') {
      formData.end_date = data;
    }
    topTrendingProduct(formData).then(
      async (resp) => {
        this.setState({
          products: resp,
        });
      },
      (err) => {}
    );
  }

  getAllOrders(data, key) {
    const formData = {};
    if (key === 'search_key') {
      formData.search_key = data;
    }
    if (key === 'start_date') {
      formData.start_date = data;
    }
    if (key === 'end_date') {
      formData.end_date = data;
    }
    getAllOrder(formData).then(
      async (resp) => {
        this.setState({
          success_orders: resp.success_data,
          pending_orders: resp.pending_data,
        });
      },
      (err) => {}
    );
  }

  getAllPromotions(status, data, key) {
    this.setState({
      promotions: [],
      active_promotions: [],
      in_active_promotions: [],
    });
    const formData = {};
    if (status !== 'all') {
      formData.status = status;
    }

    if (key === 'search_key') {
      formData.search_key = data;
    }
    if (key === 'start_date') {
      formData.start_date = data;
    }
    if (key === 'end_date') {
      formData.end_date = data;
    }

    getAllPromotion(formData).then(
      async (resp) => {
        if (status === 'all') {
          this.setState({ promotions: resp });
        }
        if (status === 'active') {
          this.setState({
            active_promotions: resp,
          });
        }
        if (status === 'in_active') {
          this.setState({
            in_active_promotions: resp,
          });
        }
      },
      (error) => {}
    );
  }

  handleChangeStartDate(date) {
    this.setState({
      start_date: date,
    });
    this.getTotalSalesAmount(date, 'start_date');
  }

  handleChangeEndDate(date) {
    this.setState({
      end_date: date,
    });
    this.getTotalSalesAmount(date, 'end_date');
  }

  handleInput = (e) => {
    const val = e.target.value;
    const { name } = e.target;
    this.setState({
      [name]: val,
    });
    this.getTotalSalesAmount(val, 'currency');
  };

  render() {
    const data = [{ days: '', sales: 0 }];

    return (
      <div className="market-place-styles">
        <div className="marketplaceDasboard">
          <div className="container-fluid containerSize">
            <div className="contentArea">
              <div className="left">
                <MarketMenu {...this.props} current="/" />
                {/* <Inbox /> */}
              </div>
              <div className="rightAlign_9">
                <div className="chartContent">
                  <div className="row">
                    <div className="col-md-6">
                      <h2>Welcome Kennady!</h2>
                    </div>
                    <div className="col-md-6 d-flex align-items-center">
                      <a
                        href="/market-default-view"
                        className="chartBtn ms-auto"
                      >
                        Create New Add
                      </a>
                    </div>
                  </div>
                  <div className="chartBox">
                    <div className="row">
                      <div className="col-md-4">
                        <h4 className="chartH4">
                          Total Sales
                          <span className="span1">
                            ${this.state.total_sales_amount}
                          </span>
                          <br />
                          <span className="chartValue">
                            {this.state.total_sales_ratio_text === 'green' ? (
                              <i className="fa fa-long-arrow-up green" />
                            ) : (
                              <i className="fa fa-long-arrow-down red" />
                            )}
                            &nbsp;{' '}
                            {parseInt(this.state.total_sales_ratio).toFixed(2)}%
                          </span>
                        </h4>
                      </div>
                      <div className="col-md-8">
                        <form className="form-inline  d-flex">
                          <div className="form-group me-2">
                            <label htmlFor="inputPassword6">Currency :</label>
                            <select
                              style={{ marginBottom: -16 }}
                              name="currency"
                              id="currency"
                              value={this.state.currency}
                              className="form-control"
                              onChange={this.handleInput}
                            >
                              <option value=""> Select Currency </option>
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
                            &nbsp;&nbsp;&nbsp;
                          </div>
                          <div className="form-group me-2">
                            <label htmlFor="inputPassword6">Form :</label>
                            {this.state.start_date !== undefined && (
                              <ReactDatePicker
                                selected={new Date(this.state.start_date)}
                                onChange={this.handleChangeStartDate}
                                name="start_date"
                                dateFormat="dd/MM/yyyy"
                              />
                            )}
                          </div>
                          <div className="form-group">
                            <label htmlFor="inputPassword6">To :</label>
                            {this.state.end_date !== undefined && (
                              <ReactDatePicker
                                selected={new Date(this.state.end_date)}
                                onChange={this.handleChangeEndDate}
                                name="end_date"
                                dateFormat="dd/MM/yyyy"
                              />
                            )}
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-8">
                        <div className="marketplaceChart_box">
                          {this.state.chart_data !== undefined &&
                          this.state.chart_data.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                              <LineChart
                                width={100}
                                height={300}
                                data={this.state.chart_data}
                                margin={{
                                  top: 10,
                                  right: 30,
                                  left: 0,
                                  bottom: 0,
                                }}
                              >
                                <CartesianGrid
                                  stroke="#dedede"
                                  strokeDasharray="3 3"
                                />
                                <XAxis dataKey="days" stroke="#9296AF" />
                                <YAxis stroke="#9296AF" />
                                <Tooltip />
                                <Line
                                  type="monotone"
                                  dataKey="sales"
                                  stroke="#5931ea"
                                  fill="#5931ea"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          ) : (
                            <ResponsiveContainer width="100%" height={300}>
                              <LineChart
                                width={100}
                                height={300}
                                data={data}
                                margin={{
                                  top: 10,
                                  right: 30,
                                  left: 0,
                                  bottom: 0,
                                }}
                              >
                                <CartesianGrid
                                  stroke="#dedede"
                                  strokeDasharray="3 3"
                                />
                                <XAxis dataKey="days" stroke="#9296AF" />
                                <YAxis stroke="#9296AF" />
                                <Tooltip />
                                <Line
                                  type="monotone"
                                  dataKey="sales"
                                  stroke="#5931ea"
                                  fill="#5931ea"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="marketplaceChart_box_img">
                          <img src={dashboardImg} className="img-fluid" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="statusTables">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="statusTables_tab">
                        <Tabs
                          onSelect={(index, label) =>
                            this.setState({
                              label,
                              search_key: '',
                            })
                          }
                        >
                          <Tab label="Order Status">
                            <div className="statusTables_tab_top">
                              <div className="row mb-4">
                                <div className="col-lg-3 col-md-12">
                                  <h4>Order Status</h4>
                                </div>
                                <SearchContent
                                  dataChange={this.dataChange}
                                  search_key={this.state.search_key}
                                />
                              </div>
                              <div className="statusTables_tab_list">
                                <Tabs
                                  onSelect={(index, label) =>
                                    console.log(`${label} selected`)
                                  }
                                >
                                  <Tab
                                    label={`Success - ${this.state.success_orders.length}`}
                                  >
                                    <div className="table-responsive">
                                      <OrderContent
                                        orders={this.state.success_orders}
                                      />
                                    </div>
                                  </Tab>
                                  <Tab
                                    label={`Pending - ${this.state.pending_orders.length}`}
                                  >
                                    <div className="table-responsive">
                                      <OrderContent
                                        orders={this.state.pending_orders}
                                      />
                                    </div>
                                  </Tab>
                                </Tabs>
                              </div>
                            </div>
                          </Tab>
                          <Tab label="Promotion Status">
                            <div className="statusTables_tab_top">
                              <div className="row mb-4">
                                <div className="col-lg-3 col-md-12">
                                  <h4>Promotion Status</h4>
                                </div>
                                <SearchContent
                                  dataChange={this.dataChange}
                                  search_key={this.state.search_key}
                                />
                              </div>
                              <div className="statusTables_tab_list">
                                <Tabs
                                  onSelect={(index, label) =>
                                    this.setState({
                                      label,
                                      search_key: '',
                                    })
                                  }
                                >
                                  <Tab
                                    label={`All - ${this.state.promotions.length}`}
                                  >
                                    <div className="table-responsive">
                                      <PromotionContent
                                        promotions={this.state.promotions}
                                      />
                                    </div>
                                  </Tab>
                                  <Tab
                                    label={`Active - ${this.state.active_promotions.length}`}
                                  >
                                    <div className="table-responsive">
                                      <PromotionContent
                                        promotions={
                                          this.state.active_promotions
                                        }
                                      />
                                    </div>
                                  </Tab>
                                  <Tab
                                    label={`Inactive - ${this.state.in_active_promotions.length}`}
                                  >
                                    <div className="table-responsive">
                                      <PromotionContent
                                        promotions={
                                          this.state.in_active_promotions
                                        }
                                      />
                                    </div>
                                  </Tab>
                                </Tabs>
                              </div>
                            </div>
                          </Tab>
                          <Tab label="Top Trending Sales">
                            <div className="statusTables_tab_top">
                              <div className="row mb-4">
                                <div className="col-lg-3 col-md-12">
                                  <h4>Top Trending Sales</h4>
                                </div>
                                <SearchContent
                                  dataChange={this.dataChange}
                                  search_key={this.state.search_key}
                                />
                              </div>
                              <div className="statusTables_tab_list">
                                <div className="table-responsive">
                                  <RecentContent
                                    products={this.state.products}
                                  />
                                </div>
                              </div>
                            </div>
                          </Tab>
                        </Tabs>
                      </div>
                    </div>
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

export default MarketplaceDasboard;
