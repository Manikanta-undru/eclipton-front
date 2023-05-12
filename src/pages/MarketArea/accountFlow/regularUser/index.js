import React from 'react';
import { Link } from 'react-router-dom';

import ProductType2 from '../../_widgets/product/productType2';
import MarketMenu from '../../../../components/Menu/MarketMenu';
import { getAll, getCount } from '../../../../http/product-calls';
import SideMenu3 from '../../_widgets/sideMenu3';
import MarketInsight from './insight';
import { getCurrentUser } from '../../../../http/token-interceptor';

require('../../_styles/market-area.scss');
require('./regular.scss');

const currentUser = JSON.parse(getCurrentUser());

class RegularUser extends React.Component {
  constructor(props) {
    super(props);
    this.button = React.createRef();
    this.state = {
      products: [],
      publish_products: [],
      draft_products: [],
      sold_products: [],
      out_of_stock_products: [],
      publish_count: 0,
      draft_count: 0,
      sold_count: 0,
      out_of_stock_count: 0,
      total_count: 0,
    };
  }

  componentDidMount() {
    this.button.current.click();
    this.fetchCount();
    this.fetchAllProduct('publish');
  }

  fetchCount() {
    const err = [];
    getCount().then(
      async (resp) => {
        this.setState(resp);
      },
      (error) => {
        err.push(error.message);
      }
    );
  }

  fetchAllProduct(status) {
    const err = [];
    let formData;
    this.setState({
      draft_products: [],
      publish_products: [],
      sold_products: [],
      out_of_stock_products: [],
    });
    if (status) {
      formData = {
        userid: currentUser._id,
        status,
      };
    }
    getAll(formData).then(
      async (resp) => {
        this.fetchCount();
        if (status === 'draft') {
          this.setState({
            draft_products: resp,
          });
        }
        if (status === 'publish') {
          this.setState({
            publish_products: resp,
          });
        }
        if (status === 'mark-as-sold') {
          this.setState({
            sold_products: resp,
          });
        }
        if (status === 'out-of-stock') {
          this.setState({
            out_of_stock_products: resp,
          });
        }
      },
      (error) => {
        err.push(error.message);
      }
    );
  }

  handleClick(status) {
    this.fetchAllProduct(status);
  }

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
                  <MarketInsight total_count={this.state.total_count} />

                  <div className="market-listings-1">
                    <div className="dashboard-table-holder">
                      <div className="head">
                        <div className="left">
                          <h2>
                            Your Listings
                            <span className="badge">
                              {' '}
                              ({this.state.total_count}){' '}
                            </span>
                          </h2>
                        </div>
                        <div className="right">
                          <div className="search-box-holder" />
                          <div className="pull-right ms-auto me-2">
                            <Link
                              to="/market-product-overview"
                              className="btn-1"
                            >
                              {' '}
                              Create New Ad{' '}
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="tabs-holder-dashboard">
                        <input
                          className="input-link"
                          type="radio"
                          id="tab-1"
                          name="tab-effect-1"
                          onClick={(e) => this.handleClick('publish')}
                        />
                        <label
                          ref={this.button}
                          className="link-btn-2"
                          htmlFor="tab-1"
                        >
                          Publish{' '}
                          <span className="badge">
                            {' '}
                            {this.state.publish_count}{' '}
                          </span>
                        </label>

                        <input
                          className="input-link"
                          type="radio"
                          id="tab-2"
                          name="tab-effect-1"
                          onClick={(e) => this.handleClick('draft')}
                        />
                        <label className="link-btn-2" htmlFor="tab-2">
                          Draft{' '}
                          <span className="badge">
                            {' '}
                            {this.state.draft_count}{' '}
                          </span>
                        </label>

                        <input
                          className="input-link"
                          type="radio"
                          id="tab-3"
                          name="tab-effect-1"
                          onClick={(e) => this.handleClick('mark-as-sold')}
                        />
                        <label className="link-btn-2" htmlFor="tab-3">
                          Sold{' '}
                          <span className="badge">
                            {' '}
                            {this.state.sold_count}{' '}
                          </span>
                        </label>

                        <input
                          className="input-link"
                          type="radio"
                          id="tab-4"
                          name="tab-effect-1"
                          onClick={(e) => this.handleClick('out-of-stock')}
                        />
                        <label className="link-btn-2" htmlFor="tab-4">
                          Out of Stock{' '}
                          <span className="badge">
                            {' '}
                            {this.state.out_of_stock_count}{' '}
                          </span>
                        </label>
                        <div className="border-line" />

                        <div className="tab-content">
                          <section id="tab-item-1">
                            {this.state.publish_products.length > 0 && (
                              <div className="product-wrapper grid-2">
                                <ProductType2
                                  products={this.state.publish_products}
                                />
                              </div>
                            )}
                          </section>
                          <section id="tab-item-2">
                            {this.state.draft_products.length > 0 && (
                              <div className="product-wrapper grid-2">
                                <ProductType2
                                  products={this.state.draft_products}
                                />
                              </div>
                            )}
                          </section>
                          <section id="tab-item-3">
                            {this.state.sold_products.length > 0 && (
                              <div className="product-wrapper grid-2">
                                <ProductType2
                                  products={this.state.sold_products}
                                />
                              </div>
                            )}
                          </section>
                          <section id="tab-item-4">
                            {this.state.out_of_stock_products.length > 0 && (
                              <div className="product-wrapper grid-2">
                                <ProductType2
                                  products={this.state.out_of_stock_products}
                                />
                              </div>
                            )}
                          </section>
                        </div>
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

export default RegularUser;
