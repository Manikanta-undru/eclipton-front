import React from 'react';
import { Link } from 'react-router-dom';

import MarketMenu from '../../../../components/Menu/MarketMenu';
import Inbox from '../../_widgets/inbox';

import emptyIcon from '../../../../assets/images/market-place/icons/empty.png';

require('../../_styles/market-area.scss');

class MarketDashboardEmpty extends React.Component {
  render() {
    return (
      <div className="container-fluid container-layout-1">
        <div className="layout-type-1">
          <div className="left">
            <MarketMenu {...this.props} current="/" />
            <Inbox />
          </div>

          <div className="middle">
            <div className="common-empty-box">
              <div className="holder">
                <img src={emptyIcon} alt="" />
                <h3> {`You didn't create any Product for sale, yet! `}</h3>
                <p>
                  Try to create a product in order to sell on marketplace, so
                  users can buy as early as possible.
                </p>
                <Link to="/" className="btn-1">
                  {' '}
                  Let’s Create an Ad{' '}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MarketDashboardEmpty;
