import React from 'react';
import { Link } from 'react-router-dom';

import MarketMenu from '../../../../components/Menu/MarketMenu';
import SideMenu3 from '../../_widgets/sideMenu3';
import {
  getAllPromotion,
  getPromotionCount,
} from '../../../../http/promotion-calls';
import PromotionList from './promotionList';
import { getCurrentUser } from '../../../../http/token-interceptor';

require('../../_styles/market-area.scss');
require('./your-promotions.scss');

const currentUser = JSON.parse(getCurrentUser());

class YourPromotions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      promotions: [],
      active_promotions: [],
      draft_promotions: [],
      pause_promotions: [],
      in_active_promotions: [],
      active_count: 0,
      draft_count: 0,
      pause_count: 0,
      in_active_count: 0,
      total_count: 0,
    };
    this.button = React.createRef();
  }

  componentDidMount() {
    this.getData('all');
    this.button.current.click();
  }

  getData(status) {
    getPromotionCount().then(
      async (resp) => {
        this.setState(resp);
      },
      (error) => {}
    );
    this.setState({
      promotions: [],
      draft_promotions: [],
      active_promotions: [],
      in_active_promotions: [],
    });
    const formData = {
      userid: currentUser._id,
    };
    if (status !== 'all') {
      formData.status = status;
    }
    getAllPromotion(formData).then(
      async (resp) => {
        this.setState({ promotions: resp });
        if (status === 'draft') {
          this.setState({
            draft_promotions: resp,
            draft_count: resp.length,
          });
        }
        if (status === 'active') {
          this.setState({
            active_promotions: resp,
            active_count: resp.length,
          });
        }
        if (status === 'in_active') {
          this.setState({
            in_active_promotions: resp,
            in_active_count: resp.length,
          });
        }
      },
      (error) => {}
    );
  }

  handleClick(status) {
    this.getData(status);
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

                <div className="right ">
                  <div className="your-promotion-table-holder">
                    <div className="head">
                      <div className="left">
                        <h2> Your Promotions </h2>
                      </div>
                      <div className="right">
                        <Link to="/market-promotion-overview" className="btn-1">
                          {' '}
                          Create Promotion{' '}
                        </Link>
                      </div>
                    </div>

                    <div className="tabs-holder-dashboard">
                      <input
                        className="input-link"
                        type="radio"
                        id="tab-1"
                        name="tab-effect-1"
                        onClick={(e) => this.handleClick('all')}
                      />
                      <label
                        ref={this.button}
                        className="link-btn-2"
                        htmlFor="tab-1"
                      >
                        All{' '}
                        <span className="badge">
                          {' '}
                          {this.state.total_count}{' '}
                        </span>
                      </label>

                      <input
                        className="input-link"
                        type="radio"
                        id="tab-2"
                        name="tab-effect-1"
                        onClick={(e) => this.handleClick('active')}
                      />
                      <label className="link-btn-2" htmlFor="tab-2">
                        Active{' '}
                        <span className="badge">
                          {' '}
                          {this.state.active_count}{' '}
                        </span>
                      </label>

                      <input
                        className="input-link"
                        type="radio"
                        id="tab-3"
                        name="tab-effect-1"
                        onClick={(e) => this.handleClick('draft')}
                      />
                      <label className="link-btn-2" htmlFor="tab-3">
                        Draft{' '}
                        <span className="badge">
                          {' '}
                          {this.state.draft_count}{' '}
                        </span>
                      </label>

                      <input
                        className="input-link"
                        type="radio"
                        id="tab-4"
                        name="tab-effect-1"
                        onClick={(e) => this.handleClick('in_active')}
                      />
                      <label className="link-btn-2" htmlFor="tab-4">
                        In Active{' '}
                        <span className="badge">
                          {' '}
                          {this.state.in_active_count}{' '}
                        </span>
                      </label>

                      <div className="border-line" />

                      <div className="tab-content your-promotion">
                        <section id="tab-item-1">
                          {this.state.promotions.length > 0 && (
                            <PromotionList
                              promotions={this.state.promotions}
                              status="All"
                            />
                          )}
                        </section>
                        <section id="tab-item-2">
                          {this.state.active_promotions.length > 0 && (
                            <PromotionList
                              promotions={this.state.active_promotions}
                              status="Active"
                            />
                          )}
                        </section>

                        <section id="tab-item-3">
                          {this.state.draft_promotions.length > 0 && (
                            <PromotionList
                              promotions={this.state.draft_promotions}
                              status="Draft"
                            />
                          )}
                        </section>

                        <section id="tab-item-4">
                          {this.state.in_active_promotions.length > 0 && (
                            <PromotionList
                              promotions={this.state.in_active_promotions}
                              status="In Active"
                            />
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
    );
  }
}

export default YourPromotions;
