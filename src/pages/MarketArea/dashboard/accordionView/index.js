import React from 'react';
import { Link } from 'react-router-dom';

import MarketMenu from '../../../../components/Menu/MarketMenu';
import Inbox from '../../_widgets/inbox';
import Table1 from '../../_widgets/table1';

require('../../_styles/market-area.scss');
require('../dashboard.scss');

class MarketDashboardAccordion extends React.Component {
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
                    <Link className="btn-1"> Create New Ad </Link>{' '}
                  </div>
                </div>
              </div>

              {/* <DashboardProfile /> */}

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

                <div className="accordion-holder-dashboard">
                  <div className="holder">
                    <input type="checkbox" name="accordion1" id="accordion1" />
                    <label ref={this.button} htmlFor="accordion1">
                      {' '}
                      New Orders - <span className="badge"> 0 </span>{' '}
                    </label>

                    <div className="table-holder">
                      <Table1 />
                    </div>
                  </div>

                  <div className="holder">
                    <input type="checkbox" name="accordion2" id="accordion2" />
                    <label htmlFor="accordion2">
                      {' '}
                      Pending Products - <span className="badge"> 0 </span>{' '}
                    </label>

                    <div className="table-holder">
                      <Table1 />
                    </div>
                  </div>

                  <div className="holder">
                    <input type="checkbox" name="accordion3" id="accordion3" />
                    <label htmlFor="accordion3">
                      {' '}
                      Approved Products - <span className="badge">
                        {' '}
                        12{' '}
                      </span>{' '}
                    </label>

                    <div className="table-holder">
                      <Table1 />
                    </div>
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

export default MarketDashboardAccordion;
