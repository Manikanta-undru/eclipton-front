import React, { Component } from 'react';
import { getUnreadMessageCount } from '../../../../http/product-chat-call';
import { getTotalSales } from '../../../../http/product-checkout-calls';
import { getAllBalance } from '../../../../http/wallet-calls';

class MarketInsight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_count: this.props.total_count,
      unreadmessage_count: 0,
      all_balance: [],
      total_sales_amount: 0,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    getUnreadMessageCount().then(
      async (resp) => {
        this.setState({
          unreadmessage_count: resp,
        });
      },
      (err) => {}
    );

    getAllBalance().then(
      async (resp) => {
        this.setState({
          all_balance: resp.data,
        });
      },
      (error) => {}
    );
    getTotalSales().then(
      async (resp) => {
        let balance = 0;
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
        });
        this.setState({
          total_sales_amount: balance,
        });
      },
      (err) => {}
    );
  }

  render() {
    return (
      <div className="market-insights-1">
        <div className="dashboard-table-holder">
          <div className="head">
            <div className="left">
              <h2> Marketplace Insights </h2>
            </div>

            <div className="right">
              {/* <div className="search-box-holder">
                        </div>
                        <div className="filter-holder">
                          <select name="" id="">
                            <option value=""> Last Week </option>
                          </select>
                        </div> */}
            </div>
          </div>
          <div className="content-holder">
            {/* BEGIN :: CONTENT BOX */}
            <div className="content-box">
              <p> Total Count </p>
              <h3>
                {' '}
                {this.state.total_count > 0
                  ? this.state.total_count
                  : this.props.total_count}{' '}
              </h3>
            </div>
            {/* END :: CONTENT BOX */}

            {/* BEGIN :: CONTENT BOX */}
            <div className="content-box">
              <p> Total Sales </p>
              <h3> ${this.state.total_sales_amount} </h3>
            </div>
            {/* END :: CONTENT BOX */}

            {/* BEGIN :: CONTENT BOX */}
            <div className="content-box">
              <p> Messages </p>
              <h3> {this.state.unreadmessage_count} </h3>
            </div>
            {/* END :: CONTENT BOX */}
          </div>
        </div>
      </div>
    );
  }
}

export default MarketInsight;
