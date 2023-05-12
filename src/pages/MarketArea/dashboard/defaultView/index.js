import React from 'react';
import { Link } from 'react-router-dom';

import MarketMenu from '../../../../components/Menu/MarketMenu';
import Inbox from '../../_widgets/inbox';
import Table1 from '../../_widgets/table1';
import Table2 from '../../_widgets/table2';
import { LineChart } from './line_chart';

require('../../_styles/market-area.scss');
require('../dashboard.scss');

class MarketDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.button = React.createRef();
  }

  componentDidMount() {
    this.button.current.click();
  }

  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout-1">
          <div className="layout-type-1">
            <div className="left">
              <MarketMenu {...this.props} current="/" />
              <Inbox />
            </div>

            <div className="middle">
              <div className="top">
                <div className="dashboard-title">
                  <div>
                    {' '}
                    <h2> Welcome Ameer! </h2>{' '}
                  </div>

                  <div className="pull-right ms-auto me-2">
                    {' '}
                    <Link className="btn-1" to="/market-create-ad">
                      {' '}
                      Create New Ad{' '}
                    </Link>{' '}
                  </div>
                </div>
              </div>

              {/* <DashboardProfile /> */}
              <LineChart />

              {/* BEGIN :: DASHBOARD TABLE */}
              <div className="dashboard-table-holder">
                <div className="head">
                  <div className="left">
                    <h2> Orders Statuses </h2>
                  </div>
                  <div className="right">
                    <div className="search-box-holder">
                      <span className="icon">
                        {' '}
                        <i className="fa fa-search" />{' '}
                      </span>
                      <input type="text" placeholder="search" />
                    </div>
                    <div className="filter-holder">
                      <select name="" id="">
                        <option value=""> Last Week </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="tabs-holder-dashboard">
                  <input
                    className="input-link"
                    type="radio"
                    id="tab-1"
                    name="tab-effect-1"
                  />
                  <label
                    ref={this.button}
                    className="link-btn-2"
                    htmlFor="tab-1"
                  >
                    New <span className="badge"> 16 </span>
                  </label>

                  <input
                    className="input-link"
                    type="radio"
                    id="tab-2"
                    name="tab-effect-1"
                  />
                  <label className="link-btn-2" htmlFor="tab-2">
                    Pending <span className="badge"> 16 </span>
                  </label>

                  <input
                    className="input-link"
                    type="radio"
                    id="tab-3"
                    name="tab-effect-1"
                  />
                  <label className="link-btn-2" htmlFor="tab-3">
                    Reviews <span className="badge"> 9 </span>
                  </label>

                  <input
                    className="input-link"
                    type="radio"
                    id="tab-4"
                    name="tab-effect-1"
                  />
                  <label className="link-btn-2" htmlFor="tab-4">
                    {`FAQ's `}
                    <span className="badge"> 12 </span>
                  </label>
                  <div className="border-line" />

                  <div className="tab-content">
                    <section id="tab-item-1">
                      <Table1 />
                    </section>
                    <section id="tab-item-2">
                      <Table2 />
                    </section>
                    <section id="tab-item-3">
                      <Table1 />
                    </section>
                    <section id="tab-item-4">
                      <Table2 />
                    </section>
                  </div>
                </div>
              </div>
              {/* END :: DASHBOARD TABLE */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MarketDashboard;
