import React from 'react';
import { Link } from 'react-router-dom';
import MarketMenu from '../../../components/Menu/MarketMenu';
import SideMenu3 from '../_widgets/sideMenu3';
import { getCurrentUser } from '../../../http/token-interceptor';
import DiscountList from './list';
import { getAllDiscount } from '../../../http/promotion-calls';

require('../_styles/market-area.scss');
require('./discounts.scss');

const currentUser = JSON.parse(getCurrentUser());

class MarketDiscounts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      discounts: [],
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    getAllDiscount().then(
      async (resp) => {
        this.setState({ discounts: resp });
      },
      (error) => {}
    );
  };

  handleCallback(data) {
    if (data.status === 'success') {
      getAllDiscount().then(
        async (resp) => {
          this.setState({ discounts: resp });
        },
        (error) => {}
      );
    }
  }

  render() {
    return (
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
                      <h2> Your Discounts </h2>
                    </div>
                    <div className="right">
                      <Link to="/market-discount-add" className="btn-1">
                        {' '}
                        Create Discount{' '}
                      </Link>
                    </div>
                  </div>
                  {this.state.discounts.length > 0 && (
                    <DiscountList
                      discounts={this.state.discounts}
                      parentCallback={this.handleCallback}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MarketDiscounts;
