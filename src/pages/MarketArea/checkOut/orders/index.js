import React from 'react';
import A from '../../../../components/A';
import MarketMenu from '../../../../components/Menu/MarketMenu';
import {
  getPurchasedList,
  getTotalSales,
} from '../../../../http/product-checkout-calls';
import ProductReportModal from '../../_widgets/product/report';
import OrderList from './order_list';
import PurchasedList from './purchase_list';

require('../../_styles/market-area.scss');
require('./order.scss');
const json_datas = require('countrycitystatejson');

class MyOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      purchased_orders: [],
      country: '',
      search_key: '',
      product_id: '',
      countries: json_datas.getCountries(),
      isProductReport: false,
    };
    this.button = React.createRef();
  }

  componentDidMount() {
    this.fetchData();
    this.button.current.click();
  }

  fetchData(name, val) {
    const formData = {};
    this.setState({
      orders: [],
      purchased_orders: [],
    });
    if (name === 'country') {
      formData.country = val;
    }
    if (name === 'search_key') {
      formData.search_key = val;
    }
    getTotalSales(formData).then(
      async (resp) => {
        this.setState({
          orders: resp,
        });
      },
      (err) => {}
    );

    getPurchasedList(formData).then(
      async (resp) => {
        this.setState({
          purchased_orders: resp,
        });
      },
      (err) => {}
    );
  }

  handleChange = (e) => {
    const val = e.target.value;
    const { name } = e.target;

    this.setState({
      [name]: val,
    });
    this.fetchData(name, val);
  };

  handleClick() {
    this.fetchData();
  }

  handleCallbackReport = (data) => {
    this.setState({
      isProductReport: data.isProductReport,
      product_id: data.product_id,
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
            <div className="right">
              <div className="your-promotion-table-holder">
                <div className="head">
                  <div className="left">
                    <h2> Your Orders </h2>
                  </div>
                </div>
                <div>
                  <form>
                    <div className="filters-and-menu">
                      <div className="top">
                        <div className="left">
                          <select
                            name="country"
                            id="country"
                            required
                            value={this.state.country}
                            className="form-control"
                            onChange={this.handleChange}
                          >
                            <option value=""> All Location </option>
                            {this.state.countries.map((e, i) => (
                              <option value={e.shortName} key={e.shortName}>
                                {e.name}
                              </option>
                            ))}
                          </select>
                          <span className="icon">
                            {' '}
                            <i className="fa fa-map-marker" />{' '}
                          </span>
                        </div>

                        <div className="middle">
                          <input
                            name="search_key"
                            id="search_key"
                            type="text"
                            placeholder=""
                            onChange={this.handleChange}
                          />
                          <span className="icon">
                            {' '}
                            <i className="fa fa-search" />{' '}
                          </span>
                        </div>
                        <div className="right">
                          <A href="/market-dashboard">
                            <button className="btn-1"> Go to Dashboard </button>
                          </A>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="tabs-holder-dashboard">
                  <input
                    className="input-link"
                    type="radio"
                    id="tab-1"
                    name="tab-effect-1"
                    onClick={(e) => this.handleClick()}
                  />
                  <label
                    ref={this.button}
                    className="link-btn-2"
                    htmlFor="tab-1"
                  >
                    My Orders{' '}
                    <span className="badge"> {this.state.orders.length} </span>
                  </label>

                  <input
                    className="input-link"
                    type="radio"
                    id="tab-2"
                    name="tab-effect-1"
                    onClick={(e) => this.handleClick()}
                  />
                  <label className="link-btn-2" htmlFor="tab-2">
                    Purchased{' '}
                    <span className="badge">
                      {' '}
                      {this.state.purchased_orders.length}{' '}
                    </span>
                  </label>

                  <div className="border-line" />

                  <div className="tab-content your-promotion">
                    <section id="tab-item-1">
                      {this.state.orders.length > 0 && (
                        <OrderList orders={this.state.orders} />
                      )}
                    </section>
                    <section id="tab-item-2">
                      {this.state.purchased_orders.length > 0 && (
                        <PurchasedList
                          parentCallback={this.handleCallbackReport}
                          orders={this.state.purchased_orders}
                        />
                      )}
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {this.state.isProductReport && (
            <ProductReportModal
              parentCallback={this.handleCallbackReport}
              isProductReport={this.state.isProductReport}
              productId={this.state.product_id}
            />
          )}
        </div>
      </div>
    );
  }
}

export default MyOrders;
